const express = require('express');
const router = express.Router();

module.exports = (pool) => {
  router.post('/', async (req, res) => {
    const { flightID } = req.body;

    try {
      await pool.query(
        'CALL passengers_board(?)',
        [flightID]
      );

      res.status(200).json({ message: 'Passengers boarded successfully!' });
    } catch (err) {
      console.error('Error boarding passengers:', err.message);
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
