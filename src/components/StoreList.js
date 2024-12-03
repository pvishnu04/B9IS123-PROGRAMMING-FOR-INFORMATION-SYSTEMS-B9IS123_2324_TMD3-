import React from 'react';

function StoreList() {
  const stores = ['Pharmacy One', 'HealthPlus', 'MedStore'];

  return (
    <div>
      <h2>List of Stores</h2>
      <ul>
        {stores.map((store, index) => (
          <li key={index}>{store}</li>
        ))}
      </ul>
    </div>
  );
}

export default StoreList;
