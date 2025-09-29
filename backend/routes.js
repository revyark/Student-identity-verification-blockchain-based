import express from "express";
import { verified_contract, student_registry, certificates, account } from "./config/web3config.js";

const router = express.Router();

/**
 * Register / Verify Institution
 * Body: { wallet: "0x..." }
 */
router.post("/registerInstitution", async (req, res) => {
  try {
    const { wallet } = req.body;

    const tx = await verified_contract.methods
      .setVerificationStatus(wallet, true)
      .send({ from: account.address, gas: 500000 });

    res.json({ success: true, txHash: tx.transactionHash });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Register Student
 * Body: { name, rollNumber, course, email }
 * Note: msg.sender is used as student's address
 */
router.post("/registerStudent", async (req, res) => {
    try {
      const { name, rollNumber, course, email } = req.body;
  
      // Check if the server wallet is already registered
      const alreadyRegistered = await student_registry.methods
        .isRegistered(account.address) // msg.sender will be this account
        .call();
  
      if (alreadyRegistered) {
        return res.status(400).json({ success: false, error: "Student already registered" });
      }
  
      // Register student
      const tx = await student_registry.methods
        .registerStudent(name, rollNumber, course, email)
        .send({ from: account.address, gas: 500000 });
  
      res.json({ success: true, txHash: tx.transactionHash });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
});
  

/**
 * Update Student
 * Body: { name, rollNumber, course, email }
 */
router.post("/updateStudent", async (req, res) => {
  try {
    const { name, rollNumber, course, email } = req.body;

    const tx = await student_registry.methods
      .updateStudent(name, rollNumber, course, email)
      .send({ from: account.address, gas: 500000 });

    res.json({ success: true, txHash: tx.transactionHash });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Get Student Details
 * Query: ?wallet=0x...
 */
router.get("/getStudent", async (req, res) => {
  try {
    const { wallet } = req.query;

    const student = await student_registry.methods.getStudent(wallet).call();

    const [name, rollNumber, course, email, registered] = student;

    res.json({ name, rollNumber, course, email, registered });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Issue Certificate
 * Body: { studentWallet: "0x...", ipfsHash: "Qm..." }
 */
router.post("/issueCertificate", async (req, res) => {
  try {
    const { studentWallet, ipfsHash } = req.body;

    const tx = await certificates.methods
      .issueCertificate(studentWallet, ipfsHash)
      .send({ from: account.address, gas: 500000 });

    res.json({ success: true, txHash: tx.transactionHash });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
