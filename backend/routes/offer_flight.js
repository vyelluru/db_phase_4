const express = require('express');
const router = express.Router();

module.exports = (pool) => {
  router.post('/', async (req, res) => {
    const {
      flightID,
      routeID,
      support_airline,
      support_tail,
      progress,
      next_time,
      cost
    } = req.body;

    try {
      await pool.query(
        'CALL offer_flight(?, ?, ?, ?, ?, ?, ?)',
        [
          flightID,
          routeID,
          support_airline !== '' ? support_airline : null,
          support_tail !== '' ? support_tail : null,
          progress,
          next_time,
          cost
        ]
      );

      res.status(200).json({ message: 'Flight offered successfully!' });
    } catch (err) {
      console.error('Error offering flight:', err.message);
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
