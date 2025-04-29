const express = require('express');
const router = express.Router();

module.exports = (pool) => {
  router.post('/', async (req, res) => {
    try {
      await pool.query('CALL simulation_cycle()');
      res.status(200).json({ message: 'Simulation step completed successfully!' });
    } catch (err) {
      console.error('Error running simulation cycle:', err.message);
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
