const express = require('express');
const router = express.Router();

module.exports = (pool) => {
    router.post('/', async (req, res) => {
        const {
          airlineID,
          tail_num,
          seat_capacity,
          speed,
          locationID,
          plane_type,
          maintenanced,
          model,
          neo,
        } = req.body;
    
        try {

            await pool.query(
                'CALL add_airplane(?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [airlineID, tail_num, seat_capacity, speed, locationID, plane_type, maintenanced, model, neo]
              );
              
          
          res.status(200).json({ message: 'Airplane added successfully!' });
        } catch (err) {
          console.error('Error adding airplane:', err.message);
          res.status(500).json({ error: err.message });
        }
      });
    
      return router;
};