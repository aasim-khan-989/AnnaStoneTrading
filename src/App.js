
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

  const [stoneType, setStoneType] = useState("");
const [customStoneType, setCustomStoneType] = useState("");

const popularStones = [
  "Granite",
  "Granite - Pearl Black",
  "Granite - Z Black",
  "Granite - telephone Black",
  "Granite - Steal Black",
  "Kadapa Stone ",


];



  const [rows, setRows] = useState(createRows());
  const [rate, setRate] = useState("");

  // ================= PDF =================
const downloadPDF = () => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("ANNA STONE - Granite Invoice", 14, 20);

  doc.setFontSize(12);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 30);

  const finalStoneType = stoneType === "custom" ? customStoneType : stoneType;
  if (finalStoneType) {
    doc.text(`Stone Type: ${finalStoneType}`, 14, 38);
  } // ✅ close the if block here

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

  autoTable(doc, {
    startY: 46, // leave space for Stone Type
    head: [tableColumn],
    body: tableRows
  });

  const finalY = doc.lastAutoTable.finalY || 40;

  doc.text(`Total Sq Ft: ${totalSqft.toFixed(2)}`, 14, finalY + 10);
  doc.text(`Rate: Rs. ${rate}`, 14, finalY + 18);
  doc.text(`Grand Total: Rs. ${grandTotal.toFixed(2)}`, 14, finalY + 26);

  doc.save("Granite_Invoice.pdf");
};

  // ================= CALCULATION =================
  const handleChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;

    const lengthFt = parseFloat(updatedRows[index].lengthFt) || 0;
    const lengthIn = parseFloat(updatedRows[index].lengthIn) || 0;
    const breadthFt = parseFloat(updatedRows[index].breadthFt) || 0;
    const breadthIn = parseFloat(updatedRows[index].breadthIn) || 0;

    if (lengthFt || lengthIn || breadthFt || breadthIn) {
      const totalLengthInches = lengthFt * 12 + lengthIn + 1;
      const totalBreadthInches = breadthFt * 12 + breadthIn + 1;

      const sqft = (totalLengthInches * totalBreadthInches) / 144;
      updatedRows[index].sqft = sqft.toFixed(2);
    } else {
      updatedRows[index].sqft = 0;
    }

    setRows(updatedRows);
  };

  const addRow = () => {
    setRows([
      ...rows,
      {
        lengthFt: "",
        lengthIn: "",
        breadthFt: "",
        breadthIn: "",
        sqft: 0
      }
    ]);
  };

  const deleteRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };

  const totalSqft = rows.reduce(
    (sum, row) => sum + parseFloat(row.sqft || 0),
    0
  );

  const grandTotal = totalSqft * (parseFloat(rate) || 0);

  // ================= UI =================
  return (
    <div className="container">
      <h1>ANNA STONE TRADING CALCULATOR</h1>

    <div className="top-row">
  <div className="stone-type-wrapper">
    <h2>Stone Type</h2>
    <select
      value={stoneType}
      onChange={(e) => setStoneType(e.target.value)}
    >
      <option value="">Select Stone</option>
      {popularStones.map((stone, i) => (
        <option key={i} value={stone}>{stone}</option>
      ))}
      <option value="custom">Custom</option>
    </select>

    {stoneType === "custom" && (
      <input
        type="text"
        placeholder="Enter stone name"
        value={customStoneType}
        onChange={(e) => setCustomStoneType(e.target.value)}
      />
    )}
  </div>
</div>


      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th colSpan="2">Length</th>
              <th>×</th>
              <th colSpan="2">Breadth</th>
              <th>Sq Ft</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="number"
                    value={row.lengthFt}
                    onChange={(e) =>
                      handleChange(index, "lengthFt", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={row.lengthIn}
                    onChange={(e) =>
                      handleChange(index, "lengthIn", e.target.value)
                    }
                  />
                </td>

                <td className="multiply">×</td>

                <td>
                  <input
                    type="number"
                    value={row.breadthFt}
                    onChange={(e) =>
                      handleChange(index, "breadthFt", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={row.breadthIn}
                    onChange={(e) =>
                      handleChange(index, "breadthIn", e.target.value)
                    }
                  />
                </td>

                <td className="sqft-cell">{row.sqft}</td>

                <td>
                  <button
                    className="delete-btn"
                    onClick={() => deleteRow(index)}
                  >
                    ❌
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="button-row">
        <button className="add-btn" onClick={addRow}>
          ➕ Add New Piece
        </button>

        <button className="pdf-btn" onClick={downloadPDF}>
          📄 Download Invoice PDF
        </button>
      </div>
      <div className="summary-box">

  {/* <h2>Stone Type</h2>
  <select
    value={stoneType}
    onChange={(e) => setStoneType(e.target.value)}
  >
    <option value="">Select Stone</option>
    {popularStones.map((stone, i) => (
      <option key={i} value={stone}>{stone}</option>
    ))}
    <option value="custom">Custom</option>
  </select> */}
{/* 
  {stoneType === "custom" && (
    <input
      type="text"
      placeholder="Enter stone name"
      value={customStoneType}
      onChange={(e) => setCustomStoneType(e.target.value)}
      style={{ marginTop: "5px", width: "100%" }}
    />
  )} */}





</div>


      <div className="summary">
        <div className="summary-box">
          <h2>Total Sq Ft</h2>
          <p>{totalSqft.toFixed(2)}</p>
        </div>

        <div className="summary-box">
          <h2>Rate (₹ / Sq Ft)</h2>
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
          />
        </div>

        <div className="summary-box total-amount">
          <h2>Grand Total</h2>
          <p>₹ {grandTotal.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}

export default App;
