const express = require('express');
const router = express.Router();

module.exports = (pool) => {
  router.post('/', async (req, res) => {
    const {
      personID,
      first_name,
      last_name,
      locationID,
      taxID,
      experience,
      miles,
      funds
    } = req.body;
    try {
      await pool.query(
        'CALL add_person(?, ?, ?, ?, ?, ?, ?, ?)',
        [
          personID,
          first_name,
          last_name,
          locationID,
          taxID !== '' ? taxID : null,
          experience !== null ? experience : null,
          miles !== null ? miles : null,
          funds !== null ? funds : null
        ]
      );

      res.status(200).json({ message: 'Person added successfully!' });
    } catch (err) {
      console.error('Error adding person:', err.message);
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
