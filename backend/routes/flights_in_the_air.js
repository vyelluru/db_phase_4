const express = require('express');
const router = express.Router();

module.exports = (pool) => {
  router.get('/', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM flights_in_the_air');

      res.json({ data: rows });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};