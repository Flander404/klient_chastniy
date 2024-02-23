const express = require('express');
const pool = require('../db');
const { validateJWT } = require('../middleware/middleware');
const router = express.Router();

// CREATE - Yangi ma'lumot qo'shish
router.post('/ispolze',validateJWT, (req, res) => {
  const { isporitel_category, user_id, tip, status, nalogstatus, grajdanstvo, med_knishka, sprafka, proyekt, potpisdata } = req.body;

  const query = `
    INSERT INTO ispolze (isporitel_category, user_id, tip, status, nalogstatus, grajdanstvo, med_knishka, sprafka, proyekt, potpisdata)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *
  `;
  const values = [isporitel_category, user_id, tip, status, nalogstatus, grajdanstvo, med_knishka, sprafka, proyekt, potpisdata];

  pool.query(query, values)
    .then(result => {
      res.status(201).json(result.rows[0]);
    })
    .catch(error => {
      console.error('Error creating ispolze:', error);
      res.status(500).json({ error: 'An error occurred while creating the ispolze.' });
    });
});

// READ - Barcha ma'lumotlarni olish
router.get('/ispolze', (req, res) => {
  const query = `SELECT * FROM ispolze`;

  pool.query(query)
    .then(result => {
      res.status(200).json(result.rows);
    })
    .catch(error => {
      console.error('Error fetching ispolze:', error);
      res.status(500).json({ error: 'An error occurred while fetching ispolze.' });
    });
});

// UPDATE - Ma'lumotni yangilash
router.put('/ispolze/:id',validateJWT, (req, res) => {
  const { id } = req.params;
  const { isporitel_category, user_id, tip, status, nalogstatus, grajdanstvo, med_knishka, sprafka, proyekt, potpisdata } = req.body;

  const query = `
    UPDATE ispolze
    SET isporitel_category = $1, user_id = $2, tip = $3, status = $4, nalogstatus = $5, grajdanstvo = $6, med_knishka = $7, sprafka = $8, proyekt = $9, potpisdata = $10, time_update = current_timestamp
    WHERE id = $11
  `;
  const values = [isporitel_category, user_id, tip, status, nalogstatus, grajdanstvo, med_knishka, sprafka, proyekt, potpisdata, id];

  pool.query(query, values)
    .then(() => {
      res.status(200).json({ message: 'ispolze updated successfully.' });
    })
    .catch(error => {
      console.error('Error updating ispolze:', error);
      res.status(500).json({ error: 'An error occurred while updating the ispolze.' });
    });
});

// DELETE - Ma'lumotni o'chirish
router.delete('/ispolze/:id',validateJWT, (req, res) => {
  const { id } = req.params;

  const query = `DELETE FROM ispolze WHERE id = $1`;
  const values = [id];

  pool.query(query, values)
    .then(() => {
      res.status(200).json({ message: 'ispolze deleted successfully.' });
    })
    .catch(error => {
      console.error('Error deleting ispolze:', error);
      res.status(500).json({ error: 'An error occurred while deleting the ispolze.' });
    });
});

module.exports = router;