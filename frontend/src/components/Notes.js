import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Notes({ notes, setNotes }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);

  // Use environment variable for API URL (works locally and when deployed)
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  // Fetch notes from backend
  useEffect(() => {
    axios
      .get(`${API_URL}/api/notes`)
      .then((res) => setNotes(res.data || []))
      .catch((err) => console.error("Error fetching notes:", err))
      .finally(() => setLoading(false));
  }, [setNotes, API_URL]);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!title) return;

    const newNote = { title, description };

    axios
      .post(`${API_URL}/api/note`, newNote)
      .then((res) => setNotes([...notes, { id: res.data.id, ...newNote }]))
      .catch((err) => console.error("Error adding note:", err));

    setTitle("");
    setDescription("");
  };

  const handleRemove = (id) => {
    axios
      .delete(`${API_URL}/api/note/${id}`)
      .then(() => setNotes(notes.filter((n) => n.id !== id)))
      .catch((err) => console.error("Error removing note:", err));
  };

  if (loading) return <p>Loading notes...</p>;

  return (
    <div className="component-window">
      <h2>Notes</h2>

      <form onSubmit={handleAdd} style={{ marginBottom: "15px" }}>
        <input
          className="form-input"
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          className="form-input"
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button className="add-button" type="submit">Add Note</button>
      </form>

      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {notes.map((note) => (
            <tr key={note.id}>
              <td>{note.title}</td>
              <td>{note.description}</td>
              <td>
                <button className="remove-button" onClick={() => handleRemove(note.id)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
