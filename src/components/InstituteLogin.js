 import React, { useState } from 'react';
 import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function InstituteLogin() {
    const navigate=useNavigate();

    const [formDetails, setFormDetails] = useState({
        email: '',
        password: '',
    });

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        try {
            // Handle the login logic here
            console.log('Institute Login Data:', formDetails);
        } catch (err) {
            console.log(err);
        }
        navigate("/institution-dummy");
    };

    const handleOnChange = (e) => {
        setFormDetails({ ...formDetails, [e.target.name]: e.target.value });
    };

    return (
        <div className="login-form-container">
            <h2>Institute Login</h2>
            <form onSubmit={handleOnSubmit}>
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formDetails.email}
                        onChange={handleOnChange}
                        required
                        placeholder="Enter your email"
                    />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={formDetails.password}
                        onChange={handleOnChange}
                        required
                        placeholder="Enter your password"
                    />
                </div>  
                <button
                    type="submit"
                    className="submit-button"
                >Login</button>
                <p className="note">
                    Don't have an account? <a href="/institute-signup" className="signup-link">Signup</a>
                </p>
            </form>
        </div>
    );
}
