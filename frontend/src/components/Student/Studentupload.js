import React, { useState } from 'react';
import './StudentUpload.css';
import { useNavigate } from 'react-router-dom';

const StudentUpload = () => {
    const [companyName, setCompanyName] = useState('');
    const [documentName, setDocumentName] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [status, setStatus] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        setStatus('Uploading document...');
        setIsUploading(true);

        if (!companyName.trim() || !documentName.trim() || !selectedFile) {
            setStatus('Error: Please fill in all fields and select a file.');
            setIsUploading(false);
            return;
        }

        try {
            const studentData = JSON.parse(localStorage.getItem('student'));
            if (!studentData || !studentData.walletAddress) {
                setStatus('Error: Student not logged in.');
                setIsUploading(false);
                return;
            }

            const formData = new FormData();
            formData.append('document', selectedFile);
            formData.append('studentWalletAddress', studentData.walletAddress);
            formData.append('companyName', companyName);
            formData.append('documentName', documentName);

            const response = await fetch('http://localhost:8000/api/submitted-credentials/upload', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (response.ok && result.success) {
                setStatus(`Document uploaded successfully! Credential ID: ${result.data.credentialId}`);
                
                // Clear form
                setCompanyName('');
                setDocumentName('');
                setSelectedFile(null);
                e.target.reset();
                
                // Navigate back to dashboard after successful upload
                setTimeout(() => {
                    navigate('/student-dashboard');
                }, 2000);
            } else {
                setStatus(`Error: ${result.message || 'Upload failed'}`);
            }
        } catch (error) {
            console.error('Upload error:', error);
            setStatus(`Error: ${error.message}`);
        }

        setIsUploading(false);
    };

    return (
        <div className="student-form-container">
            <h2>Upload Document for Verification</h2>
            <form onSubmit={handleUpload}>
                <div className="form-group">
                    <label>Company/Verifier Name:</label>
                    <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        required
                        placeholder="e.g., ABC Verification Corp"
                    />
                </div>
                <div className="form-group">
                    <label>Document Name:</label>
                    <input
                        type="text"
                        value={documentName}
                        onChange={(e) => setDocumentName(e.target.value)}
                        required
                        placeholder="e.g., Degree Certificate, Transcript"
                    />
                </div>
                <div className="form-group">
                    <label>Select Document to Upload:</label>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        required
                        accept=".pdf,.doc,.docx,.jpg,.png,.jpeg,.gif,.txt"
                    />
                    {selectedFile && <p className="file-info">Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</p>}
                </div>
                <button
                    type="submit"
                    disabled={isUploading}
                    className="upload-button"
                >
                    {isUploading ? 'Uploading...' : 'Upload Document'}
                </button>
            </form>

            {status && <p className={`status-message ${status.startsWith('Error') ? 'error' : 'success'}`}>{status}</p>}

            <div className="note">
                <p><strong>Note:</strong> Your document will be uploaded to Cloudinary and a credential hash will be generated for verification purposes.</p>
                <p>Supported formats: PDF, DOC, DOCX, JPG, PNG, JPEG, GIF, TXT (Max size: 10MB)</p>
            </div>
        </div>
    );
};

export default StudentUpload;