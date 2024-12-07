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

  const handleDeleteOrder = async (id) => {
    try {
      console.log(`Deleting order ${id}`);
      const response = await axios.delete(`http://localhost:5000/admin/orders/${id}`);
      console.log("Response from delete:", response.data);
  
      if (response.data.message === 'Order deleted successfully') {
        setOrders(orders.filter((order) => order.id !== id));  // Remove the order from the state
        alert("Order deleted successfully");
      } else {
        alert("Failed to delete order");
      }
    } catch (err) {
      console.error("Error deleting order:", err);
      alert("Error deleting order.");
    }
  };
  return (
    <div>
      <AdminDashboard />
      <h2>Orders</h2>
      {error && <div className="error">{error}</div>}

      <input
        type="text"
        placeholder="Search by ID or Status"
        value={searchTerm}
        onChange={handleSearch}
      />

      <div>
        <button onClick={() => handleSortChange("id")}>
          Sort by ID ({sortOrder})
        </button>
        <button onClick={() => handleSortChange("status")}>
          Sort by Status ({sortOrder})
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.status}</td>
                <td>
                  <button
                    onClick={() =>
                      handleUpdateOrder(
                        order.id,
                        order.status === "pending" ? "completed" : "pending"
                      )
                    }
                  >
                    {order.status === "pending"
                      ? "Mark as Completed"
                      : "Mark as Pending"}
                  </button>
                  <button onClick={() => handleDeleteOrder(order.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No orders available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ViewOrders;
