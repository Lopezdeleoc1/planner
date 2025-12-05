import React, { useState, useEffect } from "react";

export default function EventScheduler({ eventDetails, handleBack }) {
  const [activities, setActivities] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  // Load activities from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/activities")
      .then((res) => res.json())
      .then((data) => setActivities(data))
      .catch((err) => console.error("Error loading activities:", err));
  }, []);

  // Helper: format time in 12-hour format with AM/PM
  const format12Hour = (timeStr) => {
    if (!timeStr) return "";
    let [h, m] = timeStr.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h}:${m.toString().padStart(2, "0")} ${ampm}`;
  };

  // Calculate remaining time
  const getTimeRemaining = () => {
    if (!eventDetails.startTime || !eventDetails.endTime) return 0;

    const [startH, startM] = eventDetails.startTime.split(":").map(Number);
    const [endH, endM] = eventDetails.endTime.split(":").map(Number);

    const totalEventMinutes = (endH * 60 + endM) - (startH * 60 + startM);

    const usedMinutes = activities.reduce((sum, a) => {
      const [aStartH, aStartM] = a.startTime.split(":").map(Number);
      const [aEndH, aEndM] = a.endTime.split(":").map(Number);
      return sum + ((aEndH * 60 + aEndM) - (aStartH * 60 + aStartM));
    }, 0);

    return totalEventMinutes - usedMinutes;
  };

  // Add activity (POST to backend)
  const handleAdd = (e) => {
    e.preventDefault();
    if (!title || !startTime || !endTime) return;

    fetch("http://localhost:5000/api/activity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, startTime, endTime }),
    })
      .then((res) => res.json())
      .then((newActivity) => {
        setActivities([
          ...activities,
          {
            id: newActivity.id,
            title,
            description,
            startTime,
            endTime,
          },
        ]);
        setTitle("");
        setDescription("");
        setStartTime("");
        setEndTime("");
      })
      .catch((err) => console.error("Error adding activity:", err));
  };

  // Remove activity (local only for now)
  const handleRemove = (index) => {
    const updated = [...activities];
    updated.splice(index, 1);
    setActivities(updated);
  };

  const formatTime = (minutes) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

  return (
    <div className="component-window">
      <h2>Event Scheduler</h2>
      <button onClick={handleBack} style={{ float: "right", marginBottom: "10px" }}>
        ⬅ Back
      </button>

      <p>
        <strong>Time Remaining:</strong> {formatTime(getTimeRemaining())}
      </p>

      <form onSubmit={handleAdd} style={{ marginBottom: "15px" }}>
        <input
          className="form-input"
          type="text"
          placeholder="Activity Title"
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
        <input
          className="form-input form-input-small"
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
        />
        <input
          className="form-input form-input-small"
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          required
        />
        <button className="add-button" type="submit">
          Add Activity
        </button>
      </form>

      <table className="table">
        <thead>
          <tr>
            <th>Activity</th>
            <th>Description</th>
            <th>Start</th>
            <th>End</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((a, index) => (
            <tr key={index}>
              <td>{a.title}</td>
              <td>{a.description}</td>
              <td>{format12Hour(a.startTime)}</td>
              <td>{format12Hour(a.endTime)}</td>
              <td>
                <button
                  className="remove-button"
                  onClick={() => handleRemove(index)}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
