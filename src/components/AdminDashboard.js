import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import ManageMedicines from "./ManageMedicines";
import ViewOrders from "./ViewOrders";
const AdminDashboard = () => {
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  };
  return (
    <div>
      <h2>Admin Dashboard</h2>
      <nav>
        <ul>
          <li>
            <Link to="/admin/medicines">Manage Medicines</Link>
          </li>
          <li>
            <Link to="/admin/orders">Manage Orders</Link>
          </li>
        </ul>
      </nav>
      <button onClick={handleLogout}>Logout</button>
      <Routes>
        <Route path="/admin/medicines" element={<ManageMedicines />} />
        <Route path="/admin/orders" element={<ViewOrders />} />
        {/* Other routes can be added here */}
      </Routes>
    </div>
  );
};
export default AdminDashboard;
