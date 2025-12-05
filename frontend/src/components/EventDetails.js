import React, { useState, useEffect } from "react";
import axios from "axios";

export default function EventDetails({ eventDetails, setEventDetails }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/event")
      .then((res) => setEventDetails(res.data || {}))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [setEventDetails]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventDetails({ ...eventDetails, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/api/event", eventDetails)
      .then(() => alert("Event saved successfully!"))
      .catch((err) => console.error(err));
  };

  if (loading) return <p>Loading event details...</p>;

  return (
    <div className="component-window">
      <h2>Event Details</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Event Name: </label>
          <input
            type="text"
            name="name"
            value={eventDetails.name || ""}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Date: </label>
          <input
            type="date"
            name="date"
            value={eventDetails.date || ""}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Start Time: </label>
          <input
            type="time"
            name="startTime"
            value={eventDetails.startTime || ""}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>End Time: </label>
          <input
            type="time"
            name="endTime"
            value={eventDetails.endTime || ""}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Theme: </label>
          <input
            type="text"
            name="theme"
            value={eventDetails.theme || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Location: </label>
          <input
            type="text"
            name="location"
            value={eventDetails.location || ""}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="add-button" style={{ marginTop: "10px" }}>
          Save Event
        </button>
      </form>
    </div>
  );
}
