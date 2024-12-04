import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PharmacistDashboard() {
  const [medicines, setMedicines] = useState([]);
  const [medicineName, setMedicineName] = useState('');
  const [medicinePrice, setMedicinePrice] = useState('');
  const [medicineDescription, setMedicineDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch medicines from the server
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

    // Send request to add new medicine
    axios.post('http://localhost:5000/medicines', {
      name: medicineName,
      price: medicinePrice,
      description: medicineDescription,
    })
      .then((response) => {
        // Update the medicines list after adding new medicine
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
