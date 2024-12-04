import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes,Link, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Register from './components/Register';
import Login from './components/Login';
import ContactUs from './components/ContactUs';
import MedicineList from './components/MedicineList';
import StoreList from './components/StoreList';

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
          <Route path="/admin/medicines" element={<MedicineList />} />
          <Route path="/admin/stores" element={<StoreList />} />
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
  function RenderDashboard({ userRole }) {
  if (userRole === 'admin') return <Navigate to="/admin_dashboard" />;
  return <Navigate to="/login" />;
}
export default App;
