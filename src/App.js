import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import ContactUs from './components/ContactUs';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import ManageMedicines from './components/ManageMedicines';
import Medicines from './components/Medicines'; 
import Orders from './components/Order'; 
import ViewOrders from './components/ViewOrders';

function App() {
  const [setRole] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const loggedInUser = localStorage.getItem('user'); // Retrieve user details from localStorage
    if (loggedInUser) {
      const user = JSON.parse(loggedInUser); // Parse the stored user details
      setRole(user.role); // Set user role
      if (user.role === 'user') {
        navigate('/userdashboard'); // Redirect to user dashboard if user is logged in
      } else if (user.role === 'admin') {
        navigate('/admin');
      }
    }
  }, [navigate]);
  return (
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/admin_dashboard" element={<AdminDashboard />} />
          <Route path="/admin/medicines" element={<ManageMedicines />} />
          <Route path="/userdashboard" element={<UserDashboard />} />
          <Route path="/api/medicines" element={<Medicines />} /> 
          <Route path="/api/orders" element={<Orders />} /> 
          <Route path="/admin/orders" element={<ViewOrders />} />
        </Routes>
    </div>
  );
}

export default App;
