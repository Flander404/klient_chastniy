const express = require("express");
const { validateJWT } = require("../middleware/middleware");
const router = express.Router();
const pool = require("../db");

// CREATE - Yangi ma'lumot qo'shish
router.post("/akti", (req, res) => {
  const { user_id, psev } = req.body;

  const query = `
    INSERT INTO akti (user_id, psev)
    VALUES ($1, $2)
    RETURNING *
  `;
  const values = [user_id, psev];

  pool
    .query(query, values)
    .then((result) => {
      res.status(201).json(result.rows[0]);
    })
    .catch((error) => {
      console.error("Error creating akti:", error);
      res
        .status(500)
        .json({ error: "An error occurred while creating the akti." });
    });
});

// READ - Barcha ma'lumotlarni olish
router.get("/akti", (req, res) => {
  const query = `SELECT * FROM akti`;

  pool
    .query(query)
    .then((result) => {
      res.status(200).json(result.rows);
    })
    .catch((error) => {
      console.error("Error fetching akti:", error);
      res.status(500).json({ error: "An error occurred while fetching akti." });
    });
});
router.get("/akti/:id", (req, res) => {
  var id = req.params.id;
  // Ma'lumotlarni bazadan olish
  const query = `SELECT * FROM akti  WHERE user_id = $1`;

  pool
    .query(query, [id])
    .then((result) => {
      res.status(200).json(result.rows);
    })
    .catch((error) => {
      console.error("Error fetching documents:", error);
      res
        .status(500)
        .json({ error: "An error occurred while fetching documents." });
    });
});

// UPDATE - Ma'lumotni yangilash
router.put("/akti/:id", validateJWT, (req, res) => {
  const { id } = req.params;
  const { user_id, psev } = req.body;

  const query = `
    UPDATE akti
    SET user_id = $1, psev = $2, time_update = current_timestamp
    WHERE id = $5
  `;
  const values = [user_id, psev, id];

  pool
    .query(query, values)
    .then(() => {
      res.status(200).json({ message: "akti updated successfully." });
    })
    .catch((error) => {
      console.error("Error updating akti:", error);
      res
        .status(500)
        .json({ error: "An error occurred while updating the akti." });
    });
});

// DELETE - Ma'lumotni o'chirish
router.delete("/akti/:id", validateJWT, (req, res) => {
  const { id } = req.params;

  const query = `DELETE FROM akti WHERE id = $1`;
  const values = [id];

  pool
    .query(query, values)
    .then(() => {
      res.status(200).json({ message: "akti deleted successfully." });
    })
    .catch((error) => {
      console.error("Error deleting akti:", error);
      res
        .status(500)
        .json({ error: "An error occurred while deleting the akti." });
    });
});

module.exports = router;
