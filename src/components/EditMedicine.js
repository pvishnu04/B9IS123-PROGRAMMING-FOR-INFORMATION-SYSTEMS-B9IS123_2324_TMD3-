import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditMedicine = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock_quantity: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/medicines/${id}`)
      .then(response => setFormData(response.data))
      .catch(error => console.error('Error fetching medicine:', error));
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`/api/medicines/${id}`, formData)
      .then(() => navigate('/admin/medicines'))
      .catch(error => console.error('Error updating medicine:', error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit Medicine</h2>
      <input name="name" value={formData.name} onChange={handleChange} required />
      <textarea name="description" value={formData.description} onChange={handleChange}></textarea>
      <input type="number" name="price" value={formData.price} onChange={handleChange} required />
      <input type="number" name="stock_quantity" value={formData.stock_quantity} onChange={handleChange} required />
      <button type="submit">Update Medicine</button>
    </form>
  );
};

export default EditMedicine;
