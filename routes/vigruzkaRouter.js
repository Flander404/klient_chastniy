const express = require('express');
const pool = require('../db');
const router = express.Router();

// CREATE - Yangi ma'lumot qo'shish
router.post('/vigruzka', (req, res) => {
  const { user_id, perexot, tip, teg, status, file } = req.body;

  const query = `
    INSERT INTO vigruzka (user_id, perexot, tip, teg, status, file)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;
  const values = [user_id, perexot, tip, teg, status, file];

  pool.query(query, values)
    .then(result => {
      res.status(201).json(result.rows[0]);
    })
    .catch(error => {
      console.error('Error creating vigruzka:', error);
      res.status(500).json({ error: 'An error occurred while creating the vigruzka.' });
    });
});

// READ - Barcha ma'lumotlarni olish
router.get('/vigruzka', (req, res) => {
  const query = `SELECT * FROM vigruzka`;

  pool.query(query)
    .then(result => {
      res.status(200).json(result.rows);
    })
    .catch(error => {
      console.error('Error fetching vigruzka:', error);
      res.status(500).json({ error: 'An error occurred while fetching vigruzka.' });
    });
});

router.get("/vigruzka/:id", (req, res) => {
  var id = req.params.id;
  // Ma'lumotlarni bazadan olish
  const query = `SELECT * FROM vigruzka  WHERE user_id = $1`;

  pool
    .query(query, [id])
    .then((result) => {
      res.status(200).json(result.rows);
    })
    .catch((error) => {
      console.error("Error fetching documents:", error);
      res
        .status(500)
        .json({ error: "An error occurred while fetching documents." });
        document.querySelector('#tv1').value = ""
    });
});

// UPDATE - Ma'lumotni yangilash
router.put('/vigruzka/:id', (req, res) => {
  const { id } = req.params;
  const { user_id, perexot, tip, teg, status, file } = req.body;

  const query = `
    UPDATE vigruzka
    SET user_id = $1, perexot = $2, tip = $3, teg = $4, status = $5, file = $6, time_update = current_timestamp
    WHERE id = $7
  `;
  const values = [user_id, perexot, tip, teg, status, file, id];

  pool.query(query, values)
    .then(() => {
      res.status(200).json({ message: 'vigruzka updated successfully.' });
    })
    .catch(error => {
      console.error('Error updating vigruzka:', error);
      res.status(500).json({ error: 'An error occurred while updating the vigruzka.' });
    });
});

// DELETE - Ma'lumotni o'chirish
router.delete('/vigruzka/:id', (req, res) => {
  const { id } = req.params;

  const query = `DELETE FROM vigruzka WHERE id = $1`;
  const values = [id];

  pool.query(query, values)
    .then(() => {
      res.status(200).json({ message: 'vigruzka deleted successfully.' });
    })
    .catch(error => {
      console.error('Error deleting vigruzka:', error);
      res.status(500).json({ error: 'An error occurred while deleting the vigruzka.' });
    });
});

module.exports = router;