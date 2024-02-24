

const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const { upload_file } = require('../middleware/file_upload');


// CREATE - Yeni bir kayıt oluşturma
router.post('/zakaz', async (req, res) => {
  try {

    const { title, type, address, description, creator } = req.body;
    var file=upload_file(req)
    const query = `INSERT INTO zakaz (title, type, address, description, file, creator)
                   VALUES ($1, $2, $3, $4, $5, $6)
                   RETURNING *`;
    const values = [title, type, address, description, file, creator];
    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// READ - Tüm kayıtları getirme
router.get('/zakaz', async (req, res) => {
  try {
    const query = `SELECT * FROM zakaz`;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// UPDATE - Kaydı güncelleme
router.put('/zakaz/:id', async (req, res) => {
  try {
    const { id } = req.params;

    
    const { title, type, address, description, file, creator } = req.body;
    const query = `UPDATE zakaz
                   SET title = $1, type = $2, address = $3, description = $4, file = $5, creator = $6, time_update = current_timestamp
                   WHERE id = $7
                   RETURNING *`;
    const values = [title, type, address, description, file, creator, id];
    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// DELETE - Kaydı silme
router.delete('/zakaz/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = `DELETE FROM zakaz WHERE id = $1`;
    const values = [id];
    await pool.query(query, values);
    res.json({ message: 'Record deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Server'ı dinlemeye başlama
module.exports=router