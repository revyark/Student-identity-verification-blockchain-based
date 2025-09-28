import React, { useState } from 'react';
import './Signup.css';
import initWeb3 from '../utils/web3';

export default function InstituteSignup() {
    const [currentPage, setCurrentPage] = useState(1);
    const [formData, setFormData] = useState({
        instituteName: '',
        email: '',
        password: '',
        walletAddress: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        region: '',
        pincode: '',
        state: '',
        country: '',
        instituteCode: '',
        description: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const connectWallet = async () => {
        const web3Instance = await initWeb3();
        if (web3Instance) {
            const accounts = await web3Instance.eth.getAccounts();
            if (accounts.length > 0) {
                setFormData({ ...formData, walletAddress: accounts[0] });
            }
        }
    };

    const handleNext = () => {
        if (currentPage === 1 && (!formData.instituteName || !formData.email || !formData.password)) {
            alert('Please fill in all required fields on Page 1.');
            return;
        }
        setCurrentPage(2);
    };

    const handlePrevious = () => {
        setCurrentPage(1);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle the signup logic here
        console.log('Institute Signup Data:', formData);
        alert('Signup successful! Check console for data.');
    };

    return (
        <div className="signup-form-container">
            {currentPage === 1 && (
                <form>
                    <h2>Institute Signup - Page 1</h2>
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
                    <div className="form-group">
                        <label>Wallet Address:</label>
                        <input type="text" name="walletAddress" value={formData.walletAddress} onChange={handleChange} placeholder="Enter or connect MetaMask" />
                        <button type="button" onClick={connectWallet} className="connect-button">Connect Wallet</button>
                    </div>
                    <button type="button" onClick={handleNext} className="next-button">Next</button>
                </form>
            )}
            {currentPage === 2 && (
                <form onSubmit={handleSubmit}>
                    <h2>Institute Signup - Page 2</h2>
                    <div className="form-group">
                        <label>Phone Number:</label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Address Line 1:</label>
                        <input type="text" name="addressLine1" value={formData.addressLine1} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Address Line 2:</label>
                        <input type="text" name="addressLine2" value={formData.addressLine2} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Region:</label>
                        <input type="text" name="region" value={formData.region} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Pincode:</label>
                        <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>State:</label>
                        <input type="text" name="state" value={formData.state} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Country:</label>
                        <input type="text" name="country" value={formData.country} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Institute Code:</label>
                        <input type="text" name="instituteCode" value={formData.instituteCode} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Description:</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} />
                    </div>
                    <button type="button" onClick={handlePrevious} className="previous-button">Previous</button>
                    <button type="submit" className="submit-button">Signup</button>
                </form>
            )}
        </div>
    );
}
