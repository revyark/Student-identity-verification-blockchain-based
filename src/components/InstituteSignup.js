import React, { useState } from 'react';
import './Signup.css';

export default function InstituteSignup() {
    const [formData, setFormData] = useState({
        instituteName: '',
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle the signup logic here
        console.log('Institute Signup Data:', formData);
    };

    return (
        <div className="signup-form-container">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Institute Name:</label>
                    <input type="text" name="instituteName" value={formData.instituteName} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                </div>
                <button type="submit" className="submit-button">Signup</button>
            </form>
        </div>
    );
}
