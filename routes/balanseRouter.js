const express = require('express');
const pool = require('../db');
const { validateJWT } = require('../middleware/middleware');
const router = express.Router();

// CREATE - Yangi ma'lumot qo'shish
router.post('/balanse', (req, res) => {
  const { user_id, tip, status } = req.body;

  const query = `
    INSERT INTO balanse (user_id, tip, status)
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  const values = [user_id, tip, status];

  pool.query(query, values)
    .then(result => {
      res.status(201).json(result.rows[0]);
    })
    .catch(error => {
      console.error('Error creating balanse:', error);
      res.status(500).json({ error: 'An error occurred while creating the balanse.' });
    });
});

// READ - Barcha ma'lumotlarni olish
router.get('/balanse', (req, res) => {
  const query = `SELECT * FROM balanse`;

  pool.query(query)
    .then(result => {
      res.status(200).json(result.rows);
    })
    .catch(error => {
      console.error('Error fetching balanse:', error);
      res.status(500).json({ error: 'An error occurred while fetching balanse.' });
    });
});

router.get("/balanse/:id", (req, res) => {
  var id = req.params.id;
  // Ma'lumotlarni bazadan olish
  const query = `SELECT * FROM balanse  WHERE user_id = $1`;

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
    });
});

// UPDATE - Ma'lumotni yangilash
router.put('/balanse/:id',validateJWT, (req, res) => {
  const { id } = req.params;
  const { user_id, tip, status } = req.body;

  const query = `
    UPDATE balanse
    SET user_id = $1, tip = $2, status = $3, time_update = current_timestamp
    WHERE id = $4
  `;
  const values = [user_id, tip, status, id];

  pool.query(query, values)
    .then(() => {
      res.status(200).json({ message: 'balanse updated successfully.' });
    })
    .catch(error => {
      console.error('Error updating balanse:', error);
      res.status(500).json({ error: 'An error occurred while updating the balanse.' });
    });
});

// DELETE - Ma'lumotni o'chirish
router.delete('/balanse/:id',validateJWT, (req, res) => {
  const { id } = req.params;

  const query = `DELETE FROM balanse WHERE id = $1`;
  const values = [id];

  pool.query(query, values)
    .then(() => {
      res.status(200).json({ message: 'balanse deleted successfully.' });
    })
    .catch(error => {
      console.error('Error deleting balanse:', error);
      res.status(500).json({ error: 'An error occurred while deleting the balanse.' });
    });
});

module.exports = router;