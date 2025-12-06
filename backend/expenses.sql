
DROP TABLE IF EXISTS categories;

CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);


INSERT INTO categories (name) VALUES 
('Food'),
('Transportation'),
('Entertainment'),
('Bills'),
('Shopping');




DROP TABLE IF EXISTS expenses;

CREATE TABLE expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    amount REAL NOT NULL,
    category_id INTEGER,
    date TEXT NOT NULL DEFAULT (DATE('now')),
    FOREIGN KEY (category_id) REFERENCES categories(id)
);


INSERT INTO expenses (name, amount, category_id) VALUES
('Coffee', 4.50, 1),
('Gas', 35.00, 2),
('Movie Ticket', 14.00, 3),
('Electric Bill', 92.00, 4),
('T-Shirt', 22.00, 5);




-- 1. Basic SELECT 
SELECT  FROM expenses;


-- 2. JOIN Query
SELECT 
    expenses.id,
    expenses.name AS expense_name,
    expenses.amount,
    categories.name AS category
FROM expenses
JOIN categories ON expenses.category_id = categories.id;


-- 3. Aggregation Query 
SELECT 
    categories.name AS category,
    SUM(expenses.amount) AS total_spent
FROM expenses
JOIN categories ON expenses.category_id = categories.id
GROUP BY categories.name
ORDER BY total_spent DESC;
