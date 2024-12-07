import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminDashboard from "./AdminDashboard";

const ViewOrders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:5000/admin/orders");
        console.log("Fetched Orders Response:", response.data);

        if (response.data && response.data.orders) {
          setOrders(response.data.orders);
        } else {
          setError("No orders found.");
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Error fetching orders.");
      }
    };
    fetchOrders();
  }, []);

  const handleUpdateOrder = async (id, status) => {
    try {
      console.log(`Updating order ${id} to ${status}`);
      const response = await axios.put(
        `http://localhost:5000/admin/orders/${id}`,
        { status }
      );
      console.log("Response from update:", response.data);

      if (response.data.message === 'Order updated successfully') {
        setOrders(
          orders.map((order) =>
            order.id === id ? { ...order, status } : order
          )
        );
        alert("Order updated successfully");
      } else {
        alert("Failed to update order");
      }
    } catch (err) {
      console.error("Error updating order:", err);
      alert("Error updating order.");
    }
  };
  return (
    <div>
      <h2>Pharmacist Dashboard</h2>
      <p>Welcome, Pharmacist! You can manage medicines and prescriptions here.</p>

      {/* Add Medicine Section */}
      <div>
        <h3>Add New Medicine</h3>
        <div>
          <label>Medicine Name:</label>
          <input
            type="text"
            value={medicineName}
            onChange={(e) => setMedicineName(e.target.value)}
          />
        </div>
        <div>
          <label>Medicine Price:</label>
          <input
            type="number"
            value={medicinePrice}
            onChange={(e) => setMedicinePrice(e.target.value)}
          />
        </div>
        <div>
          <label>Medicine Description:</label>
          <textarea
            value={medicineDescription}
            onChange={(e) => setMedicineDescription(e.target.value)}
          />
        </div>
        <button onClick={handleAddMedicine}>Add Medicine</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>

      {/* Medicines List Section */}
      <h3>Medicines List</h3>
      <ul>
        {medicines.map((medicine) => (
          <li key={medicine.id}>
            <strong>{medicine.name}</strong> - {medicine.price} USD
            <p>{medicine.description}</p>
            {/* Add buttons for edit/delete */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PharmacistDashboard;
