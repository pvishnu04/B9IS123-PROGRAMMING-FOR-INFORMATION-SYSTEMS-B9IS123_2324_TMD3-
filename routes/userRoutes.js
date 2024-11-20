// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../database');

// Get all users
router.get('/', (req, res) => {
  db.all('SELECT id, username, email, role FROM users', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Get a single user by ID
router.get('/:id', (req, res) => {
  const sql = 'SELECT id, username, email, role FROM users WHERE id = ?';
  db.get(sql, [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row);
  });
});

// Add a new user
router.post('/', (req, res) => {
  const { username, email, password, role } = req.body;
  const sql = 'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)';
  const params = [username, email, password, role || 'customer'];

  db.run(sql, params, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});

// Update an existing user
router.put('/:id', (req, res) => {
  const { username, email, role } = req.body;
  const sql = 'UPDATE users SET username = ?, email = ?, role = ? WHERE id = ?';
  const params = [username, email, role, req.params.id];

  db.run(sql, params, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'User updated successfully' });
  });
});

// Delete a user
router.delete('/:id', (req, res) => {
  const sql = 'DELETE FROM users WHERE id = ?';
  db.run(sql, [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'User deleted successfully' });
  });
});

module.exports = router;
