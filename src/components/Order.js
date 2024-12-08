import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserDashboard from "./UserDashboard";

const Order = () => {
  const [medicines, setMedicines] = useState([]);
  const [selectedMedicines, setSelectedMedicines] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/medicines");
        setMedicines(response.data.medicines);
      } catch (error) {
        console.error("Error fetching medicines:", error);
      }
    };

    fetchMedicines();
  }, []);

  const handleQuantityChange = (medicineId, quantity) => {
    setSelectedMedicines((prev) => {
      const updatedMedicines = [...prev];
      const index = updatedMedicines.findIndex((item) => item.medicine_id === medicineId);

      if (index > -1) {
        updatedMedicines[index].quantity = quantity;
      } else {
        updatedMedicines.push({ medicine_id: medicineId, quantity });
      }

      return updatedMedicines;
    });
  };

  const calculateTotalAmount = () => {
    let total = 0;
    selectedMedicines.forEach((item) => {
      const medicine = medicines.find((med) => med.id === item.medicine_id);
      if (medicine) {
        total += parseFloat(medicine.price) * parseInt(item.quantity, 10);
      }
    });
    setTotalAmount(total.toFixed(2)); // Setting the total amount with 2 decimal places
  };

  useEffect(() => {
    calculateTotalAmount();
  }, [selectedMedicines, medicines]);

    const createOrder = async () => {
    const orderData = {
      selected_medicines: selectedMedicines,  // Include the selected medicines and their quantities
    };
  
    try {
      const response = await axios.post('http://localhost:5000/api/orders', orderData);
      console.log(response.data);
      alert("Order placed successfully");

      // Clear the form after successful order
      setSelectedMedicines([]);  // Clear selected medicines
      setTotalAmount(0);  // Reset total amount
    } catch (error) {
      console.error("Error creating order", error.response ? error.response.data : error);
      alert("Failed to place order");
    }
  };
  
  return (
    <div>
      <UserDashboard />
      <h2>Place an Order</h2>
      <h3>Available Medicines</h3>
      <ul>
        {medicines.map((medicine) => (
          <li key={medicine.id}>
            <h4>{medicine.name}</h4>
            <p>{medicine.description}</p>
            <p>Price: ${medicine.price}</p>
            <input
              type="number"
              min="1"
              placeholder="Quantity"
              onChange={(e) => handleQuantityChange(medicine.id, e.target.value)}
            />
          </li>
        ))}
      </ul>
      <h3>Total Amount: ${totalAmount}</h3> {/* Display the calculated total amount */}
      <button onClick={createOrder}>Place Order</button>
    </div>
  );
};

export default Order;
