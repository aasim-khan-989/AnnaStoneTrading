
import React from "react";

export default function OtherCalculator({
  rows,
  handleChange,
  addRow,
  deleteRow,
  totalAmount
}) {
  return (
    <>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th style={{ width: "45%" }}>
                Particular
              </th>
              <th>Qty</th>
              <th>Rate</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                {/* PARTICULAR */}
                <td>
                  <textarea
                    className="other-textarea"
                    rows="1"
                    value={row.particular}
                    onChange={(e) =>
                      handleChange(
                        i,
                        "particular",
                        e.target.value
                      )
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();

                        const qtyInputs =
                          document.querySelectorAll(
                            ".qty-nav"
                          );

                        if (qtyInputs[i]) {
                          qtyInputs[i].focus();
                        }
                      }
                    }}
                  />
                </td>

                {/* QTY */}
                <td>
              <input
  className="calc-input qty-nav"
  value={row.qty}
  onFocus={(e) => e.target.select()}
  onChange={(e) =>
    handleChange(
      i,
      "qty",
      e.target.value
    )
  }
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const rateInputs =
        document.querySelectorAll(
          ".rate-nav"
        );

      if (rateInputs[i]) {
        rateInputs[i].focus();
      }
    }
  }}
/>
                </td>

                {/* RATE */}
                <td>
                  <input
                    className="calc-input rate-nav"
                    value={row.rate}
                    onChange={(e) =>
                      handleChange(
                        i,
                        "rate",
                        e.target.value
                      )
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();

                        const nextParticular =
                          document.querySelectorAll(
                            ".other-textarea"
                          );

                        if (
                          nextParticular[i + 1]
                        ) {
                          nextParticular[
                            i + 1
                          ].focus();
                        } else {
                          addRow();

                          setTimeout(() => {
                            const updated =
                              document.querySelectorAll(
                                ".other-textarea"
                              );

                            if (
                              updated[
                                i + 1
                              ]
                            ) {
                              updated[
                                i + 1
                              ].focus();
                            }
                          }, 100);
                        }
                      }
                    }}
                  />
                </td>

                {/* TOTAL */}
                <td>{row.total}</td>

                {/* DELETE */}
                <td>
                  <button
                    className="delete-btn"
                    onClick={() =>
                      deleteRow(i)
                    }
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        className="add-btn"
        onClick={addRow}
      >
        Add Item
      </button>

      <div className="grand-total">
        Other Total ₹
        <span>
          {totalAmount.toFixed(2)}
        </span>
      </div>
    </>
  );
}