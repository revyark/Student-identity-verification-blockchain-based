// src/components/Institution/InstitutionDashboard.js
import React, { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer
} from "recharts";
import "./InstitutionDashboard.css";

const InstitutionDashboard = () => {
  const [stats, setStats] = useState({
    totalIssued: 120,
    verified: 95,
    pending: 15,
    revoked: 10,
  });

  const [loading, setLoading] = useState(true);

  const barData = [
    { name: "Issued", value: stats.totalIssued },
    { name: "Verified", value: stats.verified },
    { name: "Pending", value: stats.pending },
    { name: "Revoked", value: stats.revoked },
  ];

  const pieData = [
    { name: "Verified", value: stats.verified },
    { name: "Pending", value: stats.pending },
    { name: "Revoked", value: stats.revoked },
  ];

  const COLORS = ["rgba(87, 108, 255, 0.8)", "rgba(112, 64, 145, 0.8)", "rgba(0, 0, 0, 0.9)"];

  useEffect(() => {
    // Fetch institute stats from backend using stored instituteId
    const fetchStats = async () => {
      try {
        const institute = JSON.parse(localStorage.getItem('institute'));
        if (!institute || !institute._instituteId) {
          console.error('Institute ID not found in localStorage');
          return;
        }
        const instituteId = institute._instituteId;
        const statsResponse = await fetch(`http://localhost:8000/api/institute/${instituteId}/stats`);
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        } else {
          console.error('Failed to fetch stats');
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    const interval = setInterval(() => {
      fetchStats();
    }, 30000); // refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard-container">
      <h2>Institution Dashboard</h2>

      {loading ? (
        <p>Loading stats...</p>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Issued</h3>
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
              <h3>Revoked</h3>
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

          <section className="ctaSection-three">
            <h2>Perform actions!</h2>
            <div className="ctaButtons">
              <a href="/issuecredential" className="buttonPrimary">Issue Credential</a>
              <a href="/revoke-credential" className="buttonSecondary">Revoke Credential</a>
              <a href="/institution-credentials" className="buttonSecondary">View Profile</a>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default InstitutionDashboard;
