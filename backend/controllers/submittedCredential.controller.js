import { asyncHandler } from "../utils/asyncHandler.js";
import { SubmittedCredential } from "../models/submittedCredential.models.js";
import { Student } from "../models/user.models.js";
import { Verifier } from "../models/verifier.models.js";
import cloudinary from "../config/cloudinary.js";
import crypto from "crypto";

// POST /api/submitted-credentials/upload
const uploadStudentDocument = asyncHandler(async (req, res) => {
  const { studentWalletAddress, companyName, documentName } = req.body;
  
  if (!req.file) {
    return res.status(400).json({ 
      success: false, 
      message: "No file uploaded" 
    });
  }

  if (!studentWalletAddress || !companyName) {
    return res.status(400).json({ 
      success: false, 
      message: "Student wallet address and company name are required" 
    });
  }

  try {
    // Verify student exists
    const student = await Student.findOne({ walletAddress: studentWalletAddress });
    if (!student) {
      return res.status(404).json({ 
        success: false, 
        message: "Student not found" 
      });
    }

    // Find verifier by company name (verifierName field)
    const verifier = await Verifier.findOne({ verifierName: companyName });
    if (!verifier) {
      return res.status(404).json({ 
        success: false, 
        message: "Verifier not found with the given company name" 
      });
    }

    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "student-credentials",
      resource_type: "auto"
    });

    // Generate credential hash
    const credentialHash = crypto
      .createHash("sha256")
      .update(result.public_id + studentWalletAddress + verifier.walletAddress + Date.now())
      .digest("hex");

    // Generate unique ID for the submitted credential
    const credentialId = crypto
      .createHash("md5")
      .update(credentialHash + Date.now())
      .digest("hex");

    // Create submitted credential record
    const submittedCredential = await SubmittedCredential.create({
      _id: credentialId,
      studentWalletAddress,
      verifierWalletAddress: verifier.walletAddress,
      credentialHash,
      submissionDate: new Date(),
      cloudinaryUrl: result.secure_url,
      cloudinaryPublicId: result.public_id,
      fileSize: req.file.size,
      mimeType: req.file.mimetype
    });

    res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      data: {
        credentialId: submittedCredential._id,
        credentialHash: submittedCredential.credentialHash,
        cloudinaryUrl: submittedCredential.cloudinaryUrl,
        submissionDate: submittedCredential.submissionDate,
        verifierName: verifier.verifierName,
        verifierWalletAddress: verifier.walletAddress
      }
    });

  } catch (error) {
    console.error("Error uploading document:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error uploading document", 
      error: error.message 
    });
  }
});

// GET /api/submitted-credentials/verifier/:verifierWalletAddress
const getCredentialsForVerifier = asyncHandler(async (req, res) => {
  const { verifierWalletAddress } = req.params;

  if (!verifierWalletAddress) {
    return res.status(400).json({ 
      success: false, 
      message: "Verifier wallet address is required" 
    });
  }

  try {
    // Verify verifier exists
    const verifier = await Verifier.findOne({ walletAddress: verifierWalletAddress });
    if (!verifier) {
      return res.status(404).json({ 
        success: false, 
        message: "Verifier not found" 
      });
    }

    // Fetch all submitted credentials for this verifier
    const credentials = await SubmittedCredential.find({ 
      verifierWalletAddress 
    }).sort({ submissionDate: -1 });

    // Get student details for each credential
    const credentialsWithStudentInfo = await Promise.all(
      credentials.map(async (cred) => {
        const student = await Student.findOne({ 
          walletAddress: cred.studentWalletAddress 
        }).select("firstName lastName Username email");

        return {
          credentialId: cred._id,
          studentWalletAddress: cred.studentWalletAddress,
          studentName: student ? `${student.firstName} ${student.lastName}` : "Unknown",
          studentUsername: student ? student.Username : "Unknown",
          studentEmail: student ? student.email : "Unknown",
          credentialHash: cred.credentialHash,
          cloudinaryUrl: cred.cloudinaryUrl,
          submissionDate: cred.submissionDate,
          fileSize: cred.fileSize,
          mimeType: cred.mimeType
        };
      })
    );

    res.status(200).json({
      success: true,
      data: {
        verifier: {
          name: verifier.verifierName,
          walletAddress: verifier.walletAddress
        },
        credentials: credentialsWithStudentInfo,
        totalCount: credentialsWithStudentInfo.length
      }
    });

  } catch (error) {
    console.error("Error fetching credentials:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error fetching credentials", 
      error: error.message 
    });
  }
});

// GET /api/submitted-credentials/student/:studentWalletAddress
const getCredentialsForStudent = asyncHandler(async (req, res) => {
  const { studentWalletAddress } = req.params;

  if (!studentWalletAddress) {
    return res.status(400).json({ 
      success: false, 
      message: "Student wallet address is required" 
    });
  }

  try {
    // Verify student exists
    const student = await Student.findOne({ walletAddress: studentWalletAddress });
    if (!student) {
      return res.status(404).json({ 
        success: false, 
        message: "Student not found" 
      });
    }

    // Fetch all submitted credentials for this student
    const credentials = await SubmittedCredential.find({ 
      studentWalletAddress 
    }).sort({ submissionDate: -1 });

    // Get verifier details for each credential
    const credentialsWithVerifierInfo = await Promise.all(
      credentials.map(async (cred) => {
        const verifier = await Verifier.findOne({ 
          walletAddress: cred.verifierWalletAddress 
        }).select("verifierName email");

        return {
          credentialId: cred._id,
          verifierWalletAddress: cred.verifierWalletAddress,
          verifierName: verifier ? verifier.verifierName : "Unknown",
          verifierEmail: verifier ? verifier.email : "Unknown",
          credentialHash: cred.credentialHash,
          cloudinaryUrl: cred.cloudinaryUrl,
          submissionDate: cred.submissionDate,
          fileSize: cred.fileSize,
          mimeType: cred.mimeType
        };
      })
    );

    res.status(200).json({
      success: true,
      data: {
        student: {
          name: `${student.firstName} ${student.lastName}`,
          walletAddress: student.walletAddress
        },
        credentials: credentialsWithVerifierInfo,
        totalCount: credentialsWithVerifierInfo.length
      }
    });

  } catch (error) {
    console.error("Error fetching student credentials:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error fetching student credentials", 
      error: error.message 
    });
  }
});

export { 
  uploadStudentDocument, 
  getCredentialsForVerifier, 
  getCredentialsForStudent 
};