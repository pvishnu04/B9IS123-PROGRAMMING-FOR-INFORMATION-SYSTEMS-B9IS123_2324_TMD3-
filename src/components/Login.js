import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/api/users/login', formData);
            if (response.data.success) {
                alert('Login successful!');
                console.log(response.data.user);
            } else {
                alert('Invalid credentials. Please try again.');
            }
        } catch (err) {
            console.error(err);
            alert('Login failed. Please try again.');
        }
    };
