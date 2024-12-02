import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddMedicine = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock_quantity: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('/api/medicines', formData)
      .then(() => navigate('/admin/medicines'))
      .catch(error => console.error('Error adding medicine:', error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Medicine</h2>
      <input name="name" placeholder="Name" onChange={handleChange} required />
      <textarea name="description" placeholder="Description" onChange={handleChange}></textarea>
      <input type="number" name="price" placeholder="Price" onChange={handleChange} required />
      <input type="number" name="stock_quantity" placeholder="Stock Quantity" onChange={handleChange} required />
      <button type="submit">Add Medicine</button>
    </form>
  );
};

export default AddMedicine;
