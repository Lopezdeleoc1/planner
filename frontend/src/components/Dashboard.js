import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Dashboard({
  setActiveComponent,
  eventDetails,
  churches,
  foodItems,
  budgetItems,
  activities,
  notes
}) {
  const cards = [
    { name: "Event Details", key: "EventDetails", preview: "Preview event info..." },
    { name: "Church Guests", key: "ChurchGuests", preview: "Preview guest list..." },
    { name: "Food Planner", key: "FoodPlanner", preview: "Preview food items..." },
    { name: "Event Scheduler", key: "EventScheduler", preview: "Preview event schedule..." },
    { name: "Budgeting Tool", key: "BudgetingTool", preview: "Preview budget breakdown..." },
    { name: "Notes", key: "Notes", preview: "Create and save notes..." }
  ];

const generateReport = () => {
  const doc = new jsPDF();
  doc.setFontSize(20);
  doc.text("Event Report", 14, 22);

  let yPosition = 30;

  // Event Details
  doc.setFontSize(16);
  doc.text("Event Details", 14, yPosition);
  yPosition += 6;

  autoTable(doc, {
    startY: yPosition,
    head: [["Field", "Value"]],
    body: [
      ["Name", eventDetails.name],
      ["Date", eventDetails.date],
      ["Start Time", eventDetails.startTime],
      ["End Time", eventDetails.endTime],
      ["Theme", eventDetails.theme],
      ["Location", eventDetails.location],
    ],
    theme: "grid",
    headStyles: { fillColor: [41, 128, 185] },
    margin: { left: 14, right: 14 },
  });

  yPosition = doc.lastAutoTable.finalY + 10;

  // Church Guests
  if (churches.length > 0) {
    doc.setFontSize(16);
    doc.text("Church Guests", 14, yPosition);
    yPosition += 6;

    autoTable(doc, {
      startY: yPosition,
      head: [["Church", "Guests"]],
      body: churches.map(c => [c.name, c.guests]),
      theme: "grid",
      headStyles: { fillColor: [39, 174, 96] },
      margin: { left: 14, right: 14 },
    });

    yPosition = doc.lastAutoTable.finalY + 10;
  }

  // Food Planner
  if (foodItems.length > 0) {
    doc.setFontSize(16);
    doc.text("Food Planner", 14, yPosition);
    yPosition += 6;

    autoTable(doc, {
      startY: yPosition,
      head: [["Item", "Qty", "Cost"]],
      body: foodItems.map(f => [f.name, f.quantity, `$${f.cost}`]),
      theme: "grid",
      headStyles: { fillColor: [243, 156, 18] },
      margin: { left: 14, right: 14 },
    });

    yPosition = doc.lastAutoTable.finalY + 10;
  }

  // Budget
  if (budgetItems.length > 0) {
    doc.setFontSize(16);
    doc.text("Budget", 14, yPosition);
    yPosition += 6;

    autoTable(doc, {
      startY: yPosition,
      head: [["Item", "Amount"]],
      body: budgetItems.map(b => [b.name, `$${b.amount}`]),
      theme: "grid",
      headStyles: { fillColor: [192, 57, 43] },
      margin: { left: 14, right: 14 },
    });

    yPosition = doc.lastAutoTable.finalY + 10;
  }

  // Event Scheduler Activities
  if (activities.length > 0) {
    doc.setFontSize(16);
    doc.text("Event Scheduler", 14, yPosition);
    yPosition += 6;

    autoTable(doc, {
      startY: yPosition,
      head: [["Title", "Description", "Start", "End"]],
      body: activities.map(a => [a.title, a.description, a.startTime, a.endTime]),
      theme: "grid",
      headStyles: { fillColor: [155, 89, 182] },
      margin: { left: 14, right: 14 },
    });

    yPosition = doc.lastAutoTable.finalY + 10;
  }

  // Notes
  if (notes.length > 0) {
    doc.setFontSize(16);
    doc.text("Notes", 14, yPosition);
    yPosition += 6;

    autoTable(doc, {
      startY: yPosition,
      head: [["Title", "Description"]],
      body: notes.map(n => [n.title, n.description]),
      theme: "grid",
      headStyles: { fillColor: [52, 73, 94] },
      margin: { left: 14, right: 14 },
    });
  }

  doc.save("EventReport.pdf");
};


  return (
    <div className="dashboard-container">
      <h2>Main Dashboard</h2>
      <button className="report-button" onClick={generateReport}>Generate Report</button>
      <div className="dashboard-cards">
        {cards.map(card => (
          <div
            key={card.key}
            className="dashboard-card"
            onClick={() => setActiveComponent(card.key)}
          >
            <h3>{card.name}</h3>
            <p className="card-preview">{card.preview}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
