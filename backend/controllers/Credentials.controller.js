import { asyncHandler } from "../utils/asyncHandler.js";
import { Credential } from "../models/credential.models.js";
import { Student } from "../models/user.models.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";
import { generateCredentialHash, generateContentHash } from "../utils/hashGenerator.js";
import { certificates, web3, account, verified_contract, student_registry, instituteAccount } from "../config/web3config.js";

// Issue a new credential for a student
// Persists to MongoDB using the Credential schema
const issueCredential = asyncHandler(async (req, res) => {
  console.log(`[issueCredential] Request received:`, req.body);
  
  const {
    credentialName,
    isssuerWalletAddress,
    studentWalletAddress,
    contentHash,
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
    !contentHash ||
    !credentialHash ||
    !credentialType ||
    !issueDate ||
    !issuerSignature
  ) {
    console.log(`[issueCredential] Missing required fields:`, {
      credentialName: !!credentialName,
      isssuerWalletAddress: !!isssuerWalletAddress,
      studentWalletAddress: !!studentWalletAddress,
      contentHash: !!contentHash,
      credentialHash: !!credentialHash,
      credentialType: !!credentialType,
      issueDate: !!issueDate,
      issuerSignature: !!issuerSignature
    });
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

  // Log blockchain connection details
  console.log("[issueCredential] Using admin account:", account && account.address);
  console.log("[issueCredential] Using institute account:", instituteAccount && instituteAccount.address);
  console.log("[issueCredential] Certificate contract:", certificates && certificates.options && certificates.options.address);
  
  // Validate wallet addresses
  if (!isssuerWalletAddress || !isssuerWalletAddress.startsWith('0x') || isssuerWalletAddress.length !== 42) {
    res.status(400);
    throw new Error("Invalid issuer wallet address format");
  }
  
  if (!studentWalletAddress || !studentWalletAddress.startsWith('0x') || studentWalletAddress.length !== 42) {
    res.status(400);
    throw new Error("Invalid student wallet address format");
  }
  
  // First, write to blockchain
  try {
    // Check if the institute account is a verified institution
    let isVerified = await verified_contract.methods.checkVerification(instituteAccount.address).call();
    
    // If not verified, try to register it as a verified institution (using admin account)
    if (!isVerified) {
      console.log("[issueCredential] Institute account not verified, attempting to register as verified institution...");
      try {
        const registerTx = await verified_contract.methods
          .setVerificationStatus(instituteAccount.address, true)
          .send({ from: account.address, gas: 500000 });
        
        console.log("[issueCredential] ✅ Institute account registered as verified institution. Tx:", registerTx.transactionHash);
        isVerified = true;
      } catch (registerErr) {
        console.error("[issueCredential] ❌ Failed to register institute account as verified institution:", registerErr.message);
        res.status(403);
        throw new Error("Institute account is not a verified institution and could not be registered");
      }
    }
    
    // Check if the student is registered
    let isStudentRegistered = await student_registry.methods.isRegistered(studentWalletAddress).call();
    
    // If student is not registered, try to register them
    if (!isStudentRegistered) {
      console.log("[issueCredential] Student not registered, attempting to register...");
      try {
        // Get student details from database
        const student = await Student.findOne({ walletAddress: studentWalletAddress });
        if (!student) {
          res.status(404);
          throw new Error("Student not found in database");
        }
        
        const registerTx = await student_registry.methods
          .registerStudent(
            `${student.firstName} ${student.lastName}`,
            student.Username || "N/A",
            "N/A", // course - not available in current schema
            student.email
          )
          .send({ from: instituteAccount.address, gas: 500000 });
        
        console.log("[issueCredential] ✅ Student registered. Tx:", registerTx.transactionHash);
        isStudentRegistered = true;
      } catch (registerErr) {
        console.error("[issueCredential] ❌ Failed to register student:", registerErr.message);
        res.status(403);
        throw new Error("Student is not registered in the student registry and could not be registered");
      }
    }
    
    // Send only credentialHash as the on-chain identifier (no ipfsHash)
    const tx = certificates.methods.issueCertificate(studentWalletAddress, credentialHash);
    const [chainId, balanceWei, gasPrice] = await Promise.all([
      web3.eth.getChainId(),
      web3.eth.getBalance(instituteAccount.address),
      web3.eth.getGasPrice()
    ]);
    const gas = await tx.estimateGas({ from: instituteAccount.address });
    console.log("[issueCredential] Network chainId:", chainId, "balanceWei:", balanceWei, "gasPrice:", gasPrice, "estimatedGas:", gas);

    // Preflight: ensure balance covers gas * gasPrice
    try {
      const balance = BigInt(balanceWei);
      const required = BigInt(gas) * BigInt(gasPrice);
      if (balance < required) {
        console.error("[issueCredential] ❌ Insufficient funds for gas. balance:", balance.toString(), "required:", required.toString());
        return res.status(502).json({
          message: "Insufficient funds for gas",
          details: { balanceWei: balance.toString(), requiredWei: required.toString(), chainId }
        });
      }
    } catch (_) {}
    const receipt = await tx.send({ from: instituteAccount.address, gas, gasPrice });
    console.log("[issueCredential] Tx mined. hash:", receipt && receipt.transactionHash);
    if (receipt && receipt.status) {
      console.log("[issueCredential] ✅ Certificate registered on-chain for student:", studentWalletAddress);
    } else {
      console.warn("[issueCredential] ⚠️ Transaction receipt indicates failure");
    }
  } catch (err) {
    console.error("[issueCredential] ❌ On-chain issueCertificate failed:", err && err.message ? err.message : err);
    console.error("[issueCredential] Error stack:", err.stack);
    
    // Return a proper JSON error response instead of throwing
    return res.status(500).json({
      success: false,
      message: "Blockchain operation failed",
      error: err.message || "Unknown blockchain error"
    });
  }

  const credential = new Credential({
    _id: credentialHash,
    credentialName,
    isssuerWalletAddress,
    studentWalletAddress,
    contentHash: req.body.contentHash,
    credentialHash,
    credentialType,
    issueDate,
    expiryDate,
    issuerSignature,
    cloudinaryUrl: req.body.cloudinaryUrl,
    status: "issued",
    credentialScore: credentialScore ?? 0
  });

  try {
    await credential.save();
    console.log(`[issueCredential] ✅ Credential saved to database:`, credential._id);
  } catch (dbError) {
    console.error("[issueCredential] ❌ Database save failed:", dbError.message);
    return res.status(500).json({
      success: false,
      message: "Failed to save credential to database",
      error: dbError.message
    });
  }

  return res.status(201).json({
    success: true,
    message: "Credential issued successfully",
    data: {
      credentialId: credential._id,
      credentialName: credential.credentialName,
      credentialType: credential.credentialType,
      studentWalletAddress: credential.studentWalletAddress,
      issueDate: credential.issueDate,
      status: credential.status
    }
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

  // Log blockchain connection details
  console.log("[revokeCredential] Using blockchain account:", account && account.address);
  console.log("[revokeCredential] Certificate contract:", certificates && certificates.options && certificates.options.address);

  // Revoke on-chain first
  try {
    // Send only credentialHash as the on-chain identifier
    const tx = certificates.methods.revokeCertificate(credential.studentWalletAddress, credential.credentialHash);
    const [chainId, balanceWei, gasPrice] = await Promise.all([
      web3.eth.getChainId(),
      web3.eth.getBalance(account.address),
      web3.eth.getGasPrice()
    ]);
    const gas = await tx.estimateGas({ from: account.address });
    console.log("[revokeCredential] Network chainId:", chainId, "balanceWei:", balanceWei, "gasPrice:", gasPrice, "estimatedGas:", gas);

    // Preflight: ensure balance covers gas * gasPrice
    try {
      const balance = BigInt(balanceWei);
      const required = BigInt(gas) * BigInt(gasPrice);
      if (balance < required) {
        console.error("[revokeCredential] ❌ Insufficient funds for gas. balance:", balance.toString(), "required:", required.toString());
        return res.status(502).json({
          message: "Insufficient funds for gas",
          details: { balanceWei: balance.toString(), requiredWei: required.toString(), chainId }
        });
      }
    } catch (_) {}
    const receipt = await tx.send({ from: account.address, gas, gasPrice });
    console.log("[revokeCredential] Tx mined. hash:", receipt && receipt.transactionHash);
    if (receipt && receipt.status) {
      console.log("[revokeCredential] ✅ Certificate revoked on-chain for student:", credential.studentWalletAddress);
    } else {
      console.warn("[revokeCredential] ⚠️ Transaction receipt indicates failure");
    }
  } catch (err) {
    console.error("[revokeCredential] ❌ On-chain revokeCertificate failed:", err && err.message ? err.message : err);
    throw err;
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
  
  const { studentWalletAddress, issuerWalletAddress } = req.body;
  
  try {
    // Generate both content hash (for matching) and credential hash (for blockchain)
    const contentHash = generateContentHash(req.file.path);
    const credentialHash = generateCredentialHash(req.file.path, studentWalletAddress, issuerWalletAddress);
    
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
      created_at: uploadResult.created_at,
      contentHash: contentHash,
      credentialHash: credentialHash
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