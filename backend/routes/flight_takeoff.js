const express = require('express');
const router = express.Router();

module.exports = (pool) => {
  router.post('/', async (req, res) => {
    const { flightID } = req.body;

    try {
      await pool.query(
        'CALL flight_takeoff(?)',
        [flightID]
      );

      res.status(200).json({ message: 'Flight takeoff processed successfully!' });
    } catch (err) {
      console.error('Error during flight takeoff:', err.message);
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
