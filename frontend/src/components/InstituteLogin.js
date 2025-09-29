import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function InstituteLogin() {
    const navigate = useNavigate();

    const [formDetails, setFormDetails] = useState({
        email: '',
        password: '',
    });

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8000/api/login/institute', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formDetails),
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('institute', JSON.stringify(data.institute));
                localStorage.setItem('userType', 'institute');
                navigate('/institution-dummy');
            } else {
                alert(data.message || 'Login failed');
            }
        } catch (err) {
            console.error('Login error:', err);
            alert('Login error');
        }
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
