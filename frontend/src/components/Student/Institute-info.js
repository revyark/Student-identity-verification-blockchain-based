import React, { useState } from "react";
import "./StudentDashboard.css";

const InstituteInfo = () => {
  const [formData, setFormData] = useState({
    instituteName: "",
    address: "",
    contact: "",
    email: "",
    website: "",
  });
  const [submitted, setSubmitted] = useState(false);

  // Mock issued credentials (replace with actual data later)
  const [issuedCredentials] = useState([
    { id: 1, name: "Degree Certificate", status: "Issued", date: "2023-10-01" },
    { id: 2, name: "Transcript", status: "Issued", date: "2023-10-05" },
    { id: 3, name: "Diploma", status: "Pending", date: "2023-10-10" },
  ]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can add logic to submit the form data to backend/blockchain
    console.log("Form submitted:", formData);
    setSubmitted(true);
  };

  return (
    <div className="student-dashboard">
      <h2 className="dashboard-title">Institute Information</h2>

      {!submitted ? (
        <div className="documents-section">
          <h3>Fill Institute Details</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "15px" }}>
              <label style={{ color: "#fff", display: "block", marginBottom: "5px" }}>
                Institute Name:
              </label>
              <input
                type="text"
                name="instituteName"
                value={formData.instituteName}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  background: "transparent",
                  color: "#fff",
                }}
              />
            </div>
            <div style={{ marginBottom: "15px" }}>
              <label style={{ color: "#fff", display: "block", marginBottom: "5px" }}>
                Address:
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  background: "transparent",
                  color: "#fff",
                  minHeight: "80px",
                }}
              />
            </div>
            <div style={{ marginBottom: "15px" }}>
              <label style={{ color: "#fff", display: "block", marginBottom: "5px" }}>
                Contact Number:
              </label>
              <input
                type="tel"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  background: "transparent",
                  color: "#fff",
                }}
              />
            </div>
            <div style={{ marginBottom: "15px" }}>
              <label style={{ color: "#fff", display: "block", marginBottom: "5px" }}>
                Email:
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  background: "transparent",
                  color: "#fff",
                }}
              />
            </div>
            <div style={{ marginBottom: "15px" }}>
              <label style={{ color: "#fff", display: "block", marginBottom: "5px" }}>
                Website:
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  background: "transparent",
                  color: "#fff",
                }}
              />
            </div>
            <button type="submit" className="buttonPrimary-student-institute">
              Submit Institute Information
            </button>
          </form>
        </div>
      ) : (
        <div>
          <h3 style={{ color: "#fff" }}>Institute Information Submitted Successfully!</h3>
          <div className="documents-section">
            <h3>Issued Credentials</h3>
            <table className="documents-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Credential Name</th>
                  <th>Status</th>
                  <th>Date Issued</th>
                  <th>Download</th>
                </tr>
              </thead>
              <tbody>
                {issuedCredentials.map((cred) => (
                  <tr key={cred.id}>
                    <td>{cred.id}</td>
                    <td>{cred.name}</td>
                    <td className={cred.status.toLowerCase()}>{cred.status}</td>
                    <td>{cred.status === "Issued" ? cred.date : "—"}</td>
                    <td>
                      <button
                        className="buttonPrimary-student"
                        onClick={() => alert(`Download initiated for ${cred.name}`)}
                        style={{ padding: "5px 10px", fontSize: "12px" }}
                      >
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstituteInfo;
