const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize SQLite Database
const db = new sqlite3.Database("./church_event.db", (err) => {
  if (err) console.error("Error connecting to SQLite database:", err.message);
  else console.log("Connected to SQLite database");
});

// Create tables if they don't exist
db.serialize(() => {
  // Event Details
  db.run(`
    CREATE TABLE IF NOT EXISTS Event (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      date TEXT,
      startTime TEXT,
      endTime TEXT,
      theme TEXT,
      location TEXT
    )
  `);

  // Food Planner
  db.run(`
    CREATE TABLE IF NOT EXISTS FoodItem (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      quantity INTEGER,
      cost REAL
    )
  `);

  // Budgeting Tool
  db.run(`
    CREATE TABLE IF NOT EXISTS BudgetItem (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      amount REAL
    )
  `);

  // Notes
  db.run(`
    CREATE TABLE IF NOT EXISTS Note (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      description TEXT
    )
  `);

  // Event Scheduler
  db.run(`
    CREATE TABLE IF NOT EXISTS Activity (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      description TEXT,
      startTime TEXT,
      endTime TEXT
    )
  `);
});

// ======================== API Endpoints ========================

// -------- Event --------
app.get("/api/event", (req, res) => {
  db.get("SELECT * FROM Event ORDER BY id DESC LIMIT 1", (err, row) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(row || {});
  });
});

app.post("/api/event", (req, res) => {
  const { name, date, startTime, endTime, theme, location } = req.body;
  db.run(
    `INSERT INTO Event (name, date, startTime, endTime, theme, location)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [name, date, startTime, endTime, theme, location],
    function (err) {
      if (err) res.status(500).json({ error: err.message });
      else res.json({ id: this.lastID });
    }
  );
});

// -------- Food Planner --------
app.get("/api/food", (req, res) => {
  db.all("SELECT * FROM FoodItem", (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

app.post("/api/food", (req, res) => {
  const { name, quantity, cost } = req.body;
  db.run(
    "INSERT INTO FoodItem (name, quantity, cost) VALUES (?, ?, ?)",
    [name, quantity, cost],
    function (err) {
      if (err) res.status(500).json({ error: err.message });
      else res.json({ id: this.lastID });
    }
  );
});

app.delete("/api/food/:id", (req, res) => {
  const id = req.params.id;
  db.run("DELETE FROM FoodItem WHERE id = ?", [id], function (err) {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ success: true });
  });
});

// -------- Budgeting Tool --------
app.get("/api/budget", (req, res) => {
  db.all("SELECT * FROM BudgetItem", (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

app.post("/api/budget", (req, res) => {
  const { name, amount } = req.body;
  db.run(
    "INSERT INTO BudgetItem (name, amount) VALUES (?, ?)",
    [name, amount],
    function (err) {
      if (err) res.status(500).json({ error: err.message });
      else res.json({ id: this.lastID });
    }
  );
});

app.delete("/api/budget/:id", (req, res) => {
  const id = req.params.id;
  db.run("DELETE FROM BudgetItem WHERE id = ?", [id], function (err) {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ success: true });
  });
});

// -------- Notes --------
app.get("/api/notes", (req, res) => {
  db.all("SELECT * FROM Note", (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

app.post("/api/note", (req, res) => {
  const { title, description } = req.body;
  db.run(
    "INSERT INTO Note (title, description) VALUES (?, ?)",
    [title, description],
    function (err) {
      if (err) res.status(500).json({ error: err.message });
      else res.json({ id: this.lastID });
    }
  );
});

app.delete("/api/note/:id", (req, res) => {
  const id = req.params.id;
  db.run("DELETE FROM Note WHERE id = ?", [id], function (err) {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ success: true });
  });
});

// -------- Event Scheduler (Activities) --------
app.get("/api/activities", (req, res) => {
  db.all("SELECT * FROM Activity", (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

app.post("/api/activity", (req, res) => {
  const { title, description, startTime, endTime } = req.body;
  db.run(
    "INSERT INTO Activity (title, description, startTime, endTime) VALUES (?, ?, ?, ?)",
    [title, description, startTime, endTime],
    function (err) {
      if (err) res.status(500).json({ error: err.message });
      else res.json({ id: this.lastID });
    }
  );
});

app.delete("/api/activity/:id", (req, res) => {
  const id = req.params.id;
  db.run("DELETE FROM Activity WHERE id = ?", [id], function (err) {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ success: true });
  });
});

// ------------------------------
// Start server
// ------------------------------
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
