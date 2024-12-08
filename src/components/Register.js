import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom"; 
import Home from './Home';

const Register = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        email: "",
        role:"user",
    });
    const [isRegistered, setIsRegistered] = useState(false); 
    const navigate = useNavigate();
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/register', formData);
            console.log(response.data);
            alert('Registration successful!');
            setFormData({ username: "", password: "", email: "", role: "user" }); 
            setIsRegistered(true);
        } catch (err) {
            console.error("Error registering user:", error);
            alert('Registration failed. Please try again.');
            setFormData({ username: "", password: "", email: "", role: "user" });
        }
    };
    return (
        <div style={containerStyle}>
            <Home />
          {isRegistered ? (
            <div>
              <h2>Registration Successful!</h2>
              <p>Click below to login:</p>
              <button onClick={() => navigate("/login")} style={buttonStyle}>
                Go to Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={formStyle}>
                <h2>Register</h2>
                <div>
                    <label>Username:</label>
                    <input type="text" name="username" placeholder="Enter your username" value={formData.username} onChange={handleChange} required />
                </div>
                <div>
                    <label>Email:</label>
                    <input type="email" name="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" name="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} required />
                </div>
                <div>
            <label>Role:</label>
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
                <button type="submit" style={buttonStyle}>Register</button>
            </form>
            )}
        </div>
    );
};
const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  maxWidth: "400px",
  margin: "auto",
};

const containerStyle = {
  textAlign: "center",
  marginTop: "20px",
};

const buttonStyle = {
  padding: "10px 20px",
  backgroundColor: "#4CAF50",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

export default Register;
