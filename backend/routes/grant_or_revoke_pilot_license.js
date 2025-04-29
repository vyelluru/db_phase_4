const express = require('express');
const router = express.Router();

module.exports = (pool) => {
  router.post('/', async (req, res) => {
    const { personID, license } = req.body;

    try {
      await pool.query(
        'CALL grant_or_revoke_pilot_license(?, ?)',
        [personID, license]
      );

      res.status(200).json({ message: 'License granted or revoked successfully!' });
    } catch (err) {
      console.error('Error granting or revoking license:', err.message);
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
