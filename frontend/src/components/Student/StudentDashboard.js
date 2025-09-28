import React, { useState } from "react";
import "./StudentDashboard.css";
import { useNavigate } from "react-router-dom";


const StudentDashboard = () => {
  // Mock student documents (replace later with backend or blockchain fetch)
  const [documents] = useState([
    { id: 1, name: "Marksheet - 10th Grade", status: "Verified", date: "2023-09-10" },
    { id: 2, name: "Marksheet - 12th Grade", status: "Verified", date: "2023-09-12" },
    { id: 3, name: "Degree Certificate", status: "Pending", date: "2025-08-20" },
  ]);

  const verifiedDocs = documents.filter((doc) => doc.status === "Verified").length;
  const navigate=useNavigate();
  const handleUpload=()=>{
    navigate('/student-upload');
  }
  const handleInstituteInfo=()=>{
    navigate('/institute-info');
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
              <th>Date Verified</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.id}>
                <td>{doc.id}</td>
                <td>{doc.name}</td>
                <td className={doc.status.toLowerCase()}>{doc.status}</td>
                <td>{doc.status === "Verified" ? doc.date : "—"}</td>
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
