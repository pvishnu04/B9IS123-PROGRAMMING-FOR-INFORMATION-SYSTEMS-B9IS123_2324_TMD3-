import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminDashboard from './AdminDashboard';

const ManageMedicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [newMedicine, setNewMedicine] = useState({ name: '', description: '', price: '', stock_quantity: '' });
  const [editMedicine, setEditMedicine] = useState(null);

useEffect(() => {
    fetchMedicines();
  }, []);


