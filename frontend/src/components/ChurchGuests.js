import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ChurchGuests({ churches, setChurches }) {
  const [churchName, setChurchName] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch existing churches from backend
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/churches")
      .then((res) => {
        setChurches(res.data || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [setChurches]);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!churchName || !guestCount) return;

    const newChurch = { name: churchName, guests: Number(guestCount) };

    // Save to backend
    axios
      .post("http://localhost:5000/api/churches", newChurch)
      .then((res) => {
        setChurches([...churches, res.data]); // Use backend response
        setChurchName("");
        setGuestCount("");
      })
      .catch((err) => console.error(err));
  };

  const handleRemove = (id) => {
    axios
      .delete(`http://localhost:5000/api/churches/${id}`)
      .then(() => {
        setChurches(churches.filter((c) => c.id !== id));
      })
      .catch((err) => console.error(err));
  };

  const totalGuests = churches.reduce((sum, c) => sum + c.guests, 0);

  if (loading) return <p>Loading church guests...</p>;

  return (
    <div className="component-window">
      <h2>Church Guests</h2>
      <form onSubmit={handleAdd} style={{ marginBottom: "15px" }}>
        <input
          className="form-input"
          type="text"
          placeholder="Church Name"
          value={churchName}
          onChange={(e) => setChurchName(e.target.value)}
          required
        />
        <input
          className="form-input form-input-small"
          type="number"
          placeholder="Guest Count"
          value={guestCount}
          onChange={(e) => setGuestCount(e.target.value)}
          required
        />
        <button type="submit" className="add-button">
          Add
        </button>
      </form>

      <table className="table">
        <thead>
          <tr>
            <th>Church</th>
            <th>Guests</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {churches.map((c) => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.guests}</td>
              <td>
                <button
                  className="remove-button"
                  onClick={() => handleRemove(c.id)}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ marginTop: "20px" }}>Total Guests: {totalGuests}</h3>
    </div>
  );
}
