// src/components/Institution/IssueCredentialForm.js
import React, { useState } from 'react';
import './IssueCredentialForm.css'; // Import the new CSS file

const IssueCredentialForm = () => {
    const [studentAddress, setStudentAddress] = useState('');
    const [credentialType, setCredentialType] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [mockIpfsHash, setMockIpfsHash] = useState('');
    const [status, setStatus] = useState('');
    const [mockTxHash, setMockTxHash] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
        setMockIpfsHash('');
    };

    const handleIssueCredential = async (e) => {
        e.preventDefault();
        setStatus('Simulating credential issuance...');
        setMockTxHash('');
        setIsProcessing(true);

        if (!studentAddress.trim() || !credentialType.trim() || !selectedFile) {
            setStatus('Error: Please fill all fields and select a file.');
            setIsProcessing(false);
            return;
        }
        if (!studentAddress.startsWith('0x') || studentAddress.length !== 42) {
            setStatus('Error: Invalid student address format (must start with 0x and be 42 chars).');
            setIsProcessing(false);
            return;
        }

        console.log("Dummy issuing credential with data:", {
            studentAddress,
            credentialType,
            fileName: selectedFile.name,
            fileSize: selectedFile.size,
            issuanceTimestamp: new Date().toISOString()
        });

        setStatus("Simulating file upload to IPFS...");
        await new Promise(resolve => setTimeout(resolve, 1500));
        const generatedMockIpfsHash = `QmV${Math.random().toString(36).substring(2, 15)}`;
        setMockIpfsHash(generatedMockIpfsHash);
        setStatus(`Dummy IPFS upload complete: ${generatedMockIpfsHash}`);

        setStatus('Simulating blockchain transaction...');
        await new Promise(resolve => setTimeout(resolve, 2500));

        const generatedMockHash = '0x' + Math.random().toString(16).substr(2, 64);
        setMockTxHash(generatedMockHash);
        setStatus('Dummy credential issued successfully! (Check console for mock data)');

        setStudentAddress('');
        setCredentialType('');
        setSelectedFile(null);
        setMockIpfsHash('');
        e.target.reset();

        setIsProcessing(false);
    };

    return (
        <div className="credential-form-container">
            <h2>Issue New Credential (DUMMY)</h2>
            <form onSubmit={handleIssueCredential}>
                <div className="form-group">
                    <label>Student Wallet Address:</label>
                    <input
                        type="text"
                        value={studentAddress}
                        onChange={(e) => setStudentAddress(e.target.value)}
                        required
                        placeholder="e.g., 0xabcdef123..."
                    />
                </div>
                <div className="form-group">
                    <label>Credential Type (e.g., "B.Tech Degree", "Certificate"):</label>
                    <input
                        type="text"
                        value={credentialType}
                        onChange={(e) => setCredentialType(e.target.value)}
                        required
                        placeholder="e.g., Bachelor of Technology"
                    />
                </div>
                <div className="form-group">
                    <label>Upload Credential Document (e.g., PDF):</label>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        required
                        accept=".pdf,.doc,.docx"
                    />
                    {selectedFile && <p className="file-info">Selected: {selectedFile.name}</p>}
                    {mockIpfsHash && <p className="ipfs-info">Mock IPFS Hash: {mockIpfsHash}</p>}
                </div>

                <button
                    type="submit"
                    disabled={isProcessing}
                    className="submit-button"
                >
                    {isProcessing ? 'Processing...' : 'Issue Dummy Credential'}
                </button>
            </form>

            {status && <p className={`status-message ${status.startsWith('Error') ? 'error' : (status.includes('successfully') ? 'success' : 'info')}`}>{status}</p>}
            {mockTxHash && (
                <p className="tx-hash-info">
                    Mock Transaction Hash: <code>{mockTxHash}</code>
                    <br/>
                    (This is a dummy hash, no real transaction occurred.)
                </p>
            )}
            <p className="note">
                Note: This is a dummy form. It does not interact with a blockchain or actual IPFS.
            </p>
        </div>
    );
};

export default IssueCredentialForm;