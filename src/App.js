import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes,Link, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Register from './components/Register';
import Login from './components/Login';
import ContactUs from './components/ContactUs';
import MedicineList from './components/MedicineList';
import StoreList from './components/StoreList';
import AdminDashboard from './components/AdminDashboard';
import PharmacistDashboard from './components/PharmacistDashboard';

function App() {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setUserRole(storedRole);
  }, []);
  return (
    <Router>
      <DynamicHeader userRole={userRole} />
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/stores" element={<StoreList />} />

          {/* Admin Routes */}
          <Route path="/admin_dashboard" element={<AdminDashboard />} />
          <Route path="/admin/medicines" element={<MedicineList />} />
          <Route path="/admin/stores" element={<StoreList />} />

          {/* Pharmacist Routes */}
          <Route path="/pharmacist_dashboard" element={<PharmacistDashboard />} />
          {/* User Routes */}
          <Route path="/user_dashboard" element={<UserDashboard />} />
          {/* Dashboard Redirect */}
          <Route path="/dashboard" element={<RenderDashboard userRole={userRole} />} />
        </Routes>
    </Router>
  );
}

function DynamicHeader({ userRole }) {
  const location = useLocation();

  if (location.pathname.startsWith('/admin')) {
    return (
      <header>
        <h1>Welcome to Admin Dashboard</h1>
        <nav>
          <Link to="/admin/medicines">Medicines</Link> | 
        </nav>
      </header>
    );
  } else if (location.pathname.startsWith('/pharmacist')) {
    return (
      <header>
        <h1>Welcome to Pharmacist Dashboard</h1>
        <nav>
          <Link to="/pharmacist_dashboard">Dashboard</Link>
        </nav>
      </header>
    );
  } else if (location.pathname.startsWith('/user')) {
    return (
      <header>
        <h1>Welcome to User Dashboard</h1>
        <nav>
          <Link to="/user_dashboard">My Orders</Link> | 
        </nav>
      </header>
    );
  }
    function RenderDashboard({ userRole }) {
  if (userRole === 'admin') return <Navigate to="/admin_dashboard" />;
  if (userRole === 'pharmacist') return <Navigate to="/pharmacist_dashboard" />;
  if (userRole === 'user') return <Navigate to="/user_dashboard" />;
  return <Navigate to="/login" />;
}
export default App;
