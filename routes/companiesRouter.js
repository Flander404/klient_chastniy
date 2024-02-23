const express = require('express');
const router = express.Router();
const db = require('../db');
const { validateJWT } = require('../middleware/middleware');

// Şirket oluşturma
router.post('/companies',validateJWT, async (req, res) => {
  try {
    const { image, phone, instagram, facebook, twitter, youtube, email,address } = req.body;
console.log(req.body);
    const query = `INSERT INTO companiy (image, phone, instagram, facebook, twitter, youtube, email,address) 
                   VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
                   RETURNING *`;

    const values = [image, phone, instagram, facebook, twitter, youtube, email,address];

    const result = await db.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating company:', error);
    res.status(500).json({ error: 'An error occurred while creating the company.' });
  }
});

// Tüm şirketleri getirme
router.get('/companies', async (req, res) => {
  try {
    const query = 'SELECT * FROM companiy';
    const result = await db.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ error: 'An error occurred while fetching companies.' });
  }
});

// Şirket güncelleme
router.put('/companies/:id',validateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const { image, phone, instagram, facebook, twitter, youtube, email,address } = req.body;

    const query = `UPDATE companiy SET image = $1, phone = $2, instagram = $3, 
                   facebook = $4, twitter = $5, youtube = $6, email = $7, address=$8,
                   time_update = current_timestamp WHERE id = $9 RETURNING *`;

    const values = [image, phone, instagram, facebook, twitter, youtube, email,address, id];

    const result = await db.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating company:', error);
    res.status(500).json({ error: 'An error occurred while updating the company.' });
  }
});

// Şirket silme
router.delete('/companies/:id',validateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'DELETE FROM companiy WHERE id = $1';
    const result = await db.query(query, [id]);
    res.json({ message: 'Company deleted successfully.' });
  } catch (error) {
    console.error('Error deleting company:', error);
    res.status(500).json({ error: 'An error occurred while deleting the company.' });
  }
});

module.exports = router;