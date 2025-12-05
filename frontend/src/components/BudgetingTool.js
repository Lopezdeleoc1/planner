import React, { useState, useEffect } from "react";

export default function BudgetingTool({ budgetItems, setBudgetItems }) {
  const [itemName, setItemName] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);

  // Load budget items from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/budget")
      .then(res => res.json())
      .then(data => {
        setBudgetItems(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading budget items:", err);
        setLoading(false);
      });
  }, [setBudgetItems]);

  // Add a budget item
  const handleAdd = (e) => {
    e.preventDefault();
    if (!itemName || !amount) return;

    const newItem = { name: itemName, amount: Number(amount) };

    fetch("http://localhost:5000/api/budget", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItem),
    })
      .then(res => res.json())
      .then(createdItem => {
        setBudgetItems([...budgetItems, { id: createdItem.id, ...newItem }]);
        setItemName("");
        setAmount("");
      })
      .catch(err => console.error("Error adding budget item:", err));
  };

  // Remove a budget item
  const handleRemove = (id) => {
    fetch(`http://localhost:5000/api/budget/${id}`, { method: "DELETE" })
      .then(() => setBudgetItems(budgetItems.filter(item => item.id !== id)))
      .catch(err => console.error("Error removing budget item:", err));
  };

  const totalSpent = budgetItems.reduce((sum, item) => sum + Number(item.amount), 0);
  const totalBudget = 5000; // Example total budget
  const percentUsed = totalBudget ? Math.round((totalSpent / totalBudget) * 100) : 0;

  if (loading) return <p>Loading budget items...</p>;

  return (
    <div className="component-window">
      <h2>Budgeting Tool</h2>

      <form onSubmit={handleAdd} style={{ marginBottom: "15px" }}>
        <input
          className="form-input"
          type="text"
          placeholder="Item Name"
          value={itemName}
          onChange={e => setItemName(e.target.value)}
          required
        />
        <input
          className="form-input form-input-small"
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          required
        />
        <button className="add-button" type="submit">Add</button>
      </form>

      <table className="table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Amount</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {budgetItems.map(item => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>${item.amount}</td>
              <td>
                <button className="remove-button" onClick={() => handleRemove(item.id)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ marginTop: "20px" }}>
        Total Spent: ${totalSpent} ({percentUsed}% of ${totalBudget})
      </h3>
    </div>
  );
}
