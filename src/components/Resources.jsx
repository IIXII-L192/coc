import React from "react";

export function Resources({ resources }) {
  return (
    <div className="card">
      <h3>Resources</h3>
      <div className="row">
        <div>Gold: {resources.gold.toLocaleString()}</div>
        <div>Elixir: {resources.elixir.toLocaleString()}</div>
        <div>Dark: {resources.darkElixir.toLocaleString()}</div>
        <div>Gems: {resources.gems.toLocaleString()}</div>
      </div>
    </div>
  );
}
