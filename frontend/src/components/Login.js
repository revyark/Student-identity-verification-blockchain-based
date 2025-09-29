import React,{useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
export default function Login() {
    const navigate=useNavigate();
    const [formDetails,setFormDetails]=useState({
        email:'',
        password:'',
    })
    const handleOnSubmit=async(e)=>{
        e.preventDefault();
        try{
            const response = await fetch('http://localhost:8000/api/login/student', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formDetails),
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('student', JSON.stringify(data.student));
                localStorage.setItem('userType', 'student');
                navigate('/student-dashboard');
            } else {
                alert(data.message || 'Login failed');
            }
        }catch(err){
            console.log(err);
            alert('Login error');
        }
    }
    const handleOnChange=(e)=>{
        setFormDetails({...formDetails,[e.target.name]:e.target.value});
    }
  return (
    <div className="login-form-container">
        <h2>Student Login</h2>
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
                Don't have an account ? <a href="/signup" className="signup-link">Signup</a>
            </p>
        </form>
    </div>
  )
}
