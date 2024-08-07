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

router.post("/", async (req, res) => {
  try {
    const { title, type, author, topic, publication_date, pages } = req.body;
    const query = `
      INSERT INTO books (title, type, author, topic, publication_date, pages)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;`;
    const response = await client.query(query, [
      title,
      type,
      author,
      topic,
      publication_date,
      pages,
    ]);
    const book = response.rows[0];
    res.status(201).json({ book: book });
  } catch (err) {
    console.log("Error:", err);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { title, type, author, topic, publication_date, pages } = req.body;
    const query = `
      UPDATE books
      SET title = $1,
          type = $2,
          author = $3,
          topic = $4,
          publication_date = $5,
          pages = $6
      WHERE id = $7;`;
    const values = [title, type, author, topic, publication_date, pages, id];
    await client.query(query, values);

    const selectQuery = `SELECT * FROM books WHERE id = ${id};`;
    const selectResult = await client.query(selectQuery);
    const book = selectResult.rows[0];

    res.status(200).send({ book: book });
  } catch (err) {
    console.log("Error:", err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const selectQuery = `SELECT * FROM books WHERE id = ${id};`;
    const selectResult = await client.query(selectQuery);
    const book = selectResult.rows[0];

    const query = `DELETE FROM books WHERE id = ${id};`;
    await client.query(query);
    res.status(200).send({ book: book });
  } catch (err) {
    console.log("Error:", err);
  }
});

module.exports = router;
