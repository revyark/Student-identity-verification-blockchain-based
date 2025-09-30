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

  const testVerificationAPI = async () => {
    try {
      console.log('Testing verification API...');
      const response = await fetch('http://localhost:8000/api/verification/test');
      const result = await response.json();
      console.log('API Test Result:', result);
      return result;
    } catch (error) {
      console.error('API Test Failed:', error);
      return null;
    }
  };

  const fetchCredentials = async () => {
    try {
      // Test the verification API first
      await testVerificationAPI();
      
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

  const verifyDocument = async (credentialId, credentialHash, studentWalletAddress) => {
    try {
      console.log(`Verifying credential ${credentialId} with hash ${credentialHash}`);
      
      // Call the blockchain verification API
      const response = await fetch('http://localhost:8000/api/verification/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credentialId,
          studentWalletAddress,
          credentialHash
        })
      });

      // Check if response is ok and has content
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      // Check if response has content
      const responseText = await response.text();
      console.log('Raw API Response:', responseText);
      
      if (!responseText) {
        throw new Error('Empty response from server');
      }

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        console.error('Response text:', responseText);
        throw new Error(`Invalid JSON response: ${responseText.substring(0, 100)}...`);
      }

      if (result.success) {
        const verification = result.data.verification;
        const isValid = verification.isValid;
        
        setVerificationResults(prev => ({
          ...prev,
          [credentialId]: {
            status: isValid ? "✅ Verified" : "❌ Verification Failed",
            verifiedOn: new Date().toLocaleString(),
            verified: isValid,
            details: {
              issuedBy: verification.issuedBy,
              issuedAt: verification.issuedAt,
              isRevoked: verification.isRevoked,
              student: result.data.student,
              issuer: result.data.issuer
            }
          }
        }));

        console.log(`✅ Verification completed for credential ${credentialId}:`, result.data);
      } else {
        // Handle verification failure (including "not found on blockchain")
        setVerificationResults(prev => ({
          ...prev,
          [credentialId]: {
            status: "❌ Verification Failed",
            verifiedOn: new Date().toLocaleString(),
            verified: false,
            details: {
              issuedBy: result.data?.verification?.issuedBy || null,
              issuedAt: result.data?.verification?.issuedAt || null,
              isRevoked: result.data?.verification?.isRevoked || false,
              student: result.data?.student || null,
              issuer: result.data?.issuer || null
            },
            error: result.message || 'Verification failed'
          }
        }));
        
        console.log(`❌ Verification failed for credential ${credentialId}:`, result.message);
      }
    } catch (error) {
      console.error('Verification error:', error);
      setVerificationResults(prev => ({
        ...prev,
        [credentialId]: {
          status: "❌ Verification Failed",
          verifiedOn: new Date().toLocaleString(),
          verified: false,
          error: error.message
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
                          onClick={() => verifyDocument(cred.credentialId, cred.credentialHash, cred.studentWalletAddress)}
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
                            {verificationResults[cred.credentialId].details && (
                              <div className="verification-details">
                                {verificationResults[cred.credentialId].details.issuedBy && (
                                  <small>Issued by: {verificationResults[cred.credentialId].details.issuedBy.slice(0, 10)}...</small>
                                )}
                                {verificationResults[cred.credentialId].details.issuedAt && (
                                  <small>Issued: {new Date(verificationResults[cred.credentialId].details.issuedAt).toLocaleDateString()}</small>
                                )}
                                {verificationResults[cred.credentialId].details.isRevoked && (
                                  <small className="revoked">⚠️ Revoked</small>
                                )}
                              </div>
                            )}
                            {verificationResults[cred.credentialId].error && (
                              <small className="error">Error: {verificationResults[cred.credentialId].error}</small>
                            )}
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
