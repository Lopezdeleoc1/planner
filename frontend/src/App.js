import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_URL = process.env.REACT_APP_API_URL;

function App() {
  const [expenses, setExpenses] = useState([]);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  // Fetch all expenses
  useEffect(() => {
    axios.get(`${API_URL}/api/expenses`)
      .then((res) => setExpenses(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Add a new expense
  const handleAdd = (e) => {
    e.preventDefault();

    if (!name || !amount || parseFloat(amount) <= 0) {
      alert("Please enter a valid expense name and positive amount.");
      return;
    }

    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    const newExpense = {
      name,
      amount: parseFloat(amount),
      date: today
    };

    axios.post(`${API_URL}/api/expenses`, newExpense)
      .then((res) => {
        setExpenses([...expenses, { id: res.data.id, ...newExpense }]);
        setName("");
        setAmount("");
      })
      .catch((err) => console.error(err));
  };

  // Delete an expense
  const handleDelete = (id) => {
    axios.delete(`${API_URL}/api/expenses/${id}`)
      .then(() => setExpenses(expenses.filter((e) => e.id !== id)))
      .catch((err) => console.error(err));
  };

  const total = expenses.reduce((sum, e) => sum + (isNaN(e.amount) ? 0 : e.amount), 0);

  return (
    <div className="app-container">
      <h2>Spending Tracker</h2>

      <form onSubmit={handleAdd} className="expense-form">
        <input
          type="text"
          placeholder="Expense Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button type="submit">Add Expense</button>
      </form>

      <h3>Recent Expenses</h3>
      <ul>
        {expenses.slice(-5).reverse().map((e, idx) => (
          <li key={idx}>
            {e.name} - ${e.amount.toFixed(2)} ({e.date})
          </li>
        ))}
      </ul>

      <table className="expense-table">
        <thead>
          <tr>
            <th>Expense</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((e) => (
            <tr key={e.id} className="fade-in-row">
              <td>{e.name}</td>
              <td>${e.amount.toFixed(2)}</td>
              <td>{e.date}</td>
              <td>
                <button
                  onClick={() => handleDelete(e.id)}
                  className="delete-button"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Total: ${total.toFixed(2)}</h3>
    </div>
  );
}

export default App;
