import React, { useState } from 'react';
import './Signup.css';

export default function Signup() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone_no: '',
        password: '',
        birthMonth: '',
        birthDay: '',
        birthYear: '',
    });
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December',
    ];
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

    return (
        <div className="signup-form-container">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>First Name :</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Last Name *</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Email *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Phone</label>
                    <div className="phone-input">
                        <span>+1</span>
                        <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
                    </div>
                </div>

                <div className="form-group">
                    <label>Password *</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                    <p className="password-hint-signup">
                        Password must be at least 8 characters long, with an uppercase, lowercase letter, and special character.
                    </p>
                </div>
                <div className="form-group-birth">
                    <label>Birthday *</label>
                    <div> {/* This div will contain the three select boxes */}
                        <select className="birthyear-selection" name="birthMonth" value={formData.birthMonth} onChange={handleChange}>
                            <option value="">Month</option>
                            {months.map((month, index) => (
                                <option key={index} value={month}>{month}</option>
                            ))}
                        </select>

                        <select className="birthyear-selection" name="birthDay" value={formData.birthDay} onChange={handleChange}>
                            <option value="">Day</option>
                            {days.map((day) => (
                                <option key={day} value={day}>{day}</option>
                            ))}
                        </select>

                        <select className="birthyear-selection" name="birthYear" value={formData.birthYear} onChange={handleChange}>
                            <option value="">Year</option>
                            {years.map((year) => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <button
                    type="submit"
                    className="submit-button"
                >Signup</button>
            </form>
        </div>
    );
}