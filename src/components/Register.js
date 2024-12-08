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
                    <label>Name:</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div>
                    <label>Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;
