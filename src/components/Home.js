import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-container">
      <h1>Welcome to the Medicine Store</h1>
      <nav>
      <Link to="/register">Register</Link>
      <Link to="/login">Login</Link>
      <Link to="/api/medicines">Medicines</Link>
      <Link to="/contactUs">Contact Us</Link>
      </nav>
  </div>
  );
};
export default Home;
