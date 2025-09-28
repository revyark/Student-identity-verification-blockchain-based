import React, { useState,useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer
} from "recharts";
import {useNavigate} from "react-router-dom";
 // Import CSS file

const VerifierDash = () => {
  // Dummy Data (replace with API data later)
  const [stats, setStats] = useState({
      totalIssued: 120,
      verified: 95,
      pending: 15,
      revoked: 10,
    });
    const barData = [
    { name: "Total verified", value: stats.totalIssued },
    { name: "Valid", value: stats.verified },
    { name: "Pending", value: stats.pending },
    { name: "Invalid", value: stats.revoked },
  ];

  const pieData = [
    { name: "Valid", value: stats.verified },
    { name: "Pending", value: stats.pending },
    { name: "Invalid", value: stats.revoked },
  ];

  const COLORS = ["rgba(87, 108, 255, 0.8)", "rgba(112, 64, 145, 0.8)", "rgba(0, 0, 0, 0.9)"];
  const [institute, setInstitute] = useState({
    name: "XYZ Company",
    code: "XYZ123",
    address: "Hauz Khas, New Delhi - 110016",
    email: "contact@XYZ.iO",
    phone: "+91-11-2659-7135",
    website: "https://home.XYZ.com/",
    verified: true,
  });
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(institute);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Save changes
  const handleSave = () => {
    setInstitute(formData); // Update institute details
    setIsEditing(false); // Exit edit mode
  };
  const handleVerify = (e) => {
    e.preventDefault();
    navigate('/verifier-credential');
  }
    useEffect(() => {
      const interval = setInterval(() => {
        setStats((prev) => ({
          ...prev,
          totalIssued: prev.totalIssued + 1,
          verified: prev.verified + (Math.random() > 0.5 ? 1 : 0),
        }));
      }, 10000);
  
      return () => clearInterval(interval);
    }, []);
  return (
    <div className="institute-profile">
      <div className="profile-card">
        <h2 className="profile-title">
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="editing-input"
            />
          ) : (
            institute.name
          )}
        </h2>

        <p>
          <strong>Company Code:</strong>{" "}
          {isEditing ? (
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              className="editing-input"
            />
          ) : (
            institute.code
          )}
        </p>

        <p>
          <strong>Address:</strong>{" "}
          {isEditing ? (
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="editing-input"
            />
          ) : (
            institute.address
          )}
        </p>

        <p>
          <strong>Email:</strong>{" "}
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="editing-input"
            />
          ) : (
            institute.email
          )}
        </p>

        <p>
          <strong>Phone:</strong>{" "}
          {isEditing ? (
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="editing-input"
            />
          ) : (
            institute.phone
          )}
        </p>

        <p>
          <strong>Website:</strong>{" "}
          {isEditing ? (
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="editing-input"
            />
          ) : (
            <a
              href={institute.website}
              target="_blank"
              rel="noopener noreferrer"
            >
              {institute.website}
            </a>
          )}
        </p>

        <p>
          <strong>Status:</strong>{" "}
          <span className={institute.verified ? "verified" : "not-verified"}>
            {institute.verified ? "Verified" : " Not Verified"}
          </span>
        </p>

        <div className="profile-actions">
          {isEditing ? (
            <>
              <button className="buttonPrimary-inst" onClick={handleSave}>
                Save
              </button>
              <button className="buttonPrimary-inst" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
            </>
          ) : (
            <>
            <button className="buttonPrimary-inst" onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
            <button className="buttonPrimary-inst" onClick={handleVerify}>
              Verify Credentials
            </button>
            </>
          )}
        </div>
        
      </div>
      <div className="dashboard-container">
            <h2>Credentials</h2>
      
            {/* Summary Cards */}
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Verified</h3>
                <p>{stats.totalIssued}</p>
              </div>
              <div className="stat-card verified">
                <h3>Verified</h3>
                <p>{stats.verified}</p>
              </div>
              <div className="stat-card pending">
                <h3>Pending</h3>
                <p>{stats.pending}</p>
              </div>
              <div className="stat-card revoked">
                <h3>Failed Verification</h3>
                <p>{stats.revoked}</p>
              </div>
            </div>
      
            {/* Charts Section */}
            <div className="charts-grid">
              <div className="chart-card">
                <h3>Credential Statistics</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
      
              <div className="chart-card">
                <h3>Verification Breakdown</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      dataKey="value"
                      label
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
      
              
            </div>
            </div>
    </div>
  );
};

export default VerifierDash;
