// index.js
const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database
const db = new sqlite3.Database("./expenses.db", (err) => {
  if (err) console.error(err.message);
  else console.log("Connected to SQLite database.");
});

// ===== CREATE TABLES IF NOT EXISTS =====
db.run(`
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
)
`);

db.run(`
CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    amount REAL NOT NULL,
    category_id INTEGER,
    date TEXT NOT NULL DEFAULT (DATE('now')),
    FOREIGN KEY (category_id) REFERENCES categories(id)
)
`);

// ===== ROUTES =====

// Get all categories
app.get("/api/categories", (req, res) => {
  db.all("SELECT * FROM categories", [], (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

// Get all expenses
app.get("/api/expenses", (req, res) => {
  db.all(
    `SELECT expenses.id, expenses.name, expenses.amount, expenses.date,
            categories.name AS category
     FROM expenses
     LEFT JOIN categories ON expenses.category_id = categories.id
     ORDER BY date DESC`,
    [],
    (err, rows) => {
      if (err) res.status(500).json({ error: err.message });
      else res.json(rows);
    }
  );
});

// Add new expense
app.post("/api/expenses", (req, res) => {
  const { name, amount, category_id, date } = req.body;

  if (!name || amount === undefined) {
    return res.status(400).json({ error: "Name and amount are required" });
  }

  const finalDate = date ? date : new Date().toISOString().split("T")[0];

  const sql =
    "INSERT INTO expenses (name, amount, category_id, date) VALUES (?, ?, ?, ?)";

  db.run(sql, [name, amount, category_id || null, finalDate], function (err) {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ id: this.lastID });
  });
});

// Delete expense by ID
app.delete("/api/expenses/:id", (req, res) => {
  db.run("DELETE FROM expenses WHERE id = ?", [req.params.id], function (err) {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ deletedID: req.params.id });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
