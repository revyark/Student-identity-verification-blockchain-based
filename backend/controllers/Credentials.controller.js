import { asyncHandler } from "../utils/asyncHandler.js";
import { Credential } from "../models/credential.models.js";
import { Student } from "../models/user.models.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

// Issue a new credential for a student
// Persists to MongoDB using the Credential schema
const issueCredential = asyncHandler(async (req, res) => {
  const {
    credentialName,
    isssuerWalletAddress,
    studentWalletAddress,
    credentialHash,
    credentialType,
    issueDate,
    expiryDate,
    issuerSignature,
    credentialScore
  } = req.body;

  if (
    !credentialName ||
    !isssuerWalletAddress ||
    !studentWalletAddress ||
    !credentialHash ||
    !credentialType ||
    !issueDate ||
    !issuerSignature
  ) {
    res.status(400);
    throw new Error("Please provide all required credential fields");
  }

  const existing = await Credential.findOne({ credentialHash });
  if (existing) {
    res.status(400);
    throw new Error("Credential with this hash already exists");
  }

  // Optional: verify student existence by wallet address
  const student = await Student.findOne({ walletAddress: studentWalletAddress });
  if (!student) {
    res.status(404);
    throw new Error("Student not found for the provided wallet address");
  }

  const credential = new Credential({
    _id: credentialHash,
    credentialName,
    isssuerWalletAddress,
    studentWalletAddress,
    credentialHash,
    credentialType,
    issueDate,
    expiryDate,
    issuerSignature,
    cloudinaryUrl: req.body.cloudinaryUrl,
    status: "issued",
    credentialScore: credentialScore ?? 0
  });

  await credential.save();

  return res.status(201).json({
    message: "Credential issued successfully",
    credential
  });
});

// Revoke an existing credential by hash (or id)
const revokeCredential = asyncHandler(async (req, res) => {
  const { credentialHash } = req.params;
  if (!credentialHash) {
    res.status(400);
    throw new Error("credentialHash param is required");
  }

  const credential = await Credential.findOne({ credentialHash });
  if (!credential) {
    res.status(404);
    throw new Error("Credential not found");
  }

  if (credential.status === "revoked") {
    return res.status(200).json({ message: "Credential already revoked", credential });
  }

  credential.status = "revoked";
  await credential.save();

  return res.status(200).json({ message: "Credential revoked successfully", credential });
});

export { issueCredential, revokeCredential };

// Upload credential file to Cloudinary
const uploadCredentialFile = asyncHandler(async (req, res) => {
  if (!req.file || !req.file.path) {
    res.status(400);
    throw new Error("No file uploaded");
  }
  try {
    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: 'credentials',
      resource_type: 'auto',
      use_filename: true,
      unique_filename: true,
      overwrite: false
    });
    // cleanup temp file
    fs.unlink(req.file.path, () => {});
    return res.status(201).json({
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
      original_filename: uploadResult.original_filename,
      bytes: uploadResult.bytes,
      format: uploadResult.format,
      created_at: uploadResult.created_at
    });
  } catch (err) {
    // Include error details for easier debugging
    console.error('Cloudinary upload error:', err && err.message ? err.message : err);
    return res.status(500).json({ message: 'Cloudinary upload failed', details: err && err.message ? err.message : String(err) });
  }
});

export { uploadCredentialFile };

// Get credentials for a student by wallet or id
const listStudentCredentials = asyncHandler(async (req, res) => {
  const { studentId } = req.params; // can be walletAddress or Mongo _id
  const { status } = req.query; // optional filter: issued/revoked
  let finder = { studentWalletAddress: studentId };
  // allow query by student Mongo _id by joining via Student
  if (studentId && studentId.length === 24) {
    // try finding student by _id
    try {
      const student = await Student.findById(studentId).select('walletAddress');
      if (student && student.walletAddress) {
        finder = { studentWalletAddress: student.walletAddress };
      }
    } catch (_) {}
  }

  if (status && (status === 'issued' || status === 'revoked')) {
    finder.status = status;
  }
  const creds = await Credential.find(finder)
    .select('-__v')
    .sort({ issueDate: -1 });
  return res.status(200).json({ credentials: creds });
});

export { listStudentCredentials };