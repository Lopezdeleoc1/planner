import React, { useState, useEffect } from "react";

export default function Notes({ notes, setNotes }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);

  // Load notes from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/notes")
      .then(res => res.json())
      .then(data => {
        setNotes(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading notes:", err);
        setLoading(false);
      });
  }, [setNotes]);

  // Add a note
  const handleAdd = (e) => {
    e.preventDefault();
    if (!title) return;

    const newNote = { title, description };

    fetch("http://localhost:5000/api/note", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newNote),
    })
      .then(res => res.json())
      .then(createdNote => {
        setNotes([...notes, { id: createdNote.id, ...newNote }]);
        setTitle("");
        setDescription("");
      })
      .catch(err => console.error("Error adding note:", err));
  };

  // Remove a note
  const handleRemove = (id) => {
    fetch(`http://localhost:5000/api/note/${id}`, { method: "DELETE" })
      .then(() => setNotes(notes.filter(note => note.id !== id)))
      .catch(err => console.error("Error removing note:", err));
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
          onChange={e => setTitle(e.target.value)}
          required
        />
        <input
          className="form-input"
          type="text"
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
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
          {notes.map(note => (
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
