A simple full-stack Spending Tracker built with:

React (frontend):
SQLite relational database
REST API
Deployed on Render

Front end (react):
Clean, responsive interface
Add new transactions (description, amount, category, date)
List of all expenses
Automatically updates UI without page refresh
Basic input validation
Table + List + Form included (assignment requirement)
CSS Grid layout
Fade-in animation

Backend:
REST API with the following routes:
GET /expenses – fetch all expenses
POST /expenses – add a new expense
Handles JSON requests
Connected to SQLite relational database

Database design:
Entities and Relationships

Users
-----
user_id (PK)
name

Expenses
--------
expense_id (PK)
user_id (FK -> Users.user_id)
description
amount
category
date

**Relationship:** One User can have many Expenses (1-to-many)

Diagram:
┌──────────────┐            ┌─────────────────┐
│   users       │ 1       ∞ │    expenses     │
├──────────────┤────────────┤─────────────────┤
│ user_id (PK) │◀───────────│ user_id (FK)    │
│ name         │            │ description     │
└──────────────┘            │ amount          │
                            │ category        │
                            │ date            │
                            └─────────────────┘

