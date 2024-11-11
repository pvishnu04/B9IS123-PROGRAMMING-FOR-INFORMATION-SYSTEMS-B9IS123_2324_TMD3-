const express = require('express');
const router = express.Router();
const db = require('../database');

router.get('/', (req, res) => {
  db.all('SELECT * FROM orders', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Get a single order by ID
router.get('/:id', (req, res) => {
  const sql = 'SELECT * FROM orders WHERE id = ?';
  db.get(sql, [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row);
  });
});

router.post('/', (req, res) => {
  const { user_id, products, total_price } = req.body;
  const sql = 'INSERT INTO orders (user_id, products, total_price) VALUES (?, ?, ?)';
  const params = [user_id, JSON.stringify(products), total_price];

  db.run(sql, params, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});

router.put('/:id', (req, res) => {
  const { user_id, products, total_price } = req.body;
  const sql = 'UPDATE orders SET user_id = ?, products = ?, total_price = ? WHERE id = ?';
  const params = [user_id, JSON.stringify(products), total_price, req.params.id];

  db.run(sql, params, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Order updated successfully' });
  });
});

router.delete('/:id', (req, res) => {
  const sql = 'DELETE FROM orders WHERE id = ?';
  db.run(sql, [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Order deleted successfully' });
  });
});

module.exports = router;
