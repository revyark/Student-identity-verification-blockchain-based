import { asyncHandler } from "../utils/asyncHandler.js";
import { Credential } from "../models/credential.models.js";
import { Student } from "../models/user.models.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";
import { certificates, web3, account } from "../config/web3config.js";

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

  // Log blockchain connection details
  console.log("[issueCredential] Using blockchain account:", account && account.address);
  console.log("[issueCredential] Certificate contract:", certificates && certificates.options && certificates.options.address);
  const address="1234"
  // First, write to blockchain
  try {
    // Send only credentialHash as the on-chain identifier (no ipfsHash)
    const tx = certificates.methods.issueCertificate(studentWalletAddress, credentialHash);
    const [chainId, balanceWei, gasPrice] = await Promise.all([
      web3.eth.getChainId(),
      web3.eth.getBalance(account.address),
      web3.eth.getGasPrice()
    ]);
    const gas = await tx.estimateGas({ from: address });
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
    const receipt = await tx.send({ from: address, gas, gasPrice });
    console.log("[issueCredential] Tx mined. hash:", receipt && receipt.transactionHash);
    if (receipt && receipt.status) {
      console.log("[issueCredential] ✅ Certificate registered on-chain for student:", studentWalletAddress);
    } else {
      console.warn("[issueCredential] ⚠️ Transaction receipt indicates failure");
    }
  } catch (err) {
    console.error("[issueCredential] ❌ On-chain issueCertificate failed:", err && err.message ? err.message : err);
    throw err;
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