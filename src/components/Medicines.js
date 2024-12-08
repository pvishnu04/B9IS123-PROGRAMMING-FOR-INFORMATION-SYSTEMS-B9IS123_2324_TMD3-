import React, { useState, useEffect } from "react";
import axios from "axios";
import Home from "./Home";

const Medicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");

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
const handleSearchChange = (e) => setSearchTerm(e.target.value);
const handleSortChange = (e) => setSortOption(e.target.value);
const filteredAndSortedMedicines = medicines
    .filter((medicine) =>
      medicine.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOption === "name-asc") return a.name.localeCompare(b.name);
      if (sortOption === "name-desc") return b.name.localeCompare(a.name);
      if (sortOption === "price-asc") return a.price - b.price;
      if (sortOption === "price-desc") return b.price - a.price;
      return 0;
    });
  return (
    <div>
      <Home />
      <h2>Available Medicines</h2>
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={handleSearchChange}
          style={{ marginRight: "10px", padding: "5px" }}
        />
          <select value={sortOption} onChange={handleSortChange} style={{ padding: "5px" }}>
          <option value="">Sort By</option>
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
          <option value="price-asc">Price (Low to High)</option>
          <option value="price-desc">Price (High to Low)</option>
        </select>
      </div>
      <ul>
        {filteredAndSortedMedicines.length > 0 ? (
          filteredAndSortedMedicines.map((medicine) => (
          <li key={medicine.id} style={{ borderBottom: "1px solid #ddd", padding: "10px" }}>
            <h3>{medicine.name}</h3>
            <p>{medicine.description}</p>
            <p>Price: ${medicine.price}</p>
            <p>Stock: {medicine.stock_quantity}</p>
          </li>
        ))
      ) : (
        <p>No Medicines found.</p>
        )}
      </ul>
    </div>
  );
};

export default Medicines;
