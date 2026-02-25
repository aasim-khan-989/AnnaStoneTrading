

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import React, { useState, useRef } from "react";
import "./App.css";
import GraniteCalculator from "./components/GraniteCalculator";

function App() {
  const createRows = (count = 10) =>
    Array.from({ length: count }, () => ({
      lengthFt: "",
      lengthIn: "",
      breadthFt: "",
      breadthIn: "",
      qty: 1,
      sqft: 0
    }));


  const [calculatorType, setCalculatorType] = useState("");
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

  /* ---------- AUTO FOCUS LOGIC ---------- */
  const inputRefs = useRef([]);

  const focusNext = (index) => {
    if (inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const autoJump = (value, refIndex) => {
    if (value === " " || value.length >= 3) {
      focusNext(refIndex);
    }
  };
  /* -------------------------------------- */

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

    const tableColumn = ["Length", "Breadth", "Qty", "Sq Ft"];

    const tableRows = [];

    rows.forEach((row) => {
      if (parseFloat(row.sqft) > 0) {
        tableRows.push([
          `${row.lengthFt}' ${row.lengthIn}"`,
          `${row.breadthFt}' ${row.breadthIn}"`,
          row.qty,
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
    const qty = parseFloat(updatedRows[index].qty) || 1;


    if (lft || lin || bft || bin) {
      const L = lft * 12 + lin + 1;
      const B = bft * 12 + bin + 1;
      updatedRows[index].sqft = (((L * B) / 144) * qty).toFixed(2);
    } else updatedRows[index].sqft = 0;

    setRows(updatedRows);
  };

  const addRow = () =>
    setRows([
      ...rows,
      { lengthFt: "", lengthIn: "", breadthFt: "", breadthIn: "", qty: 1, sqft: 0 }

    ]);

  const deleteRow = (i) => setRows(rows.filter((_, idx) => idx !== i));

  const totalSqft = rows.reduce((s, r) => s + parseFloat(r.sqft || 0), 0);
  const grandTotal = totalSqft * (parseFloat(rate) || 0);

  return (
    <div className="container">

    
<div className="app-header">

<h1 className="app-title">

🪨 ANNA STONE

</h1>

<p className="app-subtitle">

Smart Stone Area Calculator • Fast Billing • Accurate Measurement

</p>

</div>


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

      {/* CALCULATOR SELECTOR */}

      <div className="calculator-selector">

        <h3>Select Calculator</h3>

        <div className="calculator-grid">

          <div
            className={`calculator-card ${calculatorType === "granite" ? "active" : ""}`}
            onClick={() => setCalculatorType("granite")}
          >

            🪨
            <h4>Granite</h4>
            <p>Stone Pieces Calculator</p>

          </div>


          <div
            className={`calculator-card ${calculatorType === "kadappa" ? "active" : ""}`}
            onClick={() => setCalculatorType("kadappa")}
          >

            🧱
            <h4>Kadappa</h4>
            <p>Coming Soon</p>

          </div>


          <div
            className={`calculator-card ${calculatorType === "tiles" ? "active" : ""}`}
            onClick={() => setCalculatorType("tiles")}
          >

            ⬜
            <h4>Tiles</h4>
            <p>Area Tiles Calculator</p>

          </div>

        </div>

      </div>

      {/* TABLE */}

      {calculatorType === "granite" && (

        <GraniteCalculator

          rows={rows}
          handleChange={handleChange}
          inputRefs={inputRefs}
          autoJump={autoJump}
          focusNext={focusNext}
          deleteRow={deleteRow}
          addRow={addRow}
          rate={rate}
          setRate={setRate}
          totalSqft={totalSqft}
          grandTotal={grandTotal}
          downloadPDF={downloadPDF}

        />

      )}








    </div>
  );
}

export default App;
