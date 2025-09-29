import React, { useState, useEffect } from "react";
import "./StudentDashboard.css";
import { useNavigate } from "react-router-dom";


const StudentDashboard = () => {
  const [documents, setDocuments] = useState([]);
  const navigate=useNavigate();

  useEffect(() => {
    const fetchCredentials = async () => {
      try {
        const studentData = JSON.parse(localStorage.getItem('student'));
        if (!studentData) return;
        const wallet = studentData.walletAddress;
        // Use institute route to list credentials by student wallet; institute id is not used in lookup
        const institute = JSON.parse(localStorage.getItem('institute') || '{}');
        const instituteId = institute?._id || 'institute';
        const resp = await fetch(`http://localhost:8000/api/institute/${encodeURIComponent(instituteId)}/credentials/student/${encodeURIComponent(wallet)}`);
        const json = await resp.json();
        if (resp.ok) {
          const mapped = (json.credentials || []).map((c, idx) => ({
            id: c.credentialHash || c._id || idx + 1,
            name: c.credentialName,
            status: c.status === 'revoked' ? 'Revoked' : 'Verified',
            date: c.issueDate ? new Date(c.issueDate).toISOString().slice(0,10) : '—',
            url: c.cloudinaryUrl || ''
          }));
          setDocuments(mapped);
        } else {
          console.error('Failed to fetch student credentials:', json);
        }
      } catch (err) {
        console.error('Error fetching student credentials', err);
      }
    };
    fetchCredentials();
  }, []);

  const verifiedDocs = documents.filter((doc) => doc.status === "Verified").length;
  const handleUpload=()=>{
    navigate('/student-upload');
  }
  const handleInstituteInfo=()=>{
    navigate('/institute-info');
  }
  const handleDownload = (url) => {
    if (!url) return;
    window.open(url, '_blank');
  }
  return (
    <div className="student-dashboard">
      <h2 className="dashboard-title">Student Dashboard</h2>

      {/* Stats Section */}
      <div className="stats-section">
        <div className="stat-card">
          <h3>Total Documents</h3>
          <p>{documents.length}</p>
        </div>
        <div className="stat-card verified">
          <h3>Verified Documents</h3>
          <p>{verifiedDocs}</p>
        </div>
        <div className="stat-card pending">
          <h3>Pending Verification</h3>
          <p>{documents.length - verifiedDocs}</p>
        </div>
      </div>

      {/* Documents Section */}
      <div className="documents-section">
        <h3>Document Details</h3>
        <table className="documents-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Document Name</th>
              <th>Status</th>
              <th>Date Issued</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.id}>
                <td>{doc.id}</td>
                <td>{doc.name}</td>
                <td className={doc.status.toLowerCase()}>{doc.status}</td>
                <td>{doc.date}</td>
                <td>
                  <button className="buttonPrimary-student" disabled={!doc.url} onClick={() => handleDownload(doc.url)}>
                    {doc.url ? 'Download' : 'N/A'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="buttonPrimary-student" onClick={handleUpload}>Upload new document</button>
       <button className="buttonPrimary-student" onClick={handleInstituteInfo}>Add/Update Institute information</button>
    </div>
  );
};

export default StudentDashboard;
