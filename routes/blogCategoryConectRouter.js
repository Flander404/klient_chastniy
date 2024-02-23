const express = require('express');
const router = express.Router();
const db = require('../db');
const { validateJWT } = require('../middleware/middleware');

// Blog kategori bağlantısı oluşturma
router.post('/blog-category-connections',validateJWT, async (req, res) => {
  try {
    const { blog_id, category_id } = req.body;

    const query = `INSERT INTO blog_category_connect (blog_id, category_id) 
                   VALUES ($1, $2) 
                   RETURNING *`;

    const values = [blog_id, category_id];

    const result = await db.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating blog category connection:', error);
    res.status(500).json({ error: 'An error occurred while creating the blog category connection.' });
  }
});

// Tüm blog kategori bağlantılarını getirme
router.get('/blog-category-connections', async (req, res) => {
  try {
    const query = 'SELECT * FROM blog_category_connect';
    const result = await db.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching blog category connections:', error);
    res.status(500).json({ error: 'An error occurred while fetching blog category connections.' });
  }
});

// Blog kategori bağlantısı güncelleme
router.put('/blog-category-connections/:id',validateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const { blog_id, category_id } = req.body;

    const query = `UPDATE blog_category_connect SET blog_id = $1, category_id = $2,
                   time_update = current_timestamp WHERE id = $3 RETURNING *`;

    const values = [blog_id, category_id, id];

    const result = await db.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating blog category connection:', error);
    res.status(500).json({ error: 'An error occurred while updating the blog category connection.' });
  }
});

// Blog kategori bağlantısı silme
router.delete('/blog-category-connections/:id',validateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'DELETE FROM blog_category_connect WHERE id = $1';
    const result = await db.query(query, [id]);
    res.json({ message: 'Blog category connection deleted successfully.' });
  } catch (error) {
    console.error('Error deleting blog category connection:', error);
    res.status(500).json({ error: 'An error occurred while deleting the blog category connection.' });
  }
});

module.exports = router;