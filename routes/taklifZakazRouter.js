const express = require("express");
const router = express.Router();
const pool = require("../db.js");

// Taklif zakazlarını getirme (Read)
router.get("/taklif_zakaz", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM taklif_zakaz");
    res.json(result.rows);
  } catch (error) {
    console.error("taklif_zakaz SELECT hatası:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.get("/taklif_zakaz/:id", async (req, res) => {
  var id = req.params.id;
  // Ma'lumotlarni bazadan olish
  const query = `SELECT * FROM taklif_zakaz  WHERE my_id = $1`;

  pool
    .query(query, [id])
    .then((result) => {
      res.status(200).json(result.rows);
    })
    .catch((error) => {
      console.error("Error fetching zakaz:", error);
      res
        .status(500)
        .json({ error: "An error occurred while fetching zakaz." });
    });
});

// Taklif zakaz ekleme (Create)
router.post("/taklif_zakaz", async (req, res) => {
  const { title, message, zakaz_id, user_id, my_id } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO taklif_zakaz (title, message, zakaz_id, user_id, my_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [title, message, zakaz_id, user_id, my_id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error("taklif_zakaz INSERT hatası:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Taklif zakaz güncelleme (Update)
router.put("/taklif_zakaz/:id", async (req, res) => {
  const id = req.params.id;
  const { title, message, zakaz_id, user_id, my_id } = req.body;
  try {
    const result = await pool.query(
      "UPDATE taklif_zakaz SET title = $1, message = $2, zakaz_id = $3, user_id = $4, my_id = $5, time_update = current_timestamp WHERE id = $6 RETURNING *",
      [title, message, zakaz_id, user_id, my_id, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error("taklif_zakaz UPDATE hatası:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Taklif zakaz silme (Delete)
router.delete("/taklif_zakaz/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await pool.query("DELETE FROM taklif_zakaz WHERE id = $1", [id]);
    res.json({ message: "Taklif zakaz silindi" });
  } catch (error) {
    console.error("taklif_zakaz DELETE hatası:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
module.exports = router;
