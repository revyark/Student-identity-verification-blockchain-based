// src/pages/HomePage.js
import React from 'react';
// You might want to import WalletConnector or other common components here
// import WalletConnector from '../components/common/WalletConnector';

const HomePage = () => {
    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1>Welcome to Decentralized Credential Verification</h1>
                <p style={styles.subtitle}>Empowering students with verifiable, tamper-proof credentials on the blockchain.</p>
            </header>

            <section style={styles.section}>
                <h2>Why Blockchain for Credentials?</h2>
                <div style={styles.featureGrid}>
                    <div style={styles.featureCard}>
                        <h3>Fraud Prevention</h3>
                        <p>Eliminate forged documents with immutable blockchain records.</p>
                    </div>
                    <div style={styles.featureCard}>
                        <h3>Instant Verification</h3>
                        <p>Verify academic achievements in seconds, not weeks.</p>
                    </div>
                    <div style={styles.featureCard}>
                        <h3>Student Ownership</h3>
                        <p>Students control their own credentials and share them securely.</p>
                    </div>
                    <div style={styles.featureCard}>
                        <h3>Global Recognition</h3>
                        <p>Standardized, universally verifiable proofs for international mobility.</p>
                    </div>
                </div>
            </section>

            <section style={styles.section}>
                <h2>How It Works</h2>
                <div style={styles.howItWorks}>
                    <div style={styles.step}>
                        <div style={styles.stepNumber}>1</div>
                        <h3>Institution Issues</h3>
                        <p>Universities issue academic records directly to the blockchain, linked to the student's unique identity.</p>
                    </div>
                    <div style={styles.step}>
                        <div style={styles.stepNumber}>2</div>
                        <h3>Student Owns</h3>
                        <p>Students access their verified credentials securely via their digital wallet, stored on IPFS.</p>
                    </div>
                    <div style={styles.step}>
                        <div style={styles.stepNumber}>3</div>
                        <h3>Verifier Confirms</h3>
                        <p>Employers or other institutions instantly verify credentials by querying the blockchain.</p>
                    </div>
                </div>
            </section>

            <section style={styles.ctaSection}>
                <h2>Get Started Today!</h2>
                <div style={styles.ctaButtons}>
                    <a href="/student" style={styles.buttonPrimary}>I'm a Student</a>
                    <a href="/institution" style={styles.buttonSecondary}>I'm an Institution</a>
                    <a href="/verifier" style={styles.buttonSecondary}>Verify a Credential</a>
                </div>
            </section>

            {/* You could add a WalletConnector here if you want it prominent on the landing page */}
            {/* <WalletConnector /> */}
        </div>
    );
};

// Basic inline styles - you'd typically use a CSS file or a styling library
const styles = {
    container: {
        fontFamily: 'Arial, sans-serif',
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto',
        lineHeight: '1.6',
        color: '#333'
    },
    header: {
        textAlign: 'center',
        marginBottom: '40px',
        padding: '40px 20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    subtitle: {
        fontSize: '1.2em',
        color: '#555'
    },
    section: {
        marginBottom: '60px',
        textAlign: 'center'
    },
    featureGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginTop: '30px'
    },
    featureCard: {
        backgroundColor: '#fff',
        padding: '25px',
        borderRadius: '8px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
        textAlign: 'left'
    },
    howItWorks: {
        display: 'flex',
        justifyContent: 'center',
        gap: '30px',
        marginTop: '30px',
        flexWrap: 'wrap'
    },
    step: {
        flex: '1',
        minWidth: '280px',
        maxWidth: '350px',
        backgroundColor: '#e6f7ff',
        padding: '25px',
        borderRadius: '8px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
        textAlign: 'center',
        position: 'relative',
        paddingTop: '60px' // Space for number
    },
    stepNumber: {
        position: 'absolute',
        top: '15px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: '#007bff',
        color: 'white',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5em',
        fontWeight: 'bold',
        border: '3px solid #fff'
    },
    ctaSection: {
        textAlign: 'center',
        backgroundColor: '#0056b3',
        color: 'white',
        padding: '50px 20px',
        borderRadius: '8px'
    },
    ctaButtons: {
        marginTop: '30px',
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
        flexWrap: 'wrap'
    },
    buttonPrimary: {
        backgroundColor: '#28a745',
        color: 'white',
        padding: '12px 25px',
        borderRadius: '5px',
        textDecoration: 'none',
        fontWeight: 'bold',
        transition: 'background-color 0.3s ease',
        border: 'none',
        cursor: 'pointer'
    },
    buttonSecondary: {
        backgroundColor: 'transparent',
        color: 'white',
        padding: '12px 25px',
        borderRadius: '5px',
        textDecoration: 'none',
        fontWeight: 'bold',
        border: '2px solid white',
        transition: 'background-color 0.3s ease, color 0.3s ease',
        cursor: 'pointer'
    },
    'buttonPrimary:hover': {
        backgroundColor: '#218838'
    },
    'buttonSecondary:hover': {
        backgroundColor: 'white',
        color: '#0056b3'
    }
};

export default HomePage;