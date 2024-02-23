const express = require('express');
const router = express.Router();
const db = require('../db');
const { validateJWT } = require('../middleware/middleware');

// Blogs oluşturma
router.post('/blogs',validateJWT, async (req, res) => {
  try {
    const { title } = req.body;

    const query = `INSERT INTO blogs (title) 
                   VALUES ($1) 
                   RETURNING *`;

    const values = [title];

    const result = await db.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({ error: 'An error occurred while creating the blog.' });
  }
});

// Tüm blogları getirme
router.get('/blogs', async (req, res) => {
  var senddata=[]
  try {
    const query = 'SELECT * FROM blogs';
    const result = await db.query(query);
    const query1 = 'SELECT * FROM blog_category';
    const result1 = await db.query(query1);
    const query2 = 'SELECT * FROM blog_category_connect';
    const result2 = await db.query(query2);
    if(req.query && req.query.id && req.query.id!=0){
      for (let i = 0; i < result2.rows.length; i++) {
        for (let j = 0; j <result1.rows.length; j++) {
        if(result2.rows[i].category_id==result1.rows[j].id){
         result2.rows[i].title=result1.rows[j].title
        }
        }}
    for (let i = 0; i < result.rows.length; i++) {
    result.rows[i].hash=[]
     for (let j = 0; j < result2.rows.length; j++) {
    if(result.rows[i].id==result2.rows[j].blog_id){
     result.rows[i].hash.push(result2.rows[j])
    }
    }
   }
   senddata=[]
for (let i = 0; i < result.rows.length; i++) {
 for (let j = 0; j < result.rows[i].hash.length; j++) {
 if(result.rows[i].hash[j].category_id==req.query.id){
senddata.push(result.rows[i])
 }
 }
}
    }else{
for (let i = 0; i < result2.rows.length; i++) {
     for (let j = 0; j <result1.rows.length; j++) {
     if(result2.rows[i].category_id==result1.rows[j].id){
      result2.rows[i].title=result1.rows[j].title
     }
     }}
 for (let i = 0; i < result.rows.length; i++) {
 result.rows[i].hash=[]
  for (let j = 0; j < result2.rows.length; j++) {
 if(result.rows[i].id==result2.rows[j].blog_id){
  result.rows[i].hash.push(result2.rows[j])
 }
 }
}

senddata=result.rows
    }

    res.json(senddata);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ error: 'An error occurred while fetching blogs.' });
  }
});

// Blogs güncelleme
router.put('/blogs/:id',validateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    const query = `UPDATE blogs SET title = $1, 
                   time_update = current_timestamp WHERE id = $2 RETURNING *`;

    const values = [title, id];

    const result = await db.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({ error: 'An error occurred while updating the blog.' });
  }
});

// Blogs silme
router.delete('/blogs/:id',validateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'DELETE FROM blogs WHERE id = $1';
    const result = await db.query(query, [id]);
    res.json({ message: 'Blogs deleted successfully.' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ error: 'An error occurred while deleting the blog.' });
  }
});

module.exports = router;