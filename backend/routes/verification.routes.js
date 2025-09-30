import express from "express";
import { verifyCredential, getVerificationHistory } from "../controllers/verification.controller.js";

const router = express.Router();

// Test endpoint to check if API is working
router.get("/test", (req, res) => {
  res.json({ 
    success: true, 
    message: "Verification API is working",
    timestamp: new Date().toISOString()
  });
});

// POST /api/verification/verify
// Body: { credentialId, studentWalletAddress, credentialHash }
router.post("/verify", verifyCredential);

// GET /api/verification/history/:verifierWalletAddress
// Get verification history for a verifier
router.get("/history/:verifierWalletAddress", getVerificationHistory);

export default router;
