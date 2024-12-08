import React from 'react';
import { Link } from "react-router-dom";

const UserDashboard = () => {
  const handleLogout = () => {
    localStorage.removeItem('authToken'); 
    window.location.href = '/login'; 
  };
return (
    <div>
      <h2>User Dashboard</h2>
      <nav>
        <Link to="/api/medicines">View Medicines</Link>
        <Link to="/api/orders">Place Orders</Link>
      </nav>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default UserDashboard;
