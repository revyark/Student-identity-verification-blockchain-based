// src/components/Institution/IssueCredentialForm.js (DUMMY VERSION)
import React, { useState } from 'react';
// No Web3.js imports needed for dummy version

const IssueCredentialForm = () => {
    const [studentAddress, setStudentAddress] = useState('');
    const [credentialType, setCredentialType] = useState('');
    const [selectedFile, setSelectedFile] = useState(null); // State for file input
    const [mockIpfsHash, setMockIpfsHash] = useState(''); // Mock IPFS hash
    const [status, setStatus] = useState('');
    const [mockTxHash, setMockTxHash] = useState(''); // Use a mock transaction hash
    const [isProcessing, setIsProcessing] = useState(false);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
        setMockIpfsHash(''); // Clear previous hash if a new file is selected
    };

    const handleIssueCredential = async (e) => {
        e.preventDefault();
        setStatus('Simulating credential issuance...');
        setMockTxHash('');
        setIsProcessing(true);

        // --- DUMMY LOGIC START ---
        if (!studentAddress.trim() || !credentialType.trim() || !selectedFile) {
            setStatus('Error: Please fill all fields and select a file.');
            setIsProcessing(false);
            return;
        }
        if (!studentAddress.startsWith('0x') || studentAddress.length !== 42) { // Basic mock address validation
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

        // Simulate IPFS upload delay
        setStatus("Simulating file upload to IPFS...");
        await new Promise(resolve => setTimeout(resolve, 1500));
        const generatedMockIpfsHash = `QmV${Math.random().toString(36).substring(2, 15)}`; // Dummy CID
        setMockIpfsHash(generatedMockIpfsHash);
        setStatus(`Dummy IPFS upload complete: ${generatedMockIpfsHash}`);

        // Simulate transaction delay
        setStatus('Simulating blockchain transaction...');
        await new Promise(resolve => setTimeout(resolve, 2500));

        const generatedMockHash = '0x' + Math.random().toString(16).substr(2, 64); // Generate a random mock hash
        setMockTxHash(generatedMockHash);
        setStatus('Dummy credential issued successfully! (Check console for mock data)');

        // Clear form
        setStudentAddress('');
        setCredentialType('');
        setSelectedFile(null);
        setMockIpfsHash('');
        e.target.reset(); // Reset the file input and other form fields

        // --- DUMMY LOGIC END ---
        setIsProcessing(false);
    };

    return (
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', maxWidth: '600px', margin: '20px auto' }}>
            <h2>Issue New Credential (DUMMY)</h2>
            <form onSubmit={handleIssueCredential}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Student Wallet Address:</label>
                    <input
                        type="text"
                        value={studentAddress}
                        onChange={(e) => setStudentAddress(e.target.value)}
                        required
                        style={{ width: 'calc(100% - 10px)', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                        placeholder="e.g., 0xabcdef123..."
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Credential Type (e.g., "B.Tech Degree", "Certificate"):</label>
                    <input
                        type="text"
                        value={credentialType}
                        onChange={(e) => setCredentialType(e.target.value)}
                        required
                        style={{ width: 'calc(100% - 10px)', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                        placeholder="e.g., Bachelor of Technology"
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Upload Credential Document (e.g., PDF):</label>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        required
                        style={{ width: '100%' }}
                        accept=".pdf,.doc,.docx" // Accept common document types
                    />
                    {selectedFile && <p style={{ fontSize: '0.9em', color: '#555' }}>Selected: {selectedFile.name}</p>}
                    {mockIpfsHash && <p style={{ fontSize: '0.9em', color: '#007bff' }}>Mock IPFS Hash: {mockIpfsHash}</p>}
                </div>

                <button
                    type="submit"
                    disabled={isProcessing}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: isProcessing ? '#cccccc' : '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: isProcessing ? 'not-allowed' : 'pointer'
                    }}
                >
                    {isProcessing ? 'Processing...' : 'Issue Dummy Credential'}
                </button>
            </form>

            {status && <p style={{ marginTop: '20px', fontWeight: 'bold', color: status.startsWith('Error') ? 'red' : (status.includes('successfully') ? 'green' : 'black') }}>Status: {status}</p>}
            {mockTxHash && (
                <p style={{ marginTop: '10px' }}>
                    Mock Transaction Hash: <code>{mockTxHash}</code>
                    <br/>
                    (This is a dummy hash, no real transaction occurred.)
                </p>
            )}
            <p style={{ marginTop: '20px', fontStyle: 'italic', color: '#888' }}>
                Note: This is a dummy form. It does not interact with a blockchain or actual IPFS.
            </p>
        </div>
    );
};

export default IssueCredentialForm;