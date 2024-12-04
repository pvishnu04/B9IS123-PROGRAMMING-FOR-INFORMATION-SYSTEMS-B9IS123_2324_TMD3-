import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PharmacistDashboard() {
  const [medicines, setMedicines] = useState([]);
  const [medicineName, setMedicineName] = useState('');
  const [medicinePrice, setMedicinePrice] = useState('');
  const [medicineDescription, setMedicineDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/medicines')
      .then((response) => {
        setMedicines(response.data.medicines);
      })
      .catch((error) => {
        setError('Failed to fetch medicines.');
      });
  }, []);

  const handleAddMedicine = () => {
    if (!medicineName || !medicinePrice || !medicineDescription) {
      setError('Please provide all fields.');
      return;
    }
    axios.post('http://localhost:5000/medicines', {
      name: medicineName,
      price: medicinePrice,
      description: medicineDescription,
    })
      .then((response) => {
        setMedicines([...medicines, response.data.medicine]);
        setMedicineName('');
        setMedicinePrice('');
        setMedicineDescription('');
        setError('');
      })
      .catch((error) => {
        setError('Failed to add medicine.');
      });
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
