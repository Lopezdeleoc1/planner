import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_URL = process.env.REACT_APP_API_URL;

function App() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");

  useEffect(() => {
    // Fetch expenses
    axios.get(`${API_URL}/api/expenses`)
      .then(res => setExpenses(res.data))
      .catch(err => console.error(err));

    // Fetch categories
    axios.get(`${API_URL}/api/categories`)
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name || !amount || parseFloat(amount) <= 0 || !categoryId) {
      alert("Please enter a valid name, amount, and category.");
      return;
    }

    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    const newExpense = {
      name,
      amount: parseFloat(amount),
      category_id: parseInt(categoryId),
      date: today
    };

    axios.post(`${API_URL}/api/expenses`, newExpense)
      .then(res => {
        // Append newly created expense (with id)
        setExpenses([...expenses, { id: res.data.id, ...newExpense, category: categories.find(c => c.id === parseInt(categoryId)).name }]);
        setName("");
        setAmount("");
        setCategoryId("");
      })
      .catch(err => console.error(err));
  };

  const handleDelete = (id) => {
    axios.delete(`${API_URL}/api/expenses/${id}`)
      .then(() => setExpenses(expenses.filter(e => e.id !== id)))
      .catch(err => console.error(err));
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
          onChange={e => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />
        <select value={categoryId} onChange={e => setCategoryId(e.target.value)}>
          <option value="">Select Category</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button type="submit">Add Expense</button>
      </form>

      <h3>Recent Expenses</h3>
      <ul>
        {expenses.slice(-5).reverse().map((e, idx) => (
          <li key={idx}>
            {e.name} - ${e.amount.toFixed(2)} ({e.category || "No category"}) - {e.date}
          </li>
        ))}
      </ul>

      <table className="expense-table">
        <thead>
          <tr>
            <th>Expense</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Date</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map(e => (
            <tr key={e.id} className="fade-in-row">
              <td>{e.name}</td>
              <td>${e.amount.toFixed(2)}</td>
              <td>{e.category || "No category"}</td>
              <td>{e.date}</td>
              <td>
                <button className="delete-button" onClick={() => handleDelete(e.id)}>Delete</button>
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
