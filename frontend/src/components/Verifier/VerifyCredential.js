import React, { useState, useEffect } from "react";
import "./VerifyCredential.css";

const VerifierDashboard = () => {
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [verificationResults, setVerificationResults] = useState({});
  const [reportResults, setReportResults] = useState({});

  useEffect(() => {
    fetchCredentials();
  }, []);

  const fetchCredentials = async () => {
    try {
      const verifierData = JSON.parse(localStorage.getItem('verifier'));
      if (!verifierData || !verifierData.walletAddress) {
        setError('Verifier not logged in');
        setLoading(false);
        return;
      }

      const response = await fetch(`http://localhost:8000/api/submitted-credentials/verifier/${verifierData.walletAddress}`);
      const result = await response.json();

      if (response.ok && result.success) {
        setCredentials(result.data.credentials);
      } else {
        setError(result.message || 'Failed to fetch credentials');
      }
    } catch (err) {
      console.error('Error fetching credentials:', err);
      setError('Error fetching credentials');
    } finally {
      setLoading(false);
    }
  };

  const verifyDocument = async (credentialId, credentialHash) => {
    try {
      // Dummy verification logic - in real implementation, this would call blockchain
      const isValid = credentialHash.endsWith("5") || Math.random() > 0.3;

      setVerificationResults(prev => ({
        ...prev,
        [credentialId]: {
          status: isValid ? "✅ Verified" : "❌ Verification Failed",
          verifiedOn: new Date().toLocaleString(),
          verified: isValid
        }
      }));

      // Here you would typically call a blockchain verification API
      console.log(`Verifying credential ${credentialId} with hash ${credentialHash}`);
    } catch (error) {
      console.error('Verification error:', error);
      setVerificationResults(prev => ({
        ...prev,
        [credentialId]: {
          status: "❌ Verification Failed",
          verifiedOn: new Date().toLocaleString(),
          verified: false
        }
      }));
    }
  };

  const reportDocument = async (credentialId, credentialHash) => {
    try {
      // Dummy reporting logic - in real implementation, this would call an API
      const isReported = Math.random() > 0.2; // 80% success rate

      setReportResults(prev => ({
        ...prev,
        [credentialId]: {
          status: isReported ? "🚨 Reported" : "❌ Report Failed",
          reportedOn: new Date().toLocaleString(),
          reported: isReported
        }
      }));

      console.log(`Reporting credential ${credentialId} with hash ${credentialHash}`);
    } catch (error) {
      console.error('Reporting error:', error);
      setReportResults(prev => ({
        ...prev,
        [credentialId]: {
          status: "❌ Report Failed",
          reportedOn: new Date().toLocaleString(),
          reported: false
        }
      }));
    }
  };

  const downloadDocument = (url) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="verifier-dashboard">
        <h2>Verifier Dashboard</h2>
        <p>Loading submitted credentials...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="verifier-dashboard">
        <h2>Verifier Dashboard</h2>
        <p className="error-message">Error: {error}</p>
        <button onClick={fetchCredentials} className="retry-button">Retry</button>
      </div>
    );
  }

  return (
    <div className="verifier-dashboard">
      <h2>Verifier Dashboard</h2>
      <p>Review and verify submitted credentials from students.</p>

      {credentials.length === 0 ? (
        <div className="no-credentials">
          <p>No credentials submitted for verification yet.</p>
        </div>
      ) : (
        <div className="credentials-list">
          <h3>Submitted Credentials ({credentials.length})</h3>
          <div className="credentials-table">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Student Wallet</th>
                  <th>Credential Hash</th>
                  <th>Submission Date</th>
                  <th>Document</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {credentials.map((cred) => (
                  <tr key={cred.credentialId}>
                    <td>
                      <div className="student-info">
                        <strong>{cred.studentName}</strong>
                        <br />
                        <small>@{cred.studentUsername}</small>
                        <br />
                        <small>{cred.studentEmail}</small>
                      </div>
                    </td>
                    <td>
                      <code className="wallet-address">
                        {cred.studentWalletAddress.slice(0, 10)}...{cred.studentWalletAddress.slice(-8)}
                      </code>
                    </td>
                    <td>
                      <code className="hash-code">
                        {cred.credentialHash.slice(0, 20)}...
                      </code>
                    </td>
                    <td>
                      {new Date(cred.submissionDate).toLocaleDateString()}
                    </td>
                    <td>
                      <button 
                        className="download-btn"
                        onClick={() => downloadDocument(cred.cloudinaryUrl)}
                      >
                        📄 Download
                      </button>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="verify-btn"
                          onClick={() => verifyDocument(cred.credentialId, cred.credentialHash)}
                        >
                          ✅ Verify
                        </button>
                        <button 
                          className="report-btn"
                          onClick={() => reportDocument(cred.credentialId, cred.credentialHash)}
                        >
                          🚨 Report
                        </button>
                        {verificationResults[cred.credentialId] && (
                          <div className="verification-result">
                            <p className={verificationResults[cred.credentialId].verified ? 'verified' : 'failed'}>
                              {verificationResults[cred.credentialId].status}
                            </p>
                            <small>{verificationResults[cred.credentialId].verifiedOn}</small>
                          </div>
                        )}
                        {reportResults[cred.credentialId] && (
                          <div className="report-result">
                            <p className={reportResults[cred.credentialId].reported ? 'reported' : 'failed'}>
                              {reportResults[cred.credentialId].status}
                            </p>
                            <small>{reportResults[cred.credentialId].reportedOn}</small>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifierDashboard;
