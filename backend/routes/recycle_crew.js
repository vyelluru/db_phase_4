const express = require('express');
const router = express.Router();

module.exports = (pool) => {
  router.post('/', async (req, res) => {
    const { flightID } = req.body;

    try {
      await pool.query(
        'CALL recycle_crew(?)',
        [flightID]
      );

      res.status(200).json({ message: 'Crew recycled successfully!' });
    } catch (err) {
      console.error('Error recycling crew:', err.message);
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
