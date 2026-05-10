
import React from "react";
import "../styles/Preview.css";

export default function EstimatePreview({
  onClose,
  customerName,
  phoneNumber,
  invoiceDate,
  graniteList,
kadapaList,
  otherRows,
  otherTotal,
  finalGrandTotal
}) {

  const getSqft = (rows) =>
    rows.reduce(
      (s, r) => s + parseFloat(r.sqft || 0),
      0
    );

  return (
    <div className="preview-overlay">

      <div className="preview-box">

        <button
          className="close-btn"
          onClick={onClose}
        >
          ✕
        </button>

        <h1 className="preview-title">
          ANNA STONE ESTIMATE
        </h1>

        <div className="preview-client">
          <p>
            <strong>Customer:</strong>
            {" "}
            {customerName || "-"}
          </p>

          <p>
            <strong>Phone:</strong>
            {" "}
            {phoneNumber || "-"}
          </p>

          <p>
            <strong>Date:</strong>
            {" "}
            {invoiceDate}
          </p>
        </div>

        {/* ================= GRANITE ================= */}

        {graniteList.map((g, i) => {

          const sqft =
            getSqft(g.rows);

          const total =
            sqft *
            (parseFloat(g.rate) || 0);

          return (
            <div
              key={i}
              className="preview-section"
            >

              <h2>
                GRANITE : {g.name}
              </h2>

              <table className="preview-table">

                <thead>
                  <tr>
                    <th>Measurement</th>
                    <th>Qty</th>
                    <th>SqFt</th>
                  </tr>
                </thead>

                <tbody>

                  {g.rows.map((r, j) =>
                    parseFloat(r.sqft) > 0 ? (
                      <tr key={j}>

                        <td>
                          {r.lengthFt || 0}'
                          {" "}
                          {r.lengthIn || 0}"
                          {" × "}
                          {r.breadthFt || 0}'
                          {" "}
                          {r.breadthIn || 0}"
                        </td>

                        <td>{r.qty}</td>

                        <td>{r.sqft}</td>

                      </tr>
                    ) : null
                  )}

                </tbody>
              </table>

              <div className="preview-summary">

                <p>
                  <strong>Total SqFt:</strong>
                  {" "}
                  {sqft.toFixed(2)}
                </p>

                <p>
                  <strong>Rate:</strong>
                  {" "}
                  ₹{g.rate}
                </p>

                <p>
                  <strong>Total Amount:</strong>
                  {" "}
                  ₹{total.toFixed(2)}
                </p>

              </div>

            </div>
          );
        })}

        {/* ================= KADAPA ================= */}

{kadapaList.map((k, i) => {

  const sqft =
    getSqft(k.rows);

  const total =
    sqft *
    (parseFloat(k.rate) || 0);

  return (

    <div
      key={i}
      className="preview-section"
    >

      <h2>
      {k.name}
      </h2>

      <table className="preview-table">

        <thead>
          <tr>
            <th>Measurement</th>
            <th>Qty</th>
            <th>SqFt</th>
          </tr>
        </thead>

        <tbody>

          {k.rows.map((r, j) =>
            parseFloat(r.sqft) > 0 ? (
              <tr key={j}>

                <td>
                  {r.lengthFt || 0}'
                  {" "}
                  {r.lengthIn || 0}"
                  {" × "}
                  {r.breadthFt || 0}'
                  {" "}
                  {r.breadthIn || 0}"
                </td>

                <td>{r.qty}</td>

                <td>{r.sqft}</td>

              </tr>
            ) : null
          )}

        </tbody>

      </table>

      <div className="preview-summary">

        <p>
          <strong>Total SqFt:</strong>
          {" "}
          {sqft.toFixed(2)}
        </p>

        <p>
          <strong>Rate:</strong>
          {" "}
          ₹{k.rate}
        </p>

        <p>
          <strong>Total Amount:</strong>
          {" "}
          ₹{total.toFixed(2)}
        </p>

      </div>

    </div>

  );

})}



        {/* ================= OTHER ================= */}

        {otherTotal > 0 && (

          <div className="preview-section">

            <h2>OTHER</h2>

            <table className="preview-table">

              <thead>
                <tr>
                  <th>Particular</th>
                  <th>Qty</th>
                  <th>Rate</th>
                  <th>Total</th>
                </tr>
              </thead>

              <tbody>

                {otherRows.map((r, i) =>
                  parseFloat(r.total) > 0 ? (
                    <tr key={i}>

                      <td>{r.particular}</td>

                      <td>{r.qty}</td>

                      <td>₹{r.rate}</td>

                      <td>
                        ₹
                        {parseFloat(r.total || 0).toFixed(2)}
                      </td>

                    </tr>
                  ) : null
                )}

              </tbody>

            </table>

          
<div className="preview-summary">

  <p>
    <strong>Items:</strong>
    {" "}
    {
      otherRows.filter(
        r => parseFloat(r.total) > 0
      ).length
    }
  </p>

  <p>
    <strong>Other Total:</strong>
    {" "}
    ₹{otherTotal.toFixed(2)}
  </p>

</div>
          </div>
        )}

        {/* ================= FINAL ================= */}

        <div className="final-preview-total">

          FINAL GRAND TOTAL

          <span>
            ₹{finalGrandTotal.toFixed(2)}
          </span>

        </div>

      </div>
    </div>
  );
}