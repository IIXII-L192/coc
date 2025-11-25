import React from "react";

export function Ongoing({ items }) {
  if (!items || items.length === 0)
    return (
      <div className="card">
        <h3>Ongoing</h3>
        <div className="muted">No ongoing upgrades.</div>
      </div>
    );

  return (
    <div className="card">
      <h3>Ongoing</h3>
      <ul>
        {items.map((u, i) => {
          const name = u.what || u.name || u.building || "unknown";
          const time = u.timeLeftSec || u.timeLeft || "Unknown";
          return (
            <li key={i}>
              <strong>{name}</strong> — {time}s
            </li>
          );
        })}
      </ul>
    </div>
  );
}
