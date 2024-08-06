const express = require("express");
const router = express.Router();
const client = require("../../db");

router.get("/", async (req, res) => {
  try {
    const response = await client.query("SELECT * FROM books");
    const books = response.rows;
    res.json({ books: books });
  } catch (err) {
    console.log("Error:", err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const response = await client.query(
      `SELECT * FROM books WHERE id = ${req.params.id}`
    );
    const book = response.rows;
    res.json({ book: book });
  } catch (err) {
    console.log("Error:", err);
  }
});

module.exports = router;
