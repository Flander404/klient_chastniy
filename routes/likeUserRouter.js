const express = require('express');
const router = express.Router();
const pool = require('../db'); // PostgreSQL bog'lamini import qilingan fayl

// CREATE - Yaratish
router.post('/like_user', async (req, res) => {
  try {
    const { me_id, user_id } = req.body;
    const time_create = new Date();
    const time_update = new Date();

    const newlike_user = await pool.query(
      'INSERT INTO like_user (me_id, user_id, time_create, time_update) VALUES ($1, $2, $3, $4) RETURNING *',
      [me_id, user_id, time_create, time_update]
    );

    res.json(newlike_user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server xatosi');
  }
});

// READ - O'qish
router.get('/like_user', async (req, res) => {
  try {
    const alllike_users = await pool.query('SELECT * FROM like_user');
    res.json(alllike_users.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server xatosi');
  }
});
router.get('/like_user/:me_id', async (req, res) => {
    try {
      const { me_id } = req.params;
      const users = await pool.query('SELECT * FROM users');

      const like_user = await pool.query('SELECT * FROM like_user WHERE me_id = $1', [me_id]);
      if (like_user.rows.length === 0) {
        return res.status(404).json('like_user topilmadi');
      }
  for (let i = 0; i < like_user.rows.length; i++) {
  for (let j = 0; j < users.rows.length; j++) {
  if(like_user.rows[i].user_id==users.rows[j].id){
    like_user.rows[i].position=users.rows[j].position
    like_user.rows[i].inn=users.rows[j].inn
    like_user.rows[i].litso=users.rows[j].litso
    like_user.rows[i].image=users.rows[j].image
    like_user.rows[i].type=users.rows[j].type
    like_user.rows[i].lastname=users.rows[j].lastname
    like_user.rows[i].firstname=users.rows[j].firstname
    like_user.rows[i].name=users.rows[j].name
  }
  }
  }

      res.json(like_user.rows[0]);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server xatosi');
    }
  });

// UPDATE - Yangilash
router.put('/like_user/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { me_id, user_id } = req.body;
    const time_update = new Date();

    const updatelike_user = await pool.query(
      'UPDATE like_user SET me_id = $1, user_id = $2, time_update = $3 WHERE id = $4',
      [me_id, user_id, time_update, id]
    );

    res.json('Muvaffaqiyatli yangilandi');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server xatosi');
  }
});

// DELETE - O'chirish
router.delete('/like_user/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletelike_user = await pool.query('DELETE FROM like_user WHERE id = $1', [id]);

    res.json('Muvaffaqiyatli ochirildi');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server xatosi');
  }
});

module.exports = router;