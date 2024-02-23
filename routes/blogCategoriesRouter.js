const express = require('express');
const router = express.Router();
const db = require('../db');
const { validateJWT } = require('../middleware/middleware');

// Blog kategorisi oluşturma
router.post('/blog-categories',validateJWT, async (req, res) => {
  try {
    const { title } = req.body;

    const query = `INSERT INTO blog_category (title) 
                   VALUES ($1) 
                   RETURNING *`;

    const values = [title];

    const result = await db.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating blog category:', error);
    res.status(500).json({ error: 'An error occurred while creating the blog category.' });
  }
});

// Tüm blog kategorilerini getirme
router.get('/blog-categories', async (req, res) => {
  try {
    const query = 'SELECT * FROM blog_category';
    const result = await db.query(query);
    const query1 = 'SELECT * FROM blog_category_connect';
    const result1 = await db.query(query1);
    for (let i = 0; i < result.rows.length; i++) {
      result.rows[i].count=0
    for (let l = 0; l < result1.rows.length; l++) {
      if(result.rows[i].id===result1.rows[l].category_id){
        result.rows[i].count++
      }
    }
    }
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching blog categories:', error);
    res.status(500).json({ error: 'An error occurred while fetching blog categories.' });
  }
});

// Blog kategorisi güncelleme
router.put('/blog-categories/:id',validateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    const query = `UPDATE blog_category SET title = $1, 
                   time_update = current_timestamp WHERE id = $2 RETURNING *`;

    const values = [title, id];

    const result = await db.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating blog category:', error);
    res.status(500).json({ error: 'An error occurred while updating the blog category.' });
  }
});

// Blog kategorisi silme
router.delete('/blog-categories/:id',validateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'DELETE FROM blog_category WHERE id = $1';
    const result = await db.query(query, [id]);
    res.json({ message: 'Blog category deleted successfully.' });
  } catch (error) {
    console.error('Error deleting blog category:', error);
    res.status(500).json({ error: 'An error occurred while deleting the blog category.' });
  }
});

module.exports = router;