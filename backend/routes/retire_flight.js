const express = require('express');
const router = express.Router();

module.exports = (pool) => {
  router.post('/', async (req, res) => {
    const { flightID } = req.body;

    try {
      await pool.query(
        'CALL retire_flight(?)',
        [flightID]
      );

      res.status(200).json({ message: 'Flight retired successfully!' });
    } catch (err) {
      console.error('Error retiring flight:', err.message);
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
