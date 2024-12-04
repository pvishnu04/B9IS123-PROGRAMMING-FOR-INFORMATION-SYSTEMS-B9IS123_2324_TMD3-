import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function AddStore() {
  const [store, setStore] = useState({
    name: '',
    address: '',
    phoneNumber: '',
    openHours: '',
    isActive: true,
  });

  const navigate = useNavigate();
  const { id } = useParams(); // Used for updating an existing store
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch store data if the user is updating an existing store
  useEffect(() => {
    if (id) {
      setIsUpdating(true);
      axios.get(`/api/stores/${id}`)
        .then(response => {
          setStore(response.data);
        })
        .catch(error => {
          console.error('There was an error fetching the store data!', error);
        });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStore({ ...store, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const storeData = {
      name: store.name,
      address: store.address,
      phoneNumber: store.phoneNumber,
      openHours: store.openHours,
      isActive: store.isActive === 'true' ? true : false,
    };

    if (isUpdating) {
      // Update store
      axios.put(`/api/stores/${id}`, storeData)
        .then(response => {
          navigate('/admin/stores');
        })
        .catch(error => {
          console.error('Error updating store:', error);
        });
    } else {
      // Add new store
      axios.post('/api/stores', storeData)
        .then(response => {
          navigate('/admin/stores');
        })
        .catch(error => {
          console.error('Error adding new store:', error);
        });
    }
  };
  return (
    <div>
      <h2>{isUpdating ? 'Update Store' : 'Add Store'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Store Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={store.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="address">Store Address:</label>
          <input
            type="text"
            id="address"
            name="address"
            value={store.address}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="phoneNumber">Phone Number:</label>
          <input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            value={store.phoneNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="openHours">Opening Hours:</label>
          <input
            type="text"
            id="openHours"
            name="openHours"
            value={store.openHours}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="isActive">Store Status:</label>
          <select
            id="isActive"
            name="isActive"
            value={store.isActive}
            onChange={handleChange}
            required
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        <button type="submit">{isUpdating ? 'Update' : 'Add'} Store</button>
      </form>
    </div>
  );
}

export default AddStore;

