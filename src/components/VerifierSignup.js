import React, { useState } from 'react';
import './Signup.css';

export default function VerifierSignup() {
    const [formData, setFormData] = useState({
        verifierName: '',
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle the signup logic here
        console.log('Verifier Signup Data:', formData);
    };

    return (
        <div className="signup-form-container">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Verifier Name:</label>
                    <input type="text" name="verifierName" value={formData.verifierName} onChange={handleChange} required />
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
