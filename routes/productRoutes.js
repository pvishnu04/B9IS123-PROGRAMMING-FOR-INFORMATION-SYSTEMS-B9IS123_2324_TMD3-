const express = require('express');
const router = express.Router();
const db = require('../database');

// Get all products
router.get('/', (req, res) => {
  db.all('SELECT * FROM products', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Add a new product
router.post('/', (req, res) => {
  const { name, description, price, availability, category } = req.body;
  const sql = 'INSERT INTO products (name, description, price, availability, category) VALUES (?, ?, ?, ?, ?)';
  const params = [name, description, price, availability, category];
  
  db.run(sql, params, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});

// Update a product
router.put('/:id', (req, res) => {
  const { name, description, price, availability, category } = req.body;
  const sql = `UPDATE products SET name = ?, description = ?, price = ?, availability = ?, category = ? WHERE id = ?`;
  const params = [name, description, price, availability, category, req.params.id];

  db.run(sql, params, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Product updated successfully' });
  });
});

// Delete a product
router.delete('/:id', (req, res) => {
  const sql = 'DELETE FROM products WHERE id = ?';
  db.run(sql, req.params.id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Product deleted successfully' });
  });
});

module.exports = router;
