
import React from "react";

export default function Home({
  setPage
}) {

  return (

    <div className="home-page">

      <div className="home-card">

        <h1>
          🪨 ANNA STONE
        </h1>

        <p>
          Smart Stone Estimate System
        </p>

        <div className="home-actions">

          <button
            className="home-btn"
            onClick={() =>
              setPage("create")
            }
          >
            ➕ Create Estimate
          </button>

          <button
            className="home-btn secondary"
            onClick={() =>
              setPage("review")
            }
          >
            📋 Review Estimates
          </button>

        </div>

      </div>

    </div>

  );
}