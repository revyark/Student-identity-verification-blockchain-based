
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

// Import your new Home Page component
import HomePage from './pages/Homepage.js'; // or './pages/LandingPage'
import IssueCredentialForm from './components/Institution/IssueCredentialForm'; // Dummy version
import VerifyCredential from './components/Verifier/VerifyCredential'; // Dummy version
import Background from './components/Background.js';
import StudentUpload from './components/Studentupload';
import Login from './components/Login.js';
import Signup from './components/Signup.js';
import InstituteLogin from './components/InstituteLogin.js';
import InstituteSignup from './components/InstituteSignup.js';
import VerifierLogin from './components/VerifierLogin.js';
import VerifierSignup from './components/VerifierSignup.js';
import InstitutionDashboard from './components/Institution/InstitutionDashboard.js';
import InstituteProfile from './components/Institution/InstitutionProfile.js';
import RevokeCredentialForm from './components/Institution/RevokeCredential.js';
import VerifierDashboard from './components/Verifier/VerifyCredential';
import VerifierDash from './components/Verifier/VerifierDashboard.js';
import StudentDashboard from './components/Student/StudentDashboard.js';
import InstituteInfo from './components/Student/Institute-info.js';

function App() {
    return (
        <Router>
            <div className="appContainer">
                <Background />
                <nav className="navbar">
                    <ul className="navList">
                        <li><Link to="/" className="navLink">Home</Link></li>
                        <li><Link to="/login-signup" className="navLinkStudent">Student Login</Link></li>
                        <li><Link to="/institute-login" className="navLinkInstitution">Institute Login</Link></li>
                        <li><Link to="/verifier-login" className="navLinkVerifier">Verifier Login</Link></li>
                        
                        {/* Add Dummy Student Dashboard link later */}
                    </ul>
                </nav>

                <Routes>
                    {/* Set the path for the home page */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/institution-dummy" element={<InstitutionDashboard />} />
                    <Route path="/verifier-dummy" element={<VerifyCredential />} />
                    <Route path="/student-upload" element={<StudentUpload/>}></Route>
                    <Route path="/login-signup" element={<Login/>}></Route>
                    <Route path="/signup" element={<Signup/>}></Route>
                    <Route path="/institute-login" element={<InstituteLogin/>}></Route>
                    <Route path="/institute-signup" element={<InstituteSignup/>}></Route>
                    <Route path="/verifier-login" element={<VerifierLogin/>}></Route>
                    <Route path="/verifier-signup" element={<VerifierSignup/>}></Route>
                    <Route path="/institution-credentials" element={<InstituteProfile/>}></Route>
                    <Route path="/issuecredential" element={<IssueCredentialForm/>}></Route>
                    <Route path="/revoke-credential" element={<RevokeCredentialForm/>}></Route>
                    <Route path="/verifier-credential" element={<VerifierDashboard/>}></Route>
                    <Route path="/verifier-dashboard" element={<VerifierDash/>}></Route>
                    <Route path="/student-dashboard" element={<StudentDashboard/>}></Route>
                    <Route path="/institute-info" element={<InstituteInfo/>}></Route>
                    {/* Add more dummy routes for StudentDashboard, etc. */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
