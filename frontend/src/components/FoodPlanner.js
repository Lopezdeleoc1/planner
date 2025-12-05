import React, { useState, useEffect } from "react";
import axios from "axios";

export default function FoodPlanner({ foodItems, setFoodItems }) {
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [cost, setCost] = useState("");
  const [loading, setLoading] = useState(true);

  // -------------------------------
  // LOAD FOOD ITEMS FROM BACKEND
  // -------------------------------
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/food")
      .then((res) => setFoodItems(res.data || []))
      .catch((err) => console.error("Error loading food:", err))
      .finally(() => setLoading(false));
  }, [setFoodItems]);

  // -------------------------------
  // ADD NEW FOOD ITEM
  // -------------------------------
  const handleAdd = (e) => {
    e.preventDefault();
    if (!itemName || !quantity || !cost) return;

    const newItem = {
      name: itemName,
      quantity: Number(quantity),
      cost: Number(cost),
    };

    axios
      .post("http://localhost:5000/api/food", newItem)
      .then((res) => {
        setFoodItems([...foodItems, res.data]); // add returned item w/ id
        setItemName("");
        setQuantity("");
        setCost("");
      })
      .catch((err) => console.error("Error adding item:", err));
  };

  // -------------------------------
  // DELETE ITEM
  // -------------------------------
  const handleRemove = (id) => {
    axios
      .delete(`http://localhost:5000/api/food/${id}`)
      .then(() => {
        setFoodItems(foodItems.filter((item) => item.id !== id));
      })
      .catch((err) => console.error("Error deleting item:", err));
  };

  // -------------------------------
  // TOTAL COST
  // -------------------------------
  const totalCost = foodItems.reduce(
    (sum, item) => sum + Number(item.cost),
    0
  );

  if (loading) return <p>Loading food items...</p>;

  return (
    <div className="component-window">
      <h2>Food Planner</h2>

      <form onSubmit={handleAdd} style={{ marginBottom: "15px" }}>
        <input
          className="form-input"
          type="text"
          placeholder="Item Name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          required
        />

        <input
          className="form-input form-input-small"
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />

        <input
          className="form-input form-input-small"
          type="number"
          placeholder="Cost"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
          required
        />

        <button className="add-button" type="submit">
          Add
        </button>
      </form>

      <table className="table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Qty</th>
            <th>Cost</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {foodItems.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>${item.cost}</td>
              <td>
                <button
                  className="remove-button"
                  onClick={() => handleRemove(item.id)}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ marginTop: "20px" }}>
        Total Cost: ${totalCost}
      </h3>
    </div>
  );
}
