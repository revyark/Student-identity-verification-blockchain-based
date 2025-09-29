// src/components/Institution/IssueCredentialForm.js
import React, { useState } from 'react';
import './IssueCredentialForm.css'; // Import the new CSS file

const RevokeCredentialForm = () => {
    const [studentAddress, setStudentAddress] = useState('');
    const [credentials, setCredentials] = useState([]);
    const [selectedHash, setSelectedHash] = useState('');
    const [status, setStatus] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const fetchStudentCredentials = async () => {
        try {
            setStatus('Fetching credentials...');
            const institute = JSON.parse(localStorage.getItem('institute') || '{}');
            const instituteId = institute?._id || 'institute';
            const resp = await fetch(`http://localhost:8000/api/institute/${encodeURIComponent(instituteId)}/credentials/student/${encodeURIComponent(studentAddress)}?status=issued`);
            const json = await resp.json();
            if (!resp.ok) {
                setStatus(json.message || 'Failed to fetch credentials');
                return;
            }
            setCredentials(json.credentials || []);
            setStatus('');
        } catch (err) {
            console.error(err);
            setStatus('Error: Failed to fetch credentials');
        }
    }

    const handleRevoke = async (e) => {
        e.preventDefault();
        setStatus('Processing...');
        setIsProcessing(true);

        if (!selectedHash.trim()) {
            setStatus('Error: Please select a credential.');
            setIsProcessing(false);
            return;
        }

        try {
            const institute = JSON.parse(localStorage.getItem('institute') || '{}');
            const instituteId = institute?._id || 'institute';
            const resp = await fetch(`http://localhost:8000/api/institute/${encodeURIComponent(instituteId)}/credentials/${encodeURIComponent(selectedHash)}/revoke`, {
                method: 'PATCH'
            });
            const json = await resp.json();
            if (!resp.ok) {
                setStatus(json.message || 'Revoke failed');
                setIsProcessing(false);
                return;
            }
            setStatus('Credential revoked successfully');
            setSelectedHash('');
            // Refresh list after revoke
            fetchStudentCredentials();
        } catch (err) {
            console.error(err);
            setStatus('Error: Something went wrong');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="credential-form-container">
            <h2>Revoke Credential</h2>
            <div className="form-group">
                <label>Student Wallet Address:</label>
                <input
                    type="text"
                    value={studentAddress}
                    onChange={(e) => setStudentAddress(e.target.value)}
                    placeholder="0x..."
                />
                <button className="submit-button" onClick={fetchStudentCredentials} disabled={!studentAddress}>
                    Fetch Issued Credentials
                </button>
            </div>

            {credentials.length > 0 && (
                <form onSubmit={handleRevoke}>
                    <div className="form-group">
                        <label>Select Credential to Revoke:</label>
                        <select value={selectedHash} onChange={(e) => setSelectedHash(e.target.value)} required>
                            <option value="">-- Select --</option>
                            {credentials.map((c) => (
                                <option key={c.credentialHash} value={c.credentialHash}>
                                    {c.credentialName} ({new Date(c.issueDate).toISOString().slice(0,10)}) - {c.credentialHash}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button
                        type="submit"
                        disabled={isProcessing}
                        className="submit-button"
                    >
                        {isProcessing ? 'Processing...' : 'Revoke Credential'}
                    </button>
                </form>
            )}

            {status && <p className={`status-message ${status.startsWith('Error') ? 'error' : (status.includes('successfully') ? 'success' : 'info')}`}>{status}</p>}
        </div>
    );
};

export default RevokeCredentialForm;