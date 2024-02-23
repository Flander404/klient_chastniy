const express = require('express');
const pool = require('../db');
const { validateJWT } = require('../middleware/middleware');
const router = express.Router();

// CREATE - Yangi ma'lumot qo'shish
router.post('/hamkasb',validateJWT, (req, res) => {
  const { user_id, hamkasb_id } = req.body;

  const query = `
    INSERT INTO hamkasb (user_id, hamkasb_id)
    VALUES ($1, $2)
    RETURNING *
  `;
  const values = [user_id, hamkasb_id];

  pool.query(query, values)
    .then(result => {
      res.status(201).json(result.rows[0]);
    })
    .catch(error => {
      console.error('Error creating hamkasb:', error);
      res.status(500).json({ error: 'An error occurred while creating the hamkasb.' });
    });
});

// READ - Barcha ma'lumotlarni olish
router.get('/hamkasb', (req, res) => {
  const query = `SELECT * FROM hamkasb`;

  pool.query(query)
    .then(result => {
      res.status(200).json(result.rows);
    })
    .catch(error => {
      console.error('Error fetching hamkasb:', error);
      res.status(500).json({ error: 'An error occurred while fetching hamkasb.' });
    });
});

// UPDATE - Ma'lumotni yangilash
router.put('/hamkasb/:id',validateJWT, (req, res) => {
  const { id } = req.params;
  const { user_id, hamkasb_id } = req.body;

  const query = `
    UPDATE hamkasb
    SET user_id = $1, hamkasb_id = $2, time_update = current_timestamp
    WHERE id = $3
  `;
  const values = [user_id, hamkasb_id, id];

  pool.query(query, values)
    .then(() => {
      res.status(200).json({ message: 'hamkasb updated successfully.' });
    })
    .catch(error => {
      console.error('Error updating hamkasb:', error);
      res.status(500).json({ error: 'An error occurred while updating the hamkasb.' });
    });
});

// DELETE - Ma'lumotni o'chirish
router.delete('/hamkasb/:id',validateJWT, (req, res) => {
  const { id } = req.params;

  const query = `DELETE FROM hamkasb WHERE id = $1`;
  const values = [id];

  pool.query(query, values)
    .then(() => {
      res.status(200).json({ message: 'hamkasb deleted successfully.' });
    })
    .catch(error => {
      console.error('Error deleting hamkasb:', error);
      res.status(500).json({ error: 'An error occurred while deleting the hamkasb.' });
    });
});

module.exports = router;