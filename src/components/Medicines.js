import React, { useState, useEffect } from "react";
import axios from "axios";
import Home from "./Home";

const Medicines = () => {
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/medicines");
        setMedicines(response.data.medicines); // Access the 'medicines' array correctly
      } catch (error) {
        console.error("Error fetching medicines:", error);
      }
    };

    fetchMedicines();
  }, []);

  return (
    <div>
      <Home />
      <h2>Available Medicines</h2>
      <ul>
        {medicines.map((medicine) => (
          <li key={medicine.id}>
            <h3>{medicine.name}</h3>
            <p>{medicine.description}</p>
            <p>Price: ${medicine.price}</p>
            <p>Stock: {medicine.stock_quantity}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Medicines;
