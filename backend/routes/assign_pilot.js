const express = require('express');
const router = express.Router();

module.exports = (pool) => {
  router.post('/', async (req, res) => {
    const { flightID, personID } = req.body;

    try {
      await pool.query(
        'CALL assign_pilot(?, ?)',
        [flightID, personID]
      );

      res.status(200).json({ message: 'Pilot assigned successfully!' });
    } catch (err) {
      console.error('Error assigning pilot:', err.message);
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
