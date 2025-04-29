const express = require('express');
const router = express.Router();

module.exports = (pool) => {
  router.post('/', async (req, res) => {
    const { flightID } = req.body;

    try {
      await pool.query(
        'CALL passengers_disembark(?)',
        [flightID]
      );

      res.status(200).json({ message: 'Passengers disembarked successfully!' });
    } catch (err) {
      console.error('Error disembarking passengers:', err.message);
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
