import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Home from "./Home";
const Login = () => {
    const [credentials, setCredentials] = useState({ username: "", password: "" });
    const navigate = useNavigate();
    
    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
      };
    const handleSubmit = async (e) => {
        e.preventDefault();
    try {
        const response = await axios.post('http://127.0.0.1:5000/login', credentials');
        if (response.status === 200) {
            if (credentials.username === "admin") {
              navigate("/admin");
            } else {
                navigate("/userdashboard");
            }
        } catch (err) {
            console.error("Error during login:", error);
            alert('Invalid credentials or login failed..');
        }
    };
    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};
