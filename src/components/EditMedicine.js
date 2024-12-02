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
