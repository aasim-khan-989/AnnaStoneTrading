
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import React, { useState } from "react";
import "./App.css";

function App() {
  const createRows = (count = 10) =>
    Array.from({ length: count }, () => ({
      lengthFt: "",
      lengthIn: "",
      breadthFt: "",
      breadthIn: "",
      sqft: 0
    }));

  const [customerName, setCustomerName] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [stoneType, setStoneType] = useState("");
  const [customStoneType, setCustomStoneType] = useState("");

  const popularStones = [
    "Granite",
    "Granite - Pearl Black",
    "Granite - Z Black",
    "Granite - Telephone Black",
    "Granite - Steel Black",
    "Kadapa Stone"
  ];

  const [rows, setRows] = useState(createRows());
  const [rate, setRate] = useState("");

  // ================= PDF =================
  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("ANNA STONE - Invoice", 14, 20);

    doc.setFontSize(12);
    doc.text(`Customer: ${customerName || "-"}`, 14, 30);
    doc.text(`Date: ${invoiceDate}`, 14, 38);

    const finalStoneType =
      stoneType === "custom" ? customStoneType : stoneType;
    if (finalStoneType)
      doc.text(`Stone Type: ${finalStoneType}`, 14, 46);

    const tableColumn = ["Length", "Breadth", "Sq Ft"];
    const tableRows = [];

    rows.forEach((row) => {
      if (parseFloat(row.sqft) > 0) {
        tableRows.push([
          `${row.lengthFt}' ${row.lengthIn}"`,
          `${row.breadthFt}' ${row.breadthIn}"`,
          row.sqft
        ]);
      }
    });

    autoTable(doc, { startY: 54, head: [tableColumn], body: tableRows });

    const finalY = doc.lastAutoTable.finalY || 60;

    doc.text(`Total Sq Ft: ${totalSqft.toFixed(2)}`, 14, finalY + 10);
    doc.text(`Rate: ₹ ${rate}`, 14, finalY + 18);
    doc.text(`Grand Total: ₹ ${grandTotal.toFixed(2)}`, 14, finalY + 26);

    doc.save("Stone_Invoice.pdf");
  };

  // ================= CALC =================
  const handleChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;

    const lft = parseFloat(updatedRows[index].lengthFt) || 0;
    const lin = parseFloat(updatedRows[index].lengthIn) || 0;
    const bft = parseFloat(updatedRows[index].breadthFt) || 0;
    const bin = parseFloat(updatedRows[index].breadthIn) || 0;

    if (lft || lin || bft || bin) {
      const L = lft * 12 + lin + 1;
      const B = bft * 12 + bin + 1;
      updatedRows[index].sqft = ((L * B) / 144).toFixed(2);
    } else updatedRows[index].sqft = 0;

    setRows(updatedRows);
  };

  const addRow = () =>
    setRows([
      ...rows,
      { lengthFt: "", lengthIn: "", breadthFt: "", breadthIn: "", sqft: 0 }
    ]);

  const deleteRow = (i) => setRows(rows.filter((_, idx) => idx !== i));

  const totalSqft = rows.reduce((s, r) => s + parseFloat(r.sqft || 0), 0);
  const grandTotal = totalSqft * (parseFloat(rate) || 0);

  return (
    <div className="container">
      <h1>ANNA STONE CALCULATOR</h1>

      {/* HEADER */}
      <div className="client-wrapper">
        <div className="client-field">
          <label>Customer Name</label>
          <input
            className="full-input"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
        </div>

        <div className="client-field">
          <label>Date</label>
          <input
            className="full-input"
            type="date"
            value={invoiceDate}
            onChange={(e) => setInvoiceDate(e.target.value)}
          />
        </div>
      </div>

      {/* STONE TYPE */}
      <div className="stone-type-wrapper">
        <label>Stone Type</label>
        <select
          className="full-input"
          value={stoneType}
          onChange={(e) => setStoneType(e.target.value)}
        >
          <option value="">Select</option>
          {popularStones.map((s, i) => (
            <option key={i}>{s}</option>
          ))}
          <option value="custom">Custom</option>
        </select>

        {stoneType === "custom" && (
          <input
            className="full-input"
            placeholder="Enter stone"
            value={customStoneType}
            onChange={(e) => setCustomStoneType(e.target.value)}
          />
        )}
      </div>

      {/* TABLE */}
      <div className="table-wrapper">
        <table>
          <thead>
      <tr>
        <th colSpan="2">Length</th>
        <th rowSpan="2">×</th>
        <th colSpan="2">Breadth</th>
        <th rowSpan="2">Sq Ft</th>
        <th rowSpan="2">Action</th>
      </tr>
      <tr>
        <th>Ft</th>
        <th>In</th>
        <th>Ft</th>
        <th>In</th>
      </tr>
    </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                <td>
                  <input
                    className="calc-input"
                    placeholder="Ft"
                    value={row.lengthFt}
                    onChange={(e) =>
                      handleChange(i, "lengthFt", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    className="calc-input"
                    placeholder="In"
                    value={row.lengthIn}
                    onChange={(e) =>
                      handleChange(i, "lengthIn", e.target.value)
                    }
                  />
                </td>
                <td>×</td>
                <td>
                  <input
                    className="calc-input"
                    placeholder="Ft"
                    value={row.breadthFt}
                    onChange={(e) =>
                      handleChange(i, "breadthFt", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    className="calc-input"
                    placeholder="In"
                    value={row.breadthIn}
                    onChange={(e) =>
                      handleChange(i, "breadthIn", e.target.value)
                    }
                  />
                </td>
                <td>{row.sqft}</td>
                <td>
                  <button onClick={() => deleteRow(i)}>❌</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
            <button className="add-btn" onClick={addRow}>Add Piece</button>

          <div className="summary-box">
            <label>Rate (₹ / Sq Ft)</label>
            <input
              className="rate-input"
              placeholder="Enter rate"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
            />

            <p>Total Sq Ft: {totalSqft.toFixed(2)}</p>
            <h2>Grand Total ₹ {grandTotal.toFixed(2)}</h2>
          </div>

          <button className="pdf-btn" onClick={downloadPDF}>Download PDF</button>

              </div>
            );
          }

export default App;
