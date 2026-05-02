
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
                <td>
                  <textarea
                    className="calc-input"
                    rows="2"
                    value={row.particular}
                    onChange={(e) =>
                      handleChange(
                        i,
                        "particular",
                        e.target.value
                      )
                    }
                  />
                </td>

                <td>
                  <input
                    className="calc-input"
                    value={row.qty}
                    onChange={(e) =>
                      handleChange(
                        i,
                        "qty",
                        e.target.value
                      )
                    }
                  />
                </td>

                <td>
                  <input
                    className="calc-input"
                    value={row.rate}
                    onChange={(e) =>
                      handleChange(
                        i,
                        "rate",
                        e.target.value
                      )
                    }
                  />
                </td>

                <td>{row.total}</td>

                <td>
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