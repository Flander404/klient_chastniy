const express = require('express');
const router = express.Router();
const pool = require('../db'); // PostgreSQL bog'lamini import qilingan fayl

// CREATE - Yaratish
router.post('/ban', async (req, res) => {
  try {
    const { me_id, user_id } = req.body;
    const time_create = new Date();
    const time_update = new Date();

    const newban = await pool.query(
      'INSERT INTO ban (me_id, user_id, time_create, time_update) VALUES ($1, $2, $3, $4) RETURNING *',
      [me_id, user_id, time_create, time_update]
    );

    res.json(newban.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server xatosi');
  }
});

// READ - O'qish
router.get('/ban', async (req, res) => {
  try {
    const allbans = await pool.query('SELECT * FROM ban');
    res.json(allbans.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server xatosi');
  }
});
router.get('/ban/:me_id', async (req, res) => {
    try {
      const { me_id } = req.params;
      const users = await pool.query('SELECT * FROM users');

      const ban = await pool.query('SELECT * FROM ban WHERE me_id = $1', [me_id]);
      if (ban.rows.length === 0) {
        return res.status(404).json('ban topilmadi');
      }
  for (let i = 0; i < ban.rows.length; i++) {
  for (let j = 0; j < users.rows.length; j++) {
  if(ban.rows[i].user_id==users.rows[j].id){
    ban.rows[i].position=users.rows[j].position
    ban.rows[i].inn=users.rows[j].inn
    ban.rows[i].litso=users.rows[j].litso
    ban.rows[i].image=users.rows[j].image
    ban.rows[i].type=users.rows[j].type
    ban.rows[i].lastname=users.rows[j].lastname
    ban.rows[i].firstname=users.rows[j].firstname
    ban.rows[i].name=users.rows[j].name
  }
  }
  }

      res.json(ban.rows[0]);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server xatosi');
    }
  });

// UPDATE - Yangilash
router.put('/ban/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { me_id, user_id } = req.body;
    const time_update = new Date();

    const updateban = await pool.query(
      'UPDATE ban SET me_id = $1, user_id = $2, time_update = $3 WHERE id = $4',
      [me_id, user_id, time_update, id]
    );

    res.json('Muvaffaqiyatli yangilandi');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server xatosi');
  }
});

// DELETE - O'chirish
router.delete('/ban/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deleteban = await pool.query('DELETE FROM ban WHERE id = $1', [id]);

    res.json('Muvaffaqiyatli ochirildi');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server xatosi');
  }
});

module.exports = router;