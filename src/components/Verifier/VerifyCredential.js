// src/components/Verifier/VerifyCredential.js (DUMMY VERSION)
import React, { useState } from 'react';
// No Web3.js imports needed for dummy version

// Mock data for verification
const mockCredentials = {
    "0xhash123abcdefghijklmnopqrstuvwxyz0123456789": {
        status: "Valid",
        owner: "0x1A2B3C4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9A0B",
        issuer: "University of Excellence",
        ipfsHash: "QmVdummyIpfsHash123abcXYZ",
        type: "Bachelor of Technology",
        issueDate: "2023-05-15"
    },
    "0xhash456abcdefghijklmnopqrstuvwxyz0123456789": {
        status: "Revoked",
        owner: "0xABCDEF1234567890ABCDEF1234567890ABCDEF1",
        issuer: "Global Certifications Inc.",
        ipfsHash: "QmVdummyIpfsHash456defUVW",
        type: "Data Science Certificate",
        issueDate: "2022-11-01"
    },
    "0xhash789abcdefghijklmnopqrstuvwxyz0123456789": {
        status: "Valid",
        owner: "0x112233445566778899AABBCCDDEEFF0011223344",
        issuer: "Online Learning Hub",
        ipfsHash: "QmVdummyIpfsHash789ghiJKL",
        type: "Web Development Diploma",
        issueDate: "2024-01-20"
    }
};

const VerifyCredential = () => {
    const [credentialIdentifier, setCredentialIdentifier] = useState('');
    const [studentAddress, setStudentAddress] = useState('');
    const [verificationResult, setVerificationResult] = useState(null);
    const [status, setStatus] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);

    const handleVerifyCredential = async (e) => {
        e.preventDefault();
        setStatus('Simulating verification...');
        setVerificationResult(null);
        setIsVerifying(true);

        // --- DUMMY LOGIC START ---
        if (!credentialIdentifier.trim() || !studentAddress.trim()) {
            setStatus('Error: Please enter both credential identifier and student address.');
            setIsVerifying(false);
            return;
        }

        console.log("Dummy verifying with:", { credentialIdentifier, studentAddress });
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay

        const result = mockCredentials[credentialIdentifier.toLowerCase()]; // Case-insensitive lookup

        if (result) {
            const ownerMatches = result.owner.toLowerCase() === studentAddress.toLowerCase();
            setVerificationResult({
                status: result.status,
                ownerMatches: ownerMatches,
                issuer: result.issuer,
                type: result.type,
                issueDate: result.issueDate,
                ipfsLink: `https://dummy-ipfs-gateway.com/ipfs/${result.ipfsHash}` // Dummy IPFS link
            });
            setStatus(`Dummy verification complete: Credential found. Owner match: ${ownerMatches ? 'Yes' : 'No'}.`);
        } else {
            setStatus('Dummy verification complete: Credential not found in mock data.');
            setVerificationResult({ status: "Not Found" });
        }
        // --- DUMMY LOGIC END ---
        setIsVerifying(false);
    };

    return (
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', maxWidth: '600px', margin: '20px auto' }}>
            <h2>Verify Credential (DUMMY)</h2>
            <form onSubmit={handleVerifyCredential}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Credential Identifier (e.g., a mock hash like `0xhash123...`):</label>
                    <input
                        type="text"
                        value={credentialIdentifier}
                        onChange={(e) => setCredentialIdentifier(e.target.value)}
                        required
                        style={{ width: 'calc(100% - 10px)', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                        placeholder="e.g., 0xhash123abcdefghijklmnopqrstuvwxyz0123456789"
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Student Wallet Address (e.g., 0x1A2B3C...):</label>
                    <input
                        type="text"
                        value={studentAddress}
                        onChange={(e) => setStudentAddress(e.target.value)}
                        required
                        style={{ width: 'calc(100% - 10px)', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                        placeholder="e.g., 0x1A2B3C4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9A0B"
                    />
                </div>
                <button
                    type="submit"
                    disabled={isVerifying}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: isVerifying ? '#cccccc' : '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: isVerifying ? 'not-allowed' : 'pointer'
                    }}
                >
                    {isVerifying ? 'Verifying...' : 'Verify Dummy Credential'}
                </button>
            </form>

            {status && <p style={{ marginTop: '20px', fontWeight: 'bold', color: status.startsWith('Error') ? 'red' : (status.includes('complete') ? 'green' : 'black') }}>Status: {status}</p>}
            {verificationResult && (
                <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e9e9e9', borderRadius: '5px' }}>
                    <h3>Dummy Verification Result:</h3>
                    <p>Credential Status: <strong>{verificationResult.status}</strong></p>
                    {verificationResult.ownerMatches !== undefined && (
                        <p>Student Address Matches: <strong>{verificationResult.ownerMatches ? 'Yes' : 'No'}</strong></p>
                    )}
                    {verificationResult.status !== "Not Found" && (
                        <>
                            <p>Issued By: <strong>{verificationResult.issuer}</strong></p>
                            <p>Credential Type: <strong>{verificationResult.type}</strong></p>
                            <p>Issue Date: <strong>{verificationResult.issueDate}</strong></p>
                            <p>Original Document: <a href={verificationResult.ipfsLink} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff' }}>View Mock Document</a></p>
                        </>
                    )}
                </div>
            )}
            <p style={{ marginTop: '20px', fontStyle: 'italic', color: '#888' }}>
                Note: This is a dummy verification. It uses hardcoded mock data for demonstration.
            </p>
        </div>
    );
};

export default VerifyCredential;