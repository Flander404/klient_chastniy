const express = require('express');
const router = express.Router();
const db = require('../db');
const { validateJWT } = require('../middleware/middleware');

// Create a new record
router.post('/liso',validateJWT, async (req, res) => {
    try {
      const { title } = req.body;
  
      const query = 'INSERT INTO liso (title) VALUES ($1) RETURNING *';
      const values = [title];
  
      const result = await db.query(query, values);
      const createdRecord = result.rows[0];
  
      res.json(createdRecord);
    } catch (error) {
      console.error('Error creating record:', error);
      res.status(500).json({ error: 'An error occurred while creating the record.' });
    }
  });
  
  // Read records
  router.get('/liso', async (req, res) => { 
    try {
      const query = 'SELECT * FROM liso';
  
      const result = await db.query(query);
      const records = result.rows;
  
      res.json(records);
    } catch (error) {
      console.error('Error reading records:', error);
      res.status(500).json({ error: 'An error occurred while reading the records.' });
    }
  });
  
  // Update a record
  router.put('/liso/:id',validateJWT, async (req, res) => {
    try {
      const { id } = req.params;
      const { title } = req.body;
  
      const query = 'UPDATE liso SET title = $1, time_update = CURRENT_TIMESTAMP WHERE id = $2';
      const values = [title, id];
  
      const result = await db.query(query, values);
  
      if (result.rowCount > 0) {
        res.json({ message: 'Record updated successfully.' });
      } else {
        res.status(404).json({ error: 'Record with the specified ID not found.' });
      }
    } catch (error) {
      console.error('Error updating record:', error);
      res.status(500).json({ error: 'An error occurred while updating the record.' });
    }
  });
  
  // Delete a record
  router.delete('/liso/:id',validateJWT, async (req, res) => {
    try {
      const { id } = req.params;
  
      const query = 'DELETE FROM liso WHERE id = $1';
      const values = [id];
  
      const result = await db.query(query, values);
  
      if (result.rowCount > 0) {
        res.json({ message: 'Record deleted successfully.' });
      } else {
        res.status(404).json({ error: 'Record with the specified ID not found.' });
      }
    } catch (error) {
      console.error('Error deleting record:', error);
      res.status(500).json({ error: 'An error occurred while deleting the record.' });
    }
  });
  

module.exports = router;