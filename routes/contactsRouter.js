const express = require('express');
const router = express.Router();
const db = require('../db');
const { validateJWT } = require('../middleware/middleware');

// Kişi oluşturma
router.post('/contacts',validateJWT, async (req, res) => {
  try {
    const { phone, companiy, full_name, comanda } = req.body;

    console.log(req.body);
    const query = `INSERT INTO contact (phone, companiy, full_name, comanda) 
                   VALUES ($1, $2, $3, $4) 
                   RETURNING *`;

    const values = [phone, companiy, full_name, comanda];

    const result = await db.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({ error: error.message });
  }
});

// Tüm kişileri getirme
router.get('/contacts', async (req, res) => {
  try {
    const query = 'SELECT * FROM contact';
    const result = await db.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ error: 'An error occurred while fetching contacts.' });
  }
});

// Kişi güncelleme
router.put('/contacts/:id',validateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const { phone, companiy, full_name, comanda } = req.body;

    const query = `UPDATE contact SET phone = $1, companiy = $2, full_name = $3, comanda = $4, 
                   time_update = current_timestamp WHERE id = $5 RETURNING *`;

    const values = [phone, companiy, full_name, comanda, id];

    const result = await db.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ error: 'An error occurred while updating the contact.' });
  }
});

// Kişi silme
router.delete('/contacts/:id',validateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'DELETE FROM contact WHERE id = $1';
    const result = await db.query(query, [id]);
    res.json({ message: 'Contact deleted successfully.' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ error: 'An error occurred while deleting the contact.' });
  }
});

module.exports = router;