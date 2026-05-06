import React from "react";
import "./Preview.css";

export default function EstimatePreview({
  onClose,
  customerName,
  phoneNumber,
  invoiceDate,
  graniteList,
  kadapaRows,
  kadapaTotal,
  kotaRows,
  kotaTotal,
  otherRows,
  otherTotal,
  finalGrandTotal
}) {

  const getSqftSum = (rows) =>
    rows.reduce(
      (s, r) => s + parseFloat(r.sqft || 0),
      0
    );

  return (
    <div className="preview-overlay">

      <div className="preview-box">

        <button className="close-btn" onClick={onClose}>
          ✕
        </button>

        <h2>ANNA STONE ESTIMATE</h2>

        <p>Customer: {customerName || "-"}</p>
        <p>Phone: {phoneNumber || "-"}</p>
        <p>Date: {invoiceDate}</p>

        {/* GRANITE */}
        {graniteList.map((g, i) => (
          <div key={i} className="preview-section">
            <h3>GRANITE : {g.name}</h3>

            {g.rows.map((r, j) =>
              parseFloat(r.sqft) > 0 ? (
                <div key={j} className="preview-row">
                  {r.lengthFt}'{r.lengthIn}" × {r.breadthFt}'{r.breadthIn}" | Qty {r.qty} | {r.sqft} sqft
                </div>
              ) : null
            )}

            <p>Rate: ₹{g.rate}</p>
            <p>
              Total: ₹
              {(
                getSqftSum(g.rows) *
                (parseFloat(g.rate) || 0)
              ).toFixed(2)}
            </p>
          </div>
        ))}

        {/* KADAPA */}
        {kadapaTotal > 0 && (
          <div className="preview-section">
            <h3>KADAPA</h3>
            <p>Total: ₹{kadapaTotal.toFixed(2)}</p>
          </div>
        )}

        {/* KOTA */}
        {kotaTotal > 0 && (
          <div className="preview-section">
            <h3>KOTA</h3>
            <p>Total: ₹{kotaTotal.toFixed(2)}</p>
          </div>
        )}

        {/* OTHER */}
        {otherTotal > 0 && (
          <div className="preview-section">
            <h3>OTHER</h3>
            {otherRows.map((r, i) =>
              parseFloat(r.total) > 0 ? (
                <div key={i}>
                  {r.particular} | {r.qty} × ₹{r.rate} = ₹{r.total}
                </div>
              ) : null
            )}
            <p>Total: ₹{otherTotal.toFixed(2)}</p>
          </div>
        )}

        <h2 className="final-total">
          Grand Total ₹ {finalGrandTotal.toFixed(2)}
        </h2>

      </div>
    </div>
  );
}