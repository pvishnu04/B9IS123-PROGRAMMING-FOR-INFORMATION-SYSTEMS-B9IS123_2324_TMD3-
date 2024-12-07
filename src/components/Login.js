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
            <Home />
          <form onSubmit={handleSubmit}>
            <h2>Login</h2>
                <input type="text" name="username" placeholder="Username" value={credentials.username} onChange={handleChange}
                    required/>
                    <label>Password:</label>
                <input type="password" name="password" placeholder="Password"
                            value={credentials.password} onChange={handleChange} required />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};
export default Login;
