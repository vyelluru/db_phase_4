const express = require('express');
const router = express.Router();

module.exports = (pool) => {
  router.post('/', async (req, res) => {
    const { flightID } = req.body;

    try {
      await pool.query(
        'CALL flight_landing(?)',
        [flightID]
      );

      res.status(200).json({ message: 'Flight landed successfully!' });
    } catch (err) {
      console.error('Error landing flight:', err.message);
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
