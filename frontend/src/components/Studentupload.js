// src/components/Student/StudentUploadForm.js (DUMMY VERSION)
import React, { useState } from 'react';
import './StudentUpload.css';

const StudentUpload = () => {
    const [studentName, setStudentName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [companyCode, setCompanyCode] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [status, setStatus] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        setStatus('Simulating document upload...');
        setIsUploading(true);

        // --- DUMMY LOGIC START ---
        if (!studentName.trim() || !companyName.trim() || !companyCode.trim() || !selectedFile) {
            setStatus('Error: Please fill in all fields and select a file.');
            setIsUploading(false);
            return;
        }

        console.log("Dummy uploading document for:", {
            studentName,
            companyName,
            companyCode,
            fileName: selectedFile.name,
            fileSize: selectedFile.size,
            uploadTimestamp: new Date().toISOString()
        });

        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        const mockCid = `QmV${Math.random().toString(36).substring(2, 15)}`;
        setStatus(`Document uploaded successfully! Mock CID: ${mockCid}`);

        // Clear form
        setStudentName('');
        setCompanyName('');
        setCompanyCode('');
        setSelectedFile(null);
        e.target.reset();

        // --- DUMMY LOGIC END ---
        setIsUploading(false);
    };

    return (
        <div className="student-form-container">
            <h2>Student Document Upload (DUMMY)</h2>
            <form onSubmit={handleUpload}>
                <div className="form-group">
                    <label>Student Name:</label>
                    <input
                        type="text"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        required
                        placeholder="e.g., John Doe"
                    />
                </div>
                <div className="form-group">
                    <label>Company Name:</label>
                    <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        required
                        placeholder="e.g., ABC Corp"
                    />
                </div>
                <div className="form-group">
                    <label>Company Code:</label>
                    <input
                        type="text"
                        value={companyCode}
                        onChange={(e) => setCompanyCode(e.target.value)}
                        required
                        placeholder="e.g., ABC123"
                    />
                </div>
                <div className="form-group">
                    <label>Select Document to Upload:</label>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        required
                        accept=".pdf,.doc,.docx,.jpg,.png"
                    />
                    {selectedFile && <p className="file-info">Selected: {selectedFile.name}</p>}
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

            <p className="note">
                Note: This form does not perform a real upload. It uses mock data for demonstration.
            </p>
        </div>
    );
};

export default StudentUpload;