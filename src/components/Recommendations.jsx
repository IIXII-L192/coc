import React from "react";

export function Recommendations({ recs }) {
  if (!recs || recs.length === 0)
    return (
      <div className="card">
        <h3>Recommendations</h3>
        <div className="muted">No recommendations.</div>
      </div>
    );

  return (
    <div className="card">
      <h3>Recommendations</h3>
      <ul>
        {recs.map((r, i) => (
          <li key={i}>
            <strong>{r.name}</strong> — {r.reason} (G:{r.cost.gold} / E:{r.cost.elixir})
          </li>
        ))}
      </ul>
    </div>
  );
}
