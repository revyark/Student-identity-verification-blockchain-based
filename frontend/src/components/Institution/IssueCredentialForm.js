// src/components/Institution/IssueCredentialForm.js
import React, { useState } from 'react';
import './IssueCredentialForm.css'; // Import the new CSS file

const IssueCredentialForm = () => {
    const [studentAddress, setStudentAddress] = useState('');
    const [credentialName, setCredentialName] = useState('');
    const [credentialType, setCredentialType] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [credentialScore, setCredentialScore] = useState('');
    const [issuerSignature, setIssuerSignature] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadedFileInfo, setUploadedFileInfo] = useState(null); // cloudinary response
    const [status, setStatus] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
        setUploadedFileInfo(null);
    };

    const handleIssueCredential = async (e) => {
        e.preventDefault();
        setStatus('Processing...');
        setIsProcessing(true);

        if (!studentAddress.trim() || !credentialType.trim() || !credentialName.trim() || !issuerSignature.trim() || !selectedFile) {
            setStatus('Error: Please fill all required fields and select a file.');
            setIsProcessing(false);
            return;
        }
        if (!studentAddress.startsWith('0x') || studentAddress.length !== 42) {
            setStatus('Error: Invalid student address format (must start with 0x and be 42 chars).');
            setIsProcessing(false);
            return;
        }

        try {
            // 1) Upload file to Cloudinary via backend
            const institute = JSON.parse(localStorage.getItem('institute') || '{}');
            const instituteId = institute?._id || 'institute';
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('studentWalletAddress', studentAddress);
            formData.append('issuerWalletAddress', institute?.walletAddress || '');
            const uploadResp = await fetch(`http://localhost:8000/api/institute/${instituteId}/credentials/upload`, {
                method: 'POST',
                body: formData
            });
            const uploadJson = await uploadResp.json();
            if (!uploadResp.ok) {
                setStatus(uploadJson.message || 'Upload failed');
                setIsProcessing(false);
                return;
            }
            setUploadedFileInfo(uploadJson);

            // Use the credential hash generated from file content
            const credentialHash = uploadJson.credentialHash;
            const contentHash = uploadJson.contentHash;

            // 2) Issue credential
            const payload = {
                credentialName,
                isssuerWalletAddress: institute?.walletAddress || '',
                studentWalletAddress: studentAddress,
                contentHash,
                credentialHash,
                credentialType,
                issueDate: new Date().toISOString(),
                expiryDate: expiryDate || undefined,
                issuerSignature,
                cloudinaryUrl: uploadJson.url,
                credentialScore: credentialScore ? Number(credentialScore) : undefined
            };

            const issueResp = await fetch(`http://localhost:8000/api/institute/${instituteId}/credentials/issue`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            // Check if response is ok and has content
            if (!issueResp.ok) {
                const errorText = await issueResp.text();
                console.error('Issue API Error Response:', errorText);
                setStatus(`API Error: ${issueResp.status} - ${errorText}`);
                setIsProcessing(false);
                return;
            }

            // Check if response has content
            const responseText = await issueResp.text();
            console.log('Raw Issue API Response:', responseText);
            
            if (!responseText) {
                setStatus('Empty response from server');
                setIsProcessing(false);
                return;
            }

            let issueJson;
            try {
                issueJson = JSON.parse(responseText);
            } catch (parseError) {
                console.error('JSON Parse Error:', parseError);
                console.error('Response text:', responseText);
                setStatus(`Invalid JSON response: ${responseText.substring(0, 100)}...`);
                setIsProcessing(false);
                return;
            }

            setStatus('Credential issued successfully');

            // Reset form
            setStudentAddress('');
            setCredentialName('');
            setCredentialType('');
            setExpiryDate('');
            setCredentialScore('');
            setIssuerSignature('');
            setSelectedFile(null);
        } catch (err) {
            console.error(err);
            setStatus('Error: Something went wrong');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="credential-form-container">
            <h2>Issue New Credential</h2>
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
                    <label>Credential Name:</label>
                    <input
                        type="text"
                        value={credentialName}
                        onChange={(e) => setCredentialName(e.target.value)}
                        required
                        placeholder="e.g., Bachelor of Technology"
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
                    <label>Expiry Date (optional):</label>
                    <input
                        type="date"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Credential Score (optional):</label>
                    <input
                        type="number"
                        value={credentialScore}
                        onChange={(e) => setCredentialScore(e.target.value)}
                        placeholder="e.g., 95"
                    />
                </div>
                <div className="form-group">
                    <label>Issuer Signature:</label>
                    <input
                        type="text"
                        value={issuerSignature}
                        onChange={(e) => setIssuerSignature(e.target.value)}
                        required
                        placeholder="Provide issuer signature"
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
                    {uploadedFileInfo?.url && (
                        <p className="ipfs-info">Uploaded URL: <a href={uploadedFileInfo.url} target="_blank" rel="noreferrer">{uploadedFileInfo.url}</a></p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isProcessing}
                    className="submit-button"
                >
                    {isProcessing ? 'Processing...' : 'Issue Credential'}
                </button>
            </form>

            {status && <p className={`status-message ${status.startsWith('Error') ? 'error' : (status.includes('successfully') ? 'success' : 'info')}`}>{status}</p>}
        </div>
    );
};

export default IssueCredentialForm;