import React, { useState, useEffect } from "react";
import { fetchVillageFromApi, normalizeVillage, computeRecommendations } from "./api/villageService";

import { Resources } from "./components/Resources";
import { Ongoing } from "./components/Ongoing";
import { Recommendations } from "./components/Recommendations";
import { Planner } from "./components/Planner";

export default function App() {
  const [village, setVillage] = useState(null);
  const [error, setError] = useState("");
  const [plans, setPlans] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("clashdash_plans") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("clashdash_plans", JSON.stringify(plans));
  }, [plans]);

  async function loadFromApiPath(path) {
    setError("");
    try {
      const raw = await fetchVillageFromApi(path);
      const n = normalizeVillage(raw);
      setVillage(n);
    } catch (err) {
      setError("Failed to load from API: " + err.message);
    }
  }

  async function handleFileUpload(file) {
    setError("");
    try {
      const text = await file.text();
      const raw = JSON.parse(text);
      const n = normalizeVillage(raw);
      setVillage(n);
    } catch (err) {
      setError("Failed to load file: " + err.message);
    }
  }

  function addPlan(p) {
    setPlans((prev) => [p, ...prev]);
  }

  const recs = village ? computeRecommendations(village) : [];

  return (
    <div style={{ padding: 20, fontFamily: "Inter, system-ui" }}>
      <h1>ClashDash — Full COC Manager</h1>

      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div className="card">
            <h3>Load Village (API)</h3>
            <div className="muted">Example path: /players/%23TAG</div>
            <input id="apiPath" placeholder="/players/%23TAG" style={{ width: "100%" }} />
            <button onClick={() => loadFromApiPath(document.getElementById("apiPath").value)}>
              Load from API
            </button>
          </div>

          <div className="card">
            <h3>Load Village (Upload JSON Export)</h3>
            <input type="file" accept="application/json" onChange={(e) => handleFileUpload(e.target.files[0])} />
          </div>

          {error && (
            <div className="card" style={{ borderLeft: "4px solid red" }}>
              <strong>Error:</strong> {error}
            </div>
          )}
        </div>

        <div style={{ width: 420 }}>
          <div className="card">
            <h3>Planner</h3>
            <Planner buildings={village?.buildings} onPlanAdd={addPlan} />
            <strong>Saved Plans</strong>
            <ul>
              {plans.map((p) => (
                <li key={p.id}>{p.name} — {p.notes}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {village && (
        <>
          <Resources resources={village.resources} />
          <Ongoing items={village.ongoing} />
          <Recommendations recs={recs} />

          <details className="card">
            <summary>Raw JSON</summary>
            <pre>{JSON.stringify(village.raw, null, 2)}</pre>
          </details>
        </>
      )}

      <style>{`
        .card {
          background: #fff;
          padding: 14px;
          border-radius: 12px;
          box-shadow: 0 6px 20px rgba(20,20,50,0.06);
          margin-bottom: 12px;
        }
        .muted { color: #666; font-size: 13px; }
      `}</style>
    </div>
  );
}
