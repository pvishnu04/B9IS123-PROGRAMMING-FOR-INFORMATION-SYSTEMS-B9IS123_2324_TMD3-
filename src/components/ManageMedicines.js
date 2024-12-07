import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminDashboard from './AdminDashboard';

const ManageMedicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [newMedicine, setNewMedicine] = useState({ name: '', description: '', price: '', stock_quantity: '' });
  const [editMedicine, setEditMedicine] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

useEffect(() => {
    fetchMedicines();
  }, []);

const fetchMedicines = async () => {
    try {
      const response = await axios.get('http://localhost:5000/admin/medicines');
      setMedicines(response.data.medicines);
    } catch (error) {
      console.error('Error fetching medicines:', error);
    }
  };
const handleChange = (e) => {
    setNewMedicine({ ...newMedicine, [e.target.name]: e.target.value });
  };

  const handleAddMedicine = async (e) => {
    e.preventDefault();
    if (!newMedicine.name || !newMedicine.description || !newMedicine.price || !newMedicine.stock_quantity) {
      alert('Please fill in all fields');
      return;
    }  

