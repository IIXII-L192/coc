import React, { useState } from "react";

export function Planner({ buildings, onPlanAdd }) {
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");

  function add() {
    if (!name) return alert("Pick a building");
    onPlanAdd({
      id: Date.now(),
      name,
      notes,
      createdAt: new Date().toISOString()
    });
    setName("");
    setNotes("");
  }

  return (
    <div>
      <select value={name} onChange={(e) => setName(e.target.value)} style={{ width: "100%" }}>
        <option value="">-- choose a building --</option>
        {buildings?.map((b, i) => (
          <option key={i} value={b.name || b.type}>
            {b.name || b.type}
          </option>
        ))}
      </select>

      <textarea
        rows={3}
        placeholder="Notes..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        style={{ width: "100%", marginTop: 10 }}
      />

      <button onClick={add} style={{ marginTop: 10 }}>
        Add Plan
      </button>
    </div>
  );
}
