import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminDashboard from "./AdminDashboard";

const ViewOrders = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:5000/admin/orders");
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
      const response = await axios.put(
        `http://localhost:5000/admin/orders/${id}`,
        { status }
      );
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
      const response = await axios.delete(`http://localhost:5000/admin/orders/${id}`);  
      if (response.data.message === 'Order deleted successfully') {
        setOrders(orders.filter((order) => order.id !== id));  
        alert("Order deleted successfully");
      } else {
        alert("Failed to delete order");
      }
    } catch (err) {
      console.error("Error deleting order:", err);
      alert("Error deleting order.");
    }
  };
  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleSortChange = (field) => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(newOrder);

    const sortedOrders = [...orders].sort((a, b) => {
      if (field === "id") {
        return newOrder === "asc" ? a.id - b.id : b.id - a.id;
      } else {
        return newOrder === "asc"
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      }
    });

    setOrders(sortedOrders);
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.id.toString().includes(searchTerm) ||
      order.status.toLowerCase().includes(searchTerm)
  );
  
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
