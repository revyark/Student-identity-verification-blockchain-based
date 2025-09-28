// src/pages/HomePage.js
import React from 'react';
import './Homepage.css';

// You might want to import WalletConnector or other common components here
// import WalletConnector from '../components/common/WalletConnector';

const HomePage = () => {
    return (
        <div className="container">
            <header className="header">
                <h1>Welcome to Decentralized Credential Verification</h1>
                <p className="subtitle">Empowering students with verifiable, tamper-proof credentials on the blockchain.</p>
            </header>

            <section className="section">
                <h2>Why Blockchain for Credentials?</h2>
                <div className="featureGrid">
                    <div className="featureCard">
                        <h3>Fraud Prevention</h3>
                        <p>Eliminate forged documents with immutable blockchain records.</p>
                    </div>
                    <div className="featureCard">
                        <h3>Instant Verification</h3>
                        <p>Verify academic achievements in seconds, not weeks.</p>
                    </div>
                    <div className="featureCard">
                        <h3>Student Ownership</h3>
                        <p>Students control their own credentials and share them securely.</p>
                    </div>
                    <div className="featureCard">
                        <h3>Global Recognition</h3>
                        <p>Standardized, universally verifiable proofs for international mobility.</p>
                    </div>
                </div>
            </section>

            <section className="section">
                <h2>How It Works</h2>
                <div className="howItWorks">
                    <div className="step">
                        <div className="stepNumber">1</div>
                        <h3>Institution Issues</h3>
                        <p>Universities issue academic records directly to the blockchain, linked to the student's unique identity.</p>
                    </div>
                    <div className="step">
                        <div className="stepNumber">2</div>
                        <h3>Student Owns</h3>
                        <p>Students access their verified credentials securely via their digital wallet, stored on IPFS.</p>
                    </div>
                    <div className="step">
                        <div className="stepNumber">3</div>
                        <h3>Verifier Confirms</h3>
                        <p>Employers or other institutions instantly verify credentials by querying the blockchain.</p>
                    </div>
                </div>
            </section>

            <section className="section">
                <h2>Importance of tamper proof credentials</h2>
                <div className="tamper">
                    <div className="step-two">
                        <div className="stepNumber">1</div>
                        <p>Every certificate and student ID is securely recorded on the blockchain.</p>
                    </div>
                    <div className="step-two">
                        <div className="stepNumber">2</div>
                        <p>Credentials cannot be altered or forged.</p>
                    </div>
                    <div className="step-two">
                        <div className="stepNumber">3</div>
                        <p>Students, institutions, and verifiers can confidently rely on blockchain-backed records to eliminate fraud and ensure transparency.</p>
                    </div>
                </div>
            </section>
            

            <section className="ctaSection">
                <h2>Get Started Today!</h2>
                <div className="ctaButtons">
                    <a href="/login-signup" className="buttonPrimary">I'm a Student</a>
                    <a href="/institute-login" className="buttonSecondary">I'm an Institution</a>
                    <a href="/verifier-login" className="buttonSecondary">Verify a Credential</a>
                </div>
            </section>

            {/* You could add a WalletConnector here if you want it prominent on the landing page */}
            {/* <WalletConnector /> */}
        </div>
    );
};

export default HomePage;
