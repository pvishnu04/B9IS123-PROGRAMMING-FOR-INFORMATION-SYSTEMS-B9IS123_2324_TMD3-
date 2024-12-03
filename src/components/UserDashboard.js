import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserDashboard() {
  const [orders, setOrders] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch user's orders
    axios.get('http://localhost:5000/orders')
      .then((response) => {
        setOrders(response.data.orders);
      })
      .catch((error) => {
        setError('Failed to fetch orders.');
      });

    // Fetch all available medicines
    axios.get('http://localhost:5000/medicines')
      .then((response) => {
        setMedicines(response.data.medicines);
      })
      .catch((error) => {
        setError('Failed to fetch medicines.');
      });
  }, []);

  const handlePlaceOrder = (medicineId) => {
    // Call API to place an order for a specific medicine
    axios.post('http://localhost:5000/orders', { medicineId })
      .then((response) => {
        setOrders([...orders, response.data.order]);
      })
      .catch((error) => {
        setError('Failed to place order.');
      });
  };
