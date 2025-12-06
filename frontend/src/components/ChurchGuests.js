import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ChurchGuests({ churches, setChurches, guests, setGuests }) {
  const [churchName, setChurchName] = useState("");
  const [guestName, setGuestName] = useState("");
  const [selectedChurch, setSelectedChurch] = useState("");

  // Use environment variable for API base URL
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    axios.get(`${API_URL}/api/churches`)
      .then((res) => setChurches(res.data || []))
      .catch((err) => console.error(err));

    axios.get(`${API_URL}/api/guests`)
      .then((res) => setGuests(res.data || []))
      .catch((err) => console.error(err));
  }, [setChurches, setGuests, API_URL]);

  const handleAddChurch = (e) => {
    e.preventDefault();
    if (!churchName) return;

    axios.post(`${API_URL}/api/church`, { name: churchName })
      .then((res) => setChurches([...churches, { id: res.data.id, name: churchName }]))
      .catch((err) => console.error(err));

    setChurchName("");
  };

  const handleAddGuest = (e) => {
    e.preventDefault();
    if (!guestName || !selectedChurch) return;

    axios.post(`${API_URL}/api/guest`, { name: guestName, churchId: selectedChurch })
      .then((res) => setGuests([...guests, { id: res.data.id, name: guestName, churchId: selectedChurch }]))
      .catch((err) => console.error(err));

    setGuestName("");
    setSelectedChurch("");
  };

  return (
    <div className="component-window">
      <h2>Church Guests</h2>

      <form onSubmit={handleAddChurch} style={{ marginBottom: "15px" }}>
        <input
          className="form-input"
          type="text"
          placeholder="New Church Name"
          value={churchName}
          onChange={(e) => setChurchName(e.target.value)}
          required
        />
        <button className="add-button" type="submit">Add Church</button>
      </form>

      <form onSubmit={handleAddGuest} style={{ marginBottom: "15px" }}>
        <input
          className="form-input"
          type="text"
          placeholder="Guest Name"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          required
        />
        <select value={selectedChurch} onChange={(e) => setSelectedChurch(e.target.value)} required>
          <option value="">Select Church</option>
          {churches.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <button className="add-button" type="submit">Add Guest</button>
      </form>

      <table className="table">
        <thead>
          <tr>
            <th>Guest</th>
            <th>Church</th>
          </tr>
        </thead>
        <tbody>
          {guests.map((g) => (
            <tr key={g.id}>
              <td>{g.name}</td>
              <td>
                {churches.find((c) => c.id === g.churchId)?.name || "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
