import React, { useState } from "react";

export default function GraniteCalculator({
  rows,
  handleChange,
  inputRefs,
  deleteRow,
  addRow,
  rate,
  setRate,
  totalSqft,
  grandTotal
}) {

  const [showLengthFt, setShowLengthFt] = useState(false);
  const [showBreadthFt, setShowBreadthFt] = useState(false);

  const moveFocus = (index) => {
    if (inputRefs.current[index]) {
      inputRefs.current[index].focus();
    }
  };

  const lengthFtKey = (e, i) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      moveFocus(i * 5 + 1);
    }
  };

  const lengthInKey = (e, i) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      moveFocus(i * 5 + 3);
    }
  };

  const breadthFtKey = (e, i) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      moveFocus(i * 5 + 3);
    }
  };

  const breadthInKey = (e, i) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      moveFocus(i * 5 + 4);
    }
  };

  const qtyKey = (e, i) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      const next = (i + 1) * 5 + 1;
      if (inputRefs.current[next]) {
        inputRefs.current[next].focus();
      }
    }
  };

  return (
    <>
      <div className="table-wrapper">
        <table>

          {/* ================= HEADER ================= */}
          <thead>

            <tr>
              <th colSpan={showLengthFt ? 2 : 1}>Length</th>
              <th></th>
              <th colSpan={showBreadthFt ? 2 : 1}>Breadth</th>
              <th>Qty</th>
              <th>SqFt</th>
              <th></th>
            </tr>

            {/* FT TOGGLE */}
            <tr>
              <th
                colSpan={showLengthFt ? 2 : 1}
                className="ft-toggle-header"
                onClick={() => setShowLengthFt(v => !v)}
              >
                {showLengthFt ? "Hide Ft" : "Show Ft"}
              </th>

              <th></th>

              <th
                colSpan={showBreadthFt ? 2 : 1}
                className="ft-toggle-header"
                onClick={() => setShowBreadthFt(v => !v)}
              >
                {showBreadthFt ? "Hide Ft" : "Show Ft"}
              </th>

              <th></th>
              <th></th>
              <th></th>
            </tr>

            {/* LABELS */}
            <tr>
              {showLengthFt && <th>Ft</th>}
              <th>In</th>
              <th></th>
              {showBreadthFt && <th>Ft</th>}
              <th>In</th>
              <th>Qty</th>
              <th>SqFt</th>
              <th></th>
            </tr>

          </thead>

          {/* ================= BODY ================= */}
          <tbody>

            {rows.map((row, i) => (
              <tr key={i}>

                {showLengthFt && (
                  <td>
                    <input
                      ref={el => inputRefs.current[i * 5] = el}
                      className="calc-input large-input"
                      value={row.lengthFt}
                      inputMode="numeric"
                      onChange={(e) => handleChange(i, "lengthFt", e.target.value)}
                      onKeyDown={(e) => lengthFtKey(e, i)}
                    />
                  </td>
                )}

                <td>
                  <input
                    ref={el => inputRefs.current[i * 5 + 1] = el}
                    className="calc-input large-input"
                    value={row.lengthIn}
                    inputMode="numeric"
                    onChange={(e) => handleChange(i, "lengthIn", e.target.value)}
                    onKeyDown={(e) => lengthInKey(e, i)}
                  />
                </td>

                <td className="multiply">×</td>

                {showBreadthFt && (
                  <td>
                    <input
                      ref={el => inputRefs.current[i * 5 + 2] = el}
                      className="calc-input large-input"
                      value={row.breadthFt}
                      inputMode="numeric"
                      onChange={(e) => handleChange(i, "breadthFt", e.target.value)}
                      onKeyDown={(e) => breadthFtKey(e, i)}
                    />
                  </td>
                )}

                <td>
                  <input
                    ref={el => inputRefs.current[i * 5 + 3] = el}
                    className="calc-input large-input"
                    value={row.breadthIn}
                    inputMode="numeric"
                    onChange={(e) => handleChange(i, "breadthIn", e.target.value)}
                    onKeyDown={(e) => breadthInKey(e, i)}
                  />
                </td>

                <td>
                  <input
                    ref={el => inputRefs.current[i * 5 + 4] = el}
                    type="number"
                    min="1"
                    className="calc-input large-input qty-input"
                    value={row.qty}
                    onFocus={(e) => e.target.select()}
                    onKeyDown={(e) => qtyKey(e, i)}
                    onChange={(e) => handleChange(i, "qty", e.target.value)}
                  />
                </td>

                <td className="sqft-cell">{row.sqft}</td>

                <td className="delete-cell">
                  <button
                    className="delete-btn"
                    onClick={() => deleteRow(i)}
                  >
                    ✕
                  </button>
                </td>

              </tr>
            ))}

          </tbody>
        </table>
      </div>

      <button className="add-btn" onClick={addRow}>
        Add Piece
      </button>

      {/* ================= SUMMARY ================= */}

      <div className="summary-box">

        <div className="summary-top">

          <div className="total-sqft">
            <span>Total Sq Ft</span>
            <h2>{(totalSqft || 0).toFixed(2)}</h2>
          </div>

          <div className="rate-box">
            <label>Rate ₹ / Sq Ft</label>
            <input
              className="rate-input"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              inputMode="numeric"
            />
          </div>

        </div>

        <div className="grand-total">
          Grand Total ₹
          <span>{(grandTotal || 0).toFixed(2)}</span>
        </div>

      </div>

    </>
  );
}