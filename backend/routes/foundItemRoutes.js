const express = require("express");
const router = express.Router();
const db = require("../config/database");

router.get("/", (req, res) => {
  const { keyword = "", category = "" } = req.query;

  let sql = `
    SELECT 
      r.id,
      r.item_name,
      r.description,
      r.location,
      r.date_event,
      c.name AS category_name
    FROM reports r
    LEFT JOIN categories c ON r.category_id = c.id
    WHERE r.type = 'found'
  `;

  const params = [];

  if (keyword) {
    sql += " AND r.item_name LIKE ?";
    params.push(`%${keyword}%`);
  }

  if (category) {
    sql += " AND r.category_id = ?";
    params.push(category);
  }

  sql += " ORDER BY r.date_event DESC";

  db.query(sql, params, (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json(err);
    }
    res.json(rows);
  });
});

module.exports = router;
