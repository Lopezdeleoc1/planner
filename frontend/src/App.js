import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_URL = process.env.REACT_APP_API_URL; // Make sure this is set in your .env

function App() {
  const [expenses, setExpenses] = useState([]);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  // Fetch all expenses from backend
  useEffect(() => {
    axios.get(`${API_URL}/api/expenses`)
      .then((res) => setExpenses(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Add a new expense
  const handleAdd = (e) => {
    e.preventDefault();
    if (!name || !amount) return;

    const newExpense = { name, amount: parseFloat(amount) };
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

      <form onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="Expense Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <button type="submit">Add</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Expense</th>
            <th>Amount</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((e) => (
            <tr key={e.id} className="fade-in-row">
              <td>{e.name}</td>
              <td>${e.amount.toFixed(2)}</td>
              <td>
                <button onClick={() => handleDelete(e.id)}>Delete</button>
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
