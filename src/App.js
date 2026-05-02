
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import React, { useRef, useState } from "react";
import "./App.css";

import GraniteCalculator from "./components/GraniteCalculator";
import KadapaCalculator from "./components/KadapaCalculator";
import KotaCalculator from "./components/KotaCalculator";
import OtherCalculator from "./components/OtherCalculator";

export default function App() {
  const createRows = (count = 10) =>
    Array.from({ length: count }, () => ({
      lengthFt: "",
      lengthIn: "",
      breadthFt: "",
      breadthIn: "",
      qty: 1,
      sqft: 0,
    }));

  const inputRefs = useRef([]);

  /* =========================
     COMMON
  ========================= */
  const [calculatorType, setCalculatorType] = useState("granite");

  const [customerName, setCustomerName] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [stoneType, setStoneType] = useState("");
  const [customStoneType, setCustomStoneType] = useState("");

  const [kotaRows, setKotaRows] = useState(createRows());
  const [kotaRate, setKotaRate] = useState("");

  const [otherRows, setOtherRows] =
    useState([
      {
        particular: "",
        qty: 1,
        rate: "",
        total: 0
      }
    ]);

  const popularStones = [
    "Granite",
    "Granite - Pearl Black",
    "Granite - Z Black",
    "Granite - Telephone Black",
    "Granite - Steel Black",
    "Kadapa Stone",
  ];

  /* =========================
     GRANITE DATA
  ========================= */
  const [graniteRows, setGraniteRows] = useState(createRows());
  const [graniteRate, setGraniteRate] = useState("");

  /* =========================
     KADAPA DATA
  ========================= */
  const [kadapaRows, setKadapaRows] = useState(createRows());
  const [kadapaRate, setKadapaRate] = useState("");



  /* =========================
     COMMON HELPERS
  ========================= */
  const addRow = (rows, setRows) => {
    setRows([
      ...rows,
      {
        lengthFt: "",
        lengthIn: "",
        breadthFt: "",
        breadthIn: "",
        qty: 1,
        sqft: 0,
      },
    ]);
  };

  const deleteRow = (rows, setRows, index) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  /* =========================
     GRANITE FORMULA
     +1 inch each side
  ========================= */
  const handleGraniteChange = (index, field, value) => {
    const updated = [...graniteRows];
    updated[index][field] = value;

    const lft = parseFloat(updated[index].lengthFt) || 0;
    const lin = parseFloat(updated[index].lengthIn) || 0;
    const bft = parseFloat(updated[index].breadthFt) || 0;
    const bin = parseFloat(updated[index].breadthIn) || 0;
    const qty = parseFloat(updated[index].qty) || 1;

    if (lft || lin || bft || bin) {
      const L = lft * 12 + lin + 1;
      const B = bft * 12 + bin + 1;

      updated[index].sqft = (((L * B) / 144) * qty).toFixed(2);
    } else {
      updated[index].sqft = 0;
    }

    setGraniteRows(updated);
  };


  /* =========================
     KADAPA FORMULA
     1-6 = 6
     7-12 = 12
     13-18 = 18 etc
  ========================= */
  const kadapaRound = (inch) => {
    if (inch <= 0) return 0;

    if (inch >= 1 && inch <= 5) return 6;

    return Math.floor(inch / 6) * 6 + 6;
  };

  const handleKadapaChange = (index, field, value) => {
    const updated = [...kadapaRows];
    updated[index][field] = value;

    const lft = parseFloat(updated[index].lengthFt) || 0;
    const lin = parseFloat(updated[index].lengthIn) || 0;
    const bft = parseFloat(updated[index].breadthFt) || 0;
    const bin = parseFloat(updated[index].breadthIn) || 0;
    const qty = parseFloat(updated[index].qty) || 1;

    const rawL = lft * 12 + lin;
    const rawB = bft * 12 + bin;

    const L = kadapaRound(rawL);
    const B = kadapaRound(rawB);

    updated[index].sqft = (((L * B) / 144) * qty).toFixed(2);

    setKadapaRows(updated);
  };

  const handleKotaChange = (index, field, value) => {
    const updated = [...kotaRows];
    updated[index][field] = value;

    const lft = parseFloat(updated[index].lengthFt) || 0;
    const lin = parseFloat(updated[index].lengthIn) || 0;
    const bft = parseFloat(updated[index].breadthFt) || 0;
    const bin = parseFloat(updated[index].breadthIn) || 0;
    const qty = parseFloat(updated[index].qty) || 1;

    const rawL = lft * 12 + lin;
    const rawB = bft * 12 + bin;

    const L = kadapaRound(rawL);
    const B = kadapaRound(rawB);

    updated[index].sqft = (((L * B) / 144) * qty).toFixed(2);

    setKotaRows(updated);
  };

  const handleOtherChange = (
    index,
    field,
    value
  ) => {
    const updated = [...otherRows];

    updated[index][field] = value;

    const qty =
      parseFloat(updated[index].qty) || 0;

    const rate =
      parseFloat(updated[index].rate) || 0;

    updated[index].total = (
      qty * rate
    ).toFixed(2);

    setOtherRows(updated);
  };

  /* =========================
     TOTALS
  ========================= */
  const graniteSqft = graniteRows.reduce(
    (sum, row) => sum + parseFloat(row.sqft || 0),
    0
  );

  const graniteTotal =
    graniteSqft * (parseFloat(graniteRate) || 0);

  const kadapaSqft = kadapaRows.reduce(
    (sum, row) => sum + parseFloat(row.sqft || 0),
    0
  );

  const kadapaTotal =
    kadapaSqft * (parseFloat(kadapaRate) || 0);




  const kotaSqft = kotaRows.reduce(
    (sum, row) => sum + parseFloat(row.sqft || 0),
    0
  );

  const kotaTotal =
    kotaSqft * (parseFloat(kotaRate) || 0);

  const otherTotal =
    otherRows.reduce(
      (sum, row) =>
        sum +
        parseFloat(row.total || 0),
      0
    );

  const finalGrandTotal =
    graniteTotal +
    kadapaTotal +
    kotaTotal +
    otherTotal
  /* =========================
     PDF
  ========================= */
  const generatePDFBlob = () => {
    const doc = new jsPDF({
      unit: "mm",
      format: "a4",
    });

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("ANNA STONE ESTIMATE", 14, 18);

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");

    doc.text(`Customer : ${customerName || "-"}`, 14, 28);
    doc.text(`Date : ${invoiceDate}`, 14, 35);

    const finalStone =
      stoneType === "custom"
        ? customStoneType
        : stoneType;

    if (finalStone) {
      doc.text(`Stone Type : ${finalStone}`, 14, 42);
    }

    let currentY = 50;

    /* GRANITE SECTION */
    const graniteBody = [];

    graniteRows.forEach((row) => {
      if (parseFloat(row.sqft) > 0) {
        graniteBody.push([
          `${row.lengthFt || 0}' ${row.lengthIn || 0}"`,
          `${row.breadthFt || 0}' ${row.breadthIn || 0}"`,
          row.qty,
          row.sqft,
        ]);
      }
    });

    if (graniteBody.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.text("GRANITE", 14, currentY);

      autoTable(doc, {
        startY: currentY + 3,
        head: [["Length", "Breadth", "Qty", "Sq Ft"]],
        body: graniteBody,
      });

      currentY = doc.lastAutoTable.finalY + 8;

      doc.text(
        `Granite Rate : Rs ${graniteRate || 0}`,
        14,
        currentY
      );
      doc.text(
        `Granite Total : Rs ${graniteTotal.toFixed(2)}`,
        110,
        currentY
      );

      currentY += 10;
    }

    /* KADAPA SECTION */

    /* KADAPA SECTION */
    const kadapaBody = [];

    kadapaRows.forEach((row) => {
      if (parseFloat(row.sqft) > 0) {
        kadapaBody.push([
          `${row.lengthFt || 0}' ${row.lengthIn || 0}"`,
          `${row.breadthFt || 0}' ${row.breadthIn || 0}"`,
          row.qty,
          row.sqft,
        ]);
      }
    });

    if (kadapaBody.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.text("KADAPA", 14, currentY);

      autoTable(doc, {
        startY: currentY + 3,
        head: [["Length", "Breadth", "Qty", "Sq Ft"]],
        body: kadapaBody,
      });

      currentY = doc.lastAutoTable.finalY + 8;

      doc.text(`Kadapa Rate : Rs ${kadapaRate || 0}`, 14, currentY);
      doc.text(
        `Kadapa Total : Rs ${kadapaTotal.toFixed(2)}`,
        110,
        currentY
      );

      currentY += 12;
    }

    /* KOTA SECTION */
    const kotaBody = [];

    kotaRows.forEach((row) => {
      if (parseFloat(row.sqft) > 0) {
        kotaBody.push([
          `${row.lengthFt || 0}' ${row.lengthIn || 0}"`,
          `${row.breadthFt || 0}' ${row.breadthIn || 0}"`,
          row.qty,
          row.sqft,
        ]);
      }
    });

    if (kotaBody.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.text("KOTA", 14, currentY);

      autoTable(doc, {
        startY: currentY + 3,
        head: [["Length", "Breadth", "Qty", "Sq Ft"]],
        body: kotaBody,
      });

      currentY = doc.lastAutoTable.finalY + 8;

      doc.text(`Kota Rate : Rs ${kotaRate || 0}`, 14, currentY);
      doc.text(
        `Kota Total : Rs ${kotaTotal.toFixed(2)}`,
        110,
        currentY
      );

      currentY += 12;
    }


    const otherBody = [];

    otherRows.forEach((row) => {
      if (parseFloat(row.total) > 0) {
        otherBody.push([
          row.particular,
          row.qty,
          row.rate,
          row.total
        ]);
      }
    });

    if (otherBody.length > 0) {
      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.text(
        "OTHER",
        14,
        currentY
      );

      autoTable(doc, {
        startY: currentY + 3,
        head: [[
          "Particular",
          "Qty",
          "Rate",
          "Total"
        ]],
        body: otherBody
      });

      currentY =
        doc.lastAutoTable.finalY + 10;
    }
    /* FINAL TOTAL */
    doc.setFontSize(14);
    doc.text(
      `FINAL GRAND TOTAL : Rs ${finalGrandTotal.toFixed(
        2
      )}`,
      14,
      currentY
    );

    return doc.output("blob");
  };

  const downloadPDF = () => {
    const blob = generatePDFBlob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "AnnaStone_Estimate.pdf";
    a.click();

    URL.revokeObjectURL(url);
  };

  const shareWhatsAppPDF = async () => {
    const blob = generatePDFBlob();

    const file = new File(
      [blob],
      "AnnaStone_Estimate.pdf",
      {
        type: "application/pdf",
      }
    );

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Anna Stone Estimate",
          files: [file],
        });
      } catch (e) { }
    } else {
      alert("Sharing only supported on mobile.");
    }
  };

  return (
    <div className="container">
      <div className="app-header">
        <h1 className="app-title">
          🪨 ANNA STONE
        </h1>

        <p className="app-subtitle">
          Smart Stone Area Calculator
        </p>
      </div>

      {/* CUSTOMER */}
      <div className="client-wrapper">
        <div className="client-field">
          <label>Customer Name</label>
          <input
            className="full-input"
            value={customerName}
            onChange={(e) =>
              setCustomerName(e.target.value)
            }
          />
        </div>

        <div className="client-field">
          <label>Date</label>
          <input
            type="date"
            className="full-input"
            value={invoiceDate}
            onChange={(e) =>
              setInvoiceDate(e.target.value)
            }
          />
        </div>
      </div>

      {/* STONE */}
      <div className="stone-type-wrapper">
        <label>Stone Type</label>

        <select
          className="full-input"
          value={stoneType}
          onChange={(e) =>
            setStoneType(e.target.value)
          }
        >
          <option value="">Select</option>

          {popularStones.map((stone, i) => (
            <option key={i}>{stone}</option>
          ))}

          <option value="custom">
            Custom
          </option>
        </select>

        {stoneType === "custom" && (
          <input
            className="full-input"
            placeholder="Enter stone"
            value={customStoneType}
            onChange={(e) =>
              setCustomStoneType(
                e.target.value
              )
            }
          />
        )}
      </div>

      {/* SELECTOR */}
      <div className="calculator-selector">
        <h3>Select Calculator</h3>

        <div className="calculator-grid">
          <div
            className={`calculator-card ${calculatorType === "granite"
              ? "active"
              : ""
              }`}
            onClick={() =>
              setCalculatorType("granite")
            }
          >
            🪨
            <h4>Granite</h4>
          </div>

          <div
            className={`calculator-card ${calculatorType === "kadapa"
              ? "active"
              : ""
              }`}
            onClick={() =>
              setCalculatorType("kadapa")
            }
          >
            🧱
            <h4>Kadapa</h4>
          </div>

          <div
            className={`calculator-card ${calculatorType === "kota" ? "active" : ""
              }`}
            onClick={() => setCalculatorType("kota")}
          >
            🟫
            <h4>Kota</h4>
          </div>

          <div
            className={`calculator-card ${calculatorType === "other"
                ? "active"
                : ""
              }`}
            onClick={() =>
              setCalculatorType("other")
            }
          >
            📦
            <h4>Other</h4>
          </div>
        </div>
      </div>

      {/* GRANITE */}
      {calculatorType === "granite" && (
        <GraniteCalculator
          rows={graniteRows}
          handleChange={handleGraniteChange}
          inputRefs={inputRefs}
          deleteRow={(i) =>
            deleteRow(
              graniteRows,
              setGraniteRows,
              i
            )
          }
          addRow={() =>
            addRow(
              graniteRows,
              setGraniteRows
            )
          }
          rate={graniteRate}
          setRate={setGraniteRate}
          totalSqft={graniteSqft}
          grandTotal={graniteTotal}
        />
      )}

      {/* KADAPA */}
      {calculatorType === "kadapa" && (
        <KadapaCalculator
          rows={kadapaRows}
          handleChange={handleKadapaChange}
          inputRefs={inputRefs}
          deleteRow={(i) =>
            deleteRow(
              kadapaRows,
              setKadapaRows,
              i
            )
          }
          addRow={() =>
            addRow(
              kadapaRows,
              setKadapaRows
            )
          }
          rate={kadapaRate}
          setRate={setKadapaRate}
          totalSqft={kadapaSqft}
          grandTotal={kadapaTotal}
        />
      )}

      {calculatorType === "kota" && (
        <KotaCalculator
          rows={kotaRows}
          handleChange={handleKotaChange}
          inputRefs={inputRefs}
          deleteRow={(i) =>
            deleteRow(kotaRows, setKotaRows, i)
          }
          addRow={() =>
            addRow(kotaRows, setKotaRows)
          }
          rate={kotaRate}
          setRate={setKotaRate}
          totalSqft={kotaSqft}
          grandTotal={kotaTotal}
        />
      )}

      {calculatorType === "other" && (
        <OtherCalculator
          rows={otherRows}
          handleChange={
            handleOtherChange
          }
          addRow={() =>
            setOtherRows([
              ...otherRows,
              {
                particular: "",
                qty: 1,
                rate: "",
                total: 0
              }
            ])
          }
          deleteRow={(i) =>
            setOtherRows(
              otherRows.filter(
                (_, x) => x !== i
              )
            )
          }
          totalAmount={otherTotal}
        />
      )}

      {/* ONE FINAL BUTTONS */}
      <button
        className="pdf-btn"
        onClick={downloadPDF}
      >
        Download Final Estimate
      </button>

      <button
        className="whatsapp-btn"
        onClick={shareWhatsAppPDF}
      >
        🟢 Share Final Estimate
      </button>
    </div>
  );
}