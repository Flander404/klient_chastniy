const express = require("express");
const router = express.Router();
const pool = require("../db");
const jwt = require("jsonwebtoken");
const { validateJWT } = require("../middleware/middleware");
const { generateVerificationCode } = require("../middleware/file_upload");

// Kullanıcı oluşturma
router.post("/users", validateJWT, async (req, res) => {
  try {
    const {
      phone,
      position,
      inn,
      litso,
      image,
      type,
      email,
      nomer_registratsiya,
      lastname,
      firstname,
      name,
      super_admin,
    } = req.body;

    const query = `INSERT INTO users (phone, position, inn, litso, image, type, nomer_registratsiya, lastname, firstname, name, email, super_admin) 
                   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
                   RETURNING *`;

    const values = [
      phone,
      position,
      inn,
      litso,
      image,
      type,
      email,
      nomer_registratsiya,
      lastname,
      firstname,
      name,
      super_admin,
    ];

    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating user:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the user." });
  }
});
router.get("/search/:me_id", async (req, res) => {
  try {
    const { me_id } = req.params;
    const users = await pool.query("SELECT * FROM users");
    const ban = await pool.query("SELECT * FROM ban WHERE user_id = $1", [
      me_id,
    ]);

    var send_data = [];
    for (let i = 0; i < users.rows.length; i++) {
      users.rows[i].push = true;
      for (let j = 0; j < ban.rows.length; j++) {
        if (users.rows[i].id == ban.rows[j].me_id) {
          users.rows[i].push = true;
        }
      }
      if (users.rows[i].push) {
        send_data.push(users.rows[i]);
      }
    }

    res.json(send_data);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server xatosi");
  }
});

// Tüm kullanıcıları getirme
router.get("/users", async (req, res) => {
  try {
    const query = "SELECT * FROM users";
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "An error occurred while fetching users." });
  }
});

// Kullanıcı güncelleme
router.put("/users/:id", validateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      phone,
      position,
      inn,
      litso,
      image,
      type,
      nomer_registratsiya,
      lastname,
      firstname,
      name,
      email,
      super_admin,
    } = req.body;

    const query = `UPDATE users SET phone = $1, position = $2, inn = $3, litso = $4, image = $5, type = $6, 
                   nomer_registratsiya = $7, lastname = $8, firstname = $9, name = $10, email = $11, super_admin = $12, 
                   time_update = current_timestamp WHERE id = $12 RETURNING *`;

    const values = [
      phone,
      position,
      inn,
      litso,
      image,
      type,
      nomer_registratsiya,
      lastname,
      firstname,
      name,
      email,
      super_admin,
      id,
    ];

    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating user:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the user." });
  }
});

// Kullanıcı silme
router.delete("/users/:id", validateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const query = "DELETE FROM users WHERE id = $1";
    const result = await pool.query(query, [id]);
    res.json({ message: "User deleted successfully." });
  } catch (error) {
    console.error("Error deleting user:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the user." });
  }
});

router.get("/verify", async (req, res) => {
  try {
    const query = "SELECT * FROM verify";
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching verify:", error);
    res.status(500).json({ error: "An error occurred while fetching verify." });
  }
});

// Telefon numarası doğrulama kodu oluşturma ve kaydetme
router.post("/verify", async (req, res) => {
  const { phone } = req.body;

  try {
    const code = generateVerificationCode();
    const query2 = "SELECT * FROM verify WHERE phone = $1";
    const values2 = [phone];
    const result2 = await pool.query(query2, values2);
    if (result2.rows.length == 0) {
      const query =
        "INSERT INTO verify (phone, code) VALUES ($1, $2) RETURNING id";
      const values = [phone, code];
      const result = await pool.query(query, values);
      res.status(201).json({ id: result.rows[0].id, code });
    } else {
      const query3 = `UPDATE verify SET code = $1,
  time_update = current_timestamp WHERE id = $2 RETURNING *`;
      console.log(result2.rows[0]);
      const values3 = [code, result2.rows[0].id];

      const result3 = await pool.query(query3, values3);
      res.status(201).json({ id: result2.rows[0].id, code });
    }
  } catch (error) {
    console.error("Hata:", error);
    res.status(500).json({ error: "Bir hata oluştu" });
  }
});
router.post("/verify2", async (req, res) => {
  const { phone } = req.body;

  try {
    const code = generateVerificationCode();
    const query2 = "SELECT * FROM users WHERE phone = $1";
    const values2 = [phone];
    const result2 = await pool.query(query2, values2);
    if (result2.rows.length == 0) {
      res.status(201).send("user topilmadi");
    } else {
      res.status(200).send("succsess");
    }
  } catch (error) {
    console.error("Hata:", error);
    res.status(500).json({ error: "Bir hata oluştu" });
  }
});
router.post("/verify/check", async (req, res) => {
  const { phone, code } = req.body;
  try {
    const query = "SELECT * FROM verify WHERE phone = $1 AND code = $2";
    const values = [phone, code];
    const result = await pool.query(query, values);
    if (result.rows.length > 0) {
      // Doğrulama kodu doğru
      const token = jwt.sign({ phone }, "secretKey"); // Token oluşturma
      const query1 = "SELECT * FROM users WHERE phone = $1";
      const values1 = [phone];
      const result1 = await pool.query(query1, values1);
      if (result1.rows.length > 0) {
        res.json({ valid: true, token, user: result1.rows });
      } else {
        res.json({ valid: true, token });
      }
    } else {
      // Doğrulama kodu yanlış veya eşleşen bir kayıt bulunamadı
      res.json({ valid: false });
    }
  } catch (error) {
    console.error("Hata:", error);
    res.status(500).json({ error: "Bir hata oluştu" });
  }
});
module.exports = router;
