import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import EventDetails from "./components/EventDetails";
import ChurchGuests from "./components/ChurchGuests";
import FoodPlanner from "./components/FoodPlanner";
import EventScheduler from "./components/EventScheduler";
import BudgetingTool from "./components/BudgetingTool";
import Notes from "./components/Notes";
import Dashboard from "./components/Dashboard";
import "./App.css";

function App() {
  const [eventDetails, setEventDetails] = useState(() => {
    return JSON.parse(localStorage.getItem("eventDetails")) || {
      name: "",
      date: "",
      startTime: "",
      endTime: "",
      theme: "",
      location: "",
    };
  });

  const [churches, setChurches] = useState(() => {
    return JSON.parse(localStorage.getItem("churches")) || [];
  });

  const [foodItems, setFoodItems] = useState(() => {
    return JSON.parse(localStorage.getItem("foodItems")) || [];
  });

  const [budgetItems, setBudgetItems] = useState(() => {
    return JSON.parse(localStorage.getItem("budgetItems")) || [];
  });

  const [activities, setActivities] = useState(() => {
    return JSON.parse(localStorage.getItem("activities")) || [];
  });

  const [notes, setNotes] = useState(() => {
    return JSON.parse(localStorage.getItem("notes")) || [];
  });

  const [activeComponent, setActiveComponent] = useState(null);

  // Save to localStorage whenever state changes
  useEffect(() => localStorage.setItem("eventDetails", JSON.stringify(eventDetails)), [eventDetails]);
  useEffect(() => localStorage.setItem("churches", JSON.stringify(churches)), [churches]);
  useEffect(() => localStorage.setItem("foodItems", JSON.stringify(foodItems)), [foodItems]);
  useEffect(() => localStorage.setItem("budgetItems", JSON.stringify(budgetItems)), [budgetItems]);
  useEffect(() => localStorage.setItem("activities", JSON.stringify(activities)), [activities]);
  useEffect(() => localStorage.setItem("notes", JSON.stringify(notes)), [notes]);

  const handleBack = () => setActiveComponent(null);

  return (
    <div className="app-container">
      <Header />

      {!activeComponent && (
        <Dashboard
          setActiveComponent={setActiveComponent}
          eventDetails={eventDetails}
          churches={churches}
          foodItems={foodItems}
          budgetItems={budgetItems}
          activities={activities}
          notes={notes}
        />
      )}

      {activeComponent === "EventDetails" && (
        <div className="fade-in">
          <button className="back-button" onClick={handleBack}>⬅ Back</button>
          <EventDetails eventDetails={eventDetails} setEventDetails={setEventDetails} />
        </div>
      )}

      {activeComponent === "ChurchGuests" && (
        <div className="fade-in">
          <button className="back-button" onClick={handleBack}>⬅ Back</button>
          <ChurchGuests churches={churches} setChurches={setChurches} />
        </div>
      )}

      {activeComponent === "FoodPlanner" && (
        <div className="fade-in">
          <button className="back-button" onClick={handleBack}>⬅ Back</button>
          <FoodPlanner foodItems={foodItems} setFoodItems={setFoodItems} />
        </div>
      )}

      {activeComponent === "EventScheduler" && (
        <div className="fade-in">
          <button className="back-button" onClick={handleBack}>⬅ Back</button>
          <EventScheduler eventDetails={eventDetails} activities={activities} setActivities={setActivities} />
        </div>
      )}

      {activeComponent === "BudgetingTool" && (
        <div className="fade-in">
          <button className="back-button" onClick={handleBack}>⬅ Back</button>
          <BudgetingTool budgetItems={budgetItems} setBudgetItems={setBudgetItems} />
        </div>
      )}

      {activeComponent === "Notes" && (
        <div className="fade-in">
          <button className="back-button" onClick={handleBack}>⬅ Back</button>
          <Notes notes={notes} setNotes={setNotes} />
        </div>
      )}
    </div>
  );
}

export default App;
