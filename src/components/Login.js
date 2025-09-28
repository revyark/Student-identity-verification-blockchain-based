import React,{useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
export default function Login() {
    const navigate=useNavigate();
    const handleOnClick=(e)=>{
        e.preventDefault();
        navigate("/institution-dummy");
    }
    const [formDetails,setFormDetails]=useState({
        username:'',
        password:'',
    })
    const handleOnSubmit=async(e)=>{
        e.preventDefault();
        try{
            setFormDetails({...formDetails,[e.target.name]:e.target.value});
        }catch(err){
            console.log(err);
        }
        navigate('/student-dashboard');
    }
    const handleOnChange=(e)=>{
        setFormDetails({...formDetails,[e.target.name]:e.target.value});
    }
  return (
    <div className="login-form-container">
        <h2>Login Student Form</h2>
        <form onSubmit={handleOnSubmit}>
            <div className="form-group">
                    <label>Username:</label>
                    <input
                        type="text"
                        onChange={handleOnChange}
                        required
                        placeholder="e.g., 0xhash123abcdefghijklmnopqrstuvwxyz0123456789"
                    />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input
                        type="text"
                        onChange={handleOnChange}
                        required
                        placeholder="e.g., 0x1A2B3C4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9A0B"
                    />
                </div>  
                <button onclick={handleOnClick}
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
