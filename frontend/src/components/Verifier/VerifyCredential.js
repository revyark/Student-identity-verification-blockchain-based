import React, { useState } from "react";
import "./VerifyCredential.css";

const VerifierDashboard = () => {
  const [docHash, setDocHash] = useState("");
  const [verificationResult, setVerificationResult] = useState(null);

  // Dummy Blockchain verification (replace with real smart contract call)
  const verifyDocument = async () => {
    // Example: If hash ends with "5" => valid
    const isValid = docHash.endsWith("5");

    setVerificationResult({
      docHash,
      status: isValid ? "✅ Valid Document" : "❌ Invalid Document",
      verifiedOn: new Date().toLocaleString(),
      issuer: isValid ? "Indian Institute of Technology, Delhi" : "Unknown",
    });
  };

  return (
    <div className="verifier-dashboard">
      <h2>Verifier Dashboard</h2>
      <p>Enter the student's document hash to check its authenticity.</p>

      <div className="input-section">
        <input
          type="text"
          placeholder="Enter Document Hash"
          value={docHash}
          onChange={(e) => setDocHash(e.target.value)}
        />
        <button onClick={verifyDocument}>Verify</button>
      </div>

      {verificationResult && (
        <div className="result-card">
          <h3>Verification Result</h3>
          <p><strong>Document Hash:</strong> {verificationResult.docHash}</p>
          <p><strong>Status:</strong> {verificationResult.status}</p>
          <p><strong>Issuer:</strong> {verificationResult.issuer}</p>
          <p><strong>Verified On:</strong> {verificationResult.verifiedOn}</p>
        </div>
      )}
    </div>
  );
};

export default VerifierDashboard;
