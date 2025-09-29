// src/components/Institution/IssueCredentialForm.js
import React, { useState } from 'react';
import './IssueCredentialForm.css'; // Import the new CSS file

const RevokeCredentialForm = () => {
    const [credentialHash, setCredentialHash] = useState('');
    const [status, setStatus] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleRevoke = async (e) => {
        e.preventDefault();
        setStatus('Processing...');
        setIsProcessing(true);

        if (!credentialHash.trim()) {
            setStatus('Error: Please provide credential hash.');
            setIsProcessing(false);
            return;
        }

        try {
            const institute = JSON.parse(localStorage.getItem('institute') || '{}');
            const instituteId = institute?._id || 'institute';
            const resp = await fetch(`http://localhost:8000/api/institute/${instituteId}/credentials/${encodeURIComponent(credentialHash)}/revoke`, {
                method: 'PATCH'
            });
            const json = await resp.json();
            if (!resp.ok) {
                setStatus(json.message || 'Revoke failed');
                setIsProcessing(false);
                return;
            }
            setStatus('Credential revoked successfully');
            setCredentialHash('');
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
            <form onSubmit={handleRevoke}>
                <div className="form-group">
                    <label>Credential Hash (use uploaded public_id):</label>
                    <input
                        type="text"
                        value={credentialHash}
                        onChange={(e) => setCredentialHash(e.target.value)}
                        required
                        placeholder="e.g., credentials/abc123"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isProcessing}
                    className="submit-button"
                >
                    {isProcessing ? 'Processing...' : 'Revoke Credential'}
                </button>
            </form>

            {status && <p className={`status-message ${status.startsWith('Error') ? 'error' : (status.includes('successfully') ? 'success' : 'info')}`}>{status}</p>}
        </div>
    );
};

export default RevokeCredentialForm;