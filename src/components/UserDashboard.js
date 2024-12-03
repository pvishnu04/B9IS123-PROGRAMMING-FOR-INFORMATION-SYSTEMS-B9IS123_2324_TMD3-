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
return (
    <div>
      <h2>User Dashboard</h2>
      <p>Welcome, User! You can view your orders and place new orders here.</p>

      {/* Orders Section */}
      <div>
        <h3>Your Orders</h3>
        {orders.length > 0 ? (
          <ul>
            {orders.map((order) => (
              <li key={order.id}>
                Order ID: {order.id}, Medicine: {order.medicine.name} - {order.medicine.price} USD
              </li>
            ))}
          </ul>
        ) : (
          <p>You have no orders yet.</p>
        )}
      </div>

      {/* Medicines Section */}
      <div>
        <h3>Available Medicines</h3>
        <ul>
          {medicines.map((medicine) => (
            <li key={medicine.id}>
              <strong>{medicine.name}</strong> - {medicine.price} USD
              <button onClick={() => handlePlaceOrder(medicine.id)}>Order</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default UserDashboard;
