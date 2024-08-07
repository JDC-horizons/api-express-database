const express = require("express");
const router = express.Router();
const client = require("../../db");

router.get("/", async (req, res) => {
  try {
    const response = await client.query("SELECT * FROM pets");
    const pets = response.rows;
    res.json({ pets: pets });
  } catch (err) {
    console.log("Error:", err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const response = await client.query(
      `SELECT * FROM pets WHERE id = ${req.params.id}`
    );
    const pet = response.rows;
    res.json({ pet: pet });
  } catch (err) {
    console.log("Error:", err);
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, age, type, breed, has_microchip } = req.body;
    const query = `
      INSERT INTO pets (name, age, type, breed, has_microchip)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;`;
    const response = await client.query(query, [
      name,
      age,
      type,
      breed,
      has_microchip,
    ]);
    const pet = response.rows[0];
    res.status(201).json({ pet: pet });
  } catch (err) {
    console.log("Error:", err);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { name, age, type, breed, has_microchip } = req.body;
    const query = `
      UPDATE pets
      SET name = $1,
          age = $2,
          type = $3,
          breed = $4,
          has_microchip = $5
      WHERE id = $6;`;
    const values = [name, age, type, breed, has_microchip, id];
    await client.query(query, values);

    const selectQuery = `SELECT * FROM pets WHERE id = ${id};`;
    const selectResult = await client.query(selectQuery);
    const pet = selectResult.rows[0];

    res.status(200).send({ pet: pet });
  } catch (err) {
    console.log("Error:", err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const selectQuery = `SELECT * FROM pets WHERE id = ${id};`;
    const selectResult = await client.query(selectQuery);
    const pet = selectResult.rows[0];

    const query = `DELETE FROM pets WHERE id = ${id};`;
    await client.query(query);
    res.status(200).send({ pet: pet });
  } catch (err) {
    console.log("Error:", err);
  }
});

module.exports = router;
