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

    try {
      const medicineData = {
        name: newMedicine.name,
        description: newMedicine.description,
        price: parseFloat(newMedicine.price),
        stock_quantity: parseInt(newMedicine.stock_quantity),
      };

      const response = await axios.post('http://localhost:5000/admin/medicines', medicineData);
      if (response.status === 201) {
        alert('Medicine added successfully!');
        fetchMedicines();
        setNewMedicine({ name: '', description: '', price: '', stock_quantity: '' });
        setShowAddForm(false); // Hide the form after adding
      }
    } catch (error) {
      console.error('Error adding medicine:', error);
    }
  };
  const handleDeleteMedicine = async (id) => {
    if (window.confirm('Are you sure you want to delete this medicine?')) {
      try {
        await axios.delete(`http://localhost:5000/admin/medicines/${id}`);
        alert('Medicine deleted successfully!');
        fetchMedicines();
      } catch (error) {
        console.error('Error deleting medicine:', error);
      }
    }
  };
  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleSortChange = (e) => setSortOption(e.target.value);

  const filteredAndSortedMedicines = medicines
    .filter((medicine) => medicine.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortOption === 'price-asc') return a.price - b.price;
      if (sortOption === 'price-desc') return b.price - a.price;
      if (sortOption === 'name-asc') return a.name.localeCompare(b.name);
      if (sortOption === 'name-desc') return b.name.localeCompare(a.name);
      return 0;
    });
return (
    <div style={{ padding: '20px' }}>
      <AdminDashboard />
      <h2>Manage Medicines</h2>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={handleSearchChange}
          style={{ marginRight: '10px' }}
        />
        <select value={sortOption} onChange={handleSortChange}>
          <option value="">Sort By</option>
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
          <option value="price-asc">Price (Low to High)</option>
          <option value="price-desc">Price (High to Low)</option>
        </select>
      </div>

      <button onClick={() => setShowAddForm(!showAddForm)} style={{ marginBottom: '20px' }}>
        {showAddForm ? 'Cancel Add' : 'Add Medicine'}
      </button>
      {showAddForm && (
        <form onSubmit={handleAddMedicine} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px', margin: 'auto' }}>
          <input type="text" name="name" placeholder="Name" value={newMedicine.name} onChange={handleChange} required />
          <textarea name="description" placeholder="Description" value={newMedicine.description} onChange={handleChange} />
          <input type="number" name="price" placeholder="Price" value={newMedicine.price} onChange={handleChange} required />
          <input type="number" name="stock_quantity" placeholder="Stock Quantity" value={newMedicine.stock_quantity} onChange={handleChange} required />
          <button type="submit">Add Medicine</button>
        </form>
      )}

      <h3>Available Medicines</h3>
      <table border="1" cellPadding="10" style={{ marginTop: '20px' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Stock Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAndSortedMedicines.length > 0 ? (
            filteredAndSortedMedicines.map((medicine) => (
              <tr key={medicine.id}>
                <td>{medicine.name}</td>
                <td>{medicine.description}</td>
                <td>{medicine.price}</td>
                <td>{medicine.stock_quantity}</td>
                <td>
                  <button onClick={() => setEditMedicine(medicine)}>Edit</button>
                  <button onClick={() => handleDeleteMedicine(medicine.id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No medicines found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageMedicines;
