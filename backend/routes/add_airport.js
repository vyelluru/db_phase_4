const express = require('express');
const router = express.Router();

module.exports = (pool) => {
  router.post('/', async (req, res) => {
    const {
      airportID,
      airport_name,
      city,
      state,
      country,
      locationID
    } = req.body;
    
    try {
      await pool.query(
        'CALL add_airport(?, ?, ?, ?, ?, ?)',
        [airportID, airport_name, city, state, country, locationID]
      );

      res.status(200).json({ message: 'Airport added successfully!' });
    } catch (err) {
      console.error('Error adding airport:', err.message);
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
