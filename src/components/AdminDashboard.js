import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div>
      <h1>Welcome to Admin Dashboard</h1>
      <nav>
        <Link to="/admin/medicines">Medicines</Link> | 
        <Link to="/admin/orders">Orders</Link> | 
        <Link to="/admin/stores">Stores</Link>
      </nav>
    </div>
  );
};

export default AdminDashboard;
