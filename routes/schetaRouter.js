const express = require("express");
const { validateJWT } = require("../middleware/middleware");
const router = express.Router();
const pool = require("../db");

// CREATE - Yangi ma'lumot qo'shish
router.post("/schet", (req, res) => {
  const { user_id, date, status, type, price } = req.body;

  const query = `
      INSERT INTO schet (user_id, date, status, type, price)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
  const values = [user_id, date, status, type, price];

  pool
    .query(query, values)
    .then((result) => {
      res.status(201).json(result.rows[0]);
    })
    .catch((error) => {
      console.error("Error creating schet:", error);
      res
        .status(500)
        .json({ error: "An error occurred while creating the schet." });
    });
});

// READ - Barcha ma'lumotlarni olish
router.get("/schet", (req, res) => {
  const query = `SELECT * FROM schet`;

  pool
    .query(query)
    .then((result) => {
      res.status(200).json(result.rows);
    })
    .catch((error) => {
      console.error("Error fetching schet:", error);
      res
        .status(500)
        .json({ error: "An error occurred while fetching schet." });
    });
});

router.get("/schet/:id", (req, res) => {
  var id = req.params.id;
  // Ma'lumotlarni bazadan olish
  const query = `SELECT * FROM schet  WHERE user_id = $1`;

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
router.put("/schet/:id", validateJWT, (req, res) => {
  const { id } = req.params;
  const { user_id, date, status, type, price } = req.body;

  const query = `
    UPDATE schet
    SET user_id = $1, date = $2, status = $3, type = $4, price = $5, time_update = current_timestamp
    WHERE id = $5
  `;
  const values = [user_id, date, status, type, price, id];

  pool
    .query(query, values)
    .then(() => {
      res.status(200).json({ message: "schet updated successfully." });
    })
    .catch((error) => {
      console.error("Error updating schet:", error);
      res
        .status(500)
        .json({ error: "An error occurred while updating the schet." });
    });
});

// DELETE - Ma'lumotni o'chirish
router.delete("/schet/:id", validateJWT, (req, res) => {
  const { id } = req.params;

  const query = `DELETE FROM schet WHERE id = $1`;
  const values = [id];

  pool
    .query(query, values)
    .then(() => {
      res.status(200).json({ message: "schet deleted successfully." });
    })
    .catch((error) => {
      console.error("Error deleting schet:", error);
      res
        .status(500)
        .json({ error: "An error occurred while deleting the schet." });
    });
});

module.exports = router;
