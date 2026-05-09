
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import React, { useRef, useState } from "react";
import "./App.css";
import EstimatePreview from "../src/components/EstimatePreview";

import GraniteCalculator from "./components/GraniteCalculator";
import KadapaCalculator from "./components/KadapaCalculator";
import KotaCalculator from "./components/KotaCalculator";
import OtherCalculator from "./components/OtherCalculator";

export default function App() {
  /* =========================
     ROW HELPERS
  ========================= */
  const createRows = (count = 15) =>
    Array.from({ length: count }, () => ({
      lengthFt: "",
      lengthIn: "",
      breadthFt: "",
      breadthIn: "",
      qty: 1,
      sqft: 0,
    }));

  const createOtherRows = (count = 10) =>
    Array.from({ length: count }, () => ({
      particular: "",
      qty: 1,
      rate: "",
      total: 0,
    }));

  const inputRefs = useRef([]);

  /* =========================
     COMMON
  ========================= */
  const [calculatorType, setCalculatorType] =
    useState("granite");

    const [showPreview, setShowPreview] = useState(false);

  const [customerName, setCustomerName] =
    useState("");

  const [phoneNumber, setPhoneNumber] =
    useState("");

  const [invoiceDate, setInvoiceDate] =
    useState(
      new Date()
        .toISOString()
        .split("T")[0]
    );



 

  /* =========================
     DATA
  ========================= */
const [graniteList, setGraniteList] = useState([]);
const [activeGranite, setActiveGranite] = useState(null);

  const [kadapaRows, setKadapaRows] =
    useState(createRows());

  const [kadapaRate, setKadapaRate] =
    useState("");

  const [kotaRows, setKotaRows] =
    useState(createRows());

  const [kotaRate, setKotaRate] =
    useState("");

  const [otherRows, setOtherRows] =
    useState(createOtherRows());

  /* =========================
     HELPERS
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

  const deleteRow = (
    rows,
    setRows,
    index
  ) => {
    setRows(
      rows.filter(
        (_, i) => i !== index
      )
    );
  };

  /* =========================
     GRANITE FORMULA
  ========================= */

  /* =========================
     KADAPA / KOTA
  ========================= */
  const kadapaRound = (
    inch
  ) => {
    if (inch <= 0)
      return 0;

    if (
      inch >= 1 &&
      inch <= 5
    )
      return 6;

    return (
      Math.floor(
        inch / 6
      ) *
        6 +
      6
    );
  };

  const handleKadapaChange = (
    index,
    field,
    value
  ) => {
    const updated = [
      ...kadapaRows,
    ];

    updated[index][field] = value;

    const lft =
      parseFloat(
        updated[index].lengthFt
      ) || 0;

    const lin =
      parseFloat(
        updated[index].lengthIn
      ) || 0;

    const bft =
      parseFloat(
        updated[index]
          .breadthFt
      ) || 0;

    const bin =
      parseFloat(
        updated[index]
          .breadthIn
      ) || 0;

    const qty =
      parseFloat(
        updated[index].qty
      ) || 1;

    const rawL =
      lft * 12 + lin;

    const rawB =
      bft * 12 + bin;

    const L =
      kadapaRound(rawL);

    const B =
      kadapaRound(rawB);

    updated[index].sqft = (
      ((L * B) / 144) *
      qty
    ).toFixed(2);

    setKadapaRows(updated);
  };

  const handleKotaChange = (
    index,
    field,
    value
  ) => {
    const updated = [
      ...kotaRows,
    ];

    updated[index][field] = value;

    const lft =
      parseFloat(
        updated[index].lengthFt
      ) || 0;

    const lin =
      parseFloat(
        updated[index].lengthIn
      ) || 0;

    const bft =
      parseFloat(
        updated[index]
          .breadthFt
      ) || 0;

    const bin =
      parseFloat(
        updated[index]
          .breadthIn
      ) || 0;

    const qty =
      parseFloat(
        updated[index].qty
      ) || 1;

    const rawL =
      lft * 12 + lin;

    const rawB =
      bft * 12 + bin;

    const L =
      kadapaRound(rawL);

    const B =
      kadapaRound(rawB);

    updated[index].sqft = (
      ((L * B) / 144) *
      qty
    ).toFixed(2);

    setKotaRows(updated);
  };

  /* =========================
     OTHER
  ========================= */
  const handleOtherChange = (
    index,
    field,
    value
  ) => {
    const updated = [
      ...otherRows,
    ];

    updated[index][field] = value;

    const qty =
      parseFloat(
        updated[index].qty
      ) || 0;

    const rate =
      parseFloat(
        updated[index].rate
      ) || 0;

    updated[index].total = (
      qty * rate
    ).toFixed(2);

    setOtherRows(updated);
  };

  /* =========================
     TOTALS
  ========================= */

  const graniteTotal = graniteList.reduce((sum, g) => {
  const sqft = g.rows.reduce(
    (s, r) => s + parseFloat(r.sqft || 0),
    0
  );

  return sum + sqft * (parseFloat(g.rate) || 0);
}, 0);

  

  const kadapaSqft =
    kadapaRows.reduce(
      (sum, row) =>
        sum +
        parseFloat(
          row.sqft || 0
        ),
      0
    );

  const kadapaTotal =
    kadapaSqft *
    (parseFloat(
      kadapaRate
    ) || 0);

  const kotaSqft =
    kotaRows.reduce(
      (sum, row) =>
        sum +
        parseFloat(
          row.sqft || 0
        ),
      0
    );

  const kotaTotal =
    kotaSqft *
    (parseFloat(
      kotaRate
    ) || 0);

  const otherTotal =
    otherRows.reduce(
      (sum, row) =>
        sum +
        parseFloat(
          row.total || 0
        ),
      0
    );

  const finalGrandTotal =( graniteTotal +
    kadapaTotal +
    kotaTotal + otherTotal);

  /* =========================
     PDF
  ========================= */
  const generatePDFBlob =
    () => {
      const doc =
        new jsPDF({
          unit: "mm",
          format: "a4",
        });

      doc.setFontSize(18);
      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.text(
        "ANNA STONE ESTIMATE",
        14,
        18
      );

      doc.setFontSize(11);
      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.text(
        `Customer : ${
          customerName ||
          "-"
        }`,
        14,
        28
      );

      doc.text(
        `Phone : ${
          phoneNumber ||
          "-"
        }`,
        14,
        35
      );

      doc.text(
        `Date : ${invoiceDate}`,
        14,
        42
      );

      // const finalStone =
      //   stoneType ===
      //   "custom"
      //     ? customStoneType
      //     : stoneType;

      // if (finalStone) {
      //   doc.text(
      //     `Stone Type : ${finalStone}`,
      //     14,
      //     49
      //   );
      // }

      let currentY = 57;

      /* GRANITE */

  graniteList.forEach((g) => {
  doc.text(`GRANITE : ${g.name}`, 14, currentY);

  const body = [];

  g.rows.forEach((row) => {
    if (parseFloat(row.sqft) > 0) {
      body.push([
        `${row.lengthFt || 0}' ${row.lengthIn || 0}"`,
        `${row.breadthFt || 0}' ${row.breadthIn || 0}"`,
        row.qty,
        row.sqft
      ]);
    }
  });

  autoTable(doc, {
    startY: currentY + 3,
    head: [["Length","Breadth","Qty","Sq Ft"]],
    body
  });

  currentY = doc.lastAutoTable.finalY + 5;

  const total =
    g.rows.reduce((s,r)=>s+parseFloat(r.sqft||0),0) *
    (parseFloat(g.rate)||0);

  const sqftTotal =
  g.rows.reduce(
    (s, r) =>
      s + parseFloat(r.sqft || 0),
    0
  );

doc.text(
  `Total SqFt : ${sqftTotal.toFixed(2)}`,
  14,
  currentY
);

currentY += 5;

doc.text(
  `Rate : Rs ${g.rate}`,
  14,
  currentY
);

currentY += 5;

doc.text(
  `Total Amount : Rs ${total.toFixed(2)}`,
  14,
  currentY
);

  currentY += 10;
});

      /* KADAPA */
      const kadapaBody =
        [];

      kadapaRows.forEach(
        (row) => {
          if (
            parseFloat(
              row.sqft
            ) > 0
          ) {
            kadapaBody.push(
              [
                `${row.lengthFt || 0}' ${row.lengthIn || 0}"`,
                `${row.breadthFt || 0}' ${row.breadthIn || 0}"`,
                row.qty,
                row.sqft,
              ]
            );
          }
        }
      );

      if (
        kadapaBody.length >
        0
      ) {
        doc.text(
          "KADAPA",
          14,
          currentY
        );

        autoTable(doc, {
          startY:
            currentY + 3,
          head: [[
            "Length",
            "Breadth",
            "Qty",
            "Sq Ft",
          ]],
          body: kadapaBody,
        });

        currentY =
          doc
            .lastAutoTable
            .finalY +
          8;

       doc.text(
  `Total SqFt : ${kadapaSqft.toFixed(2)}`,
  14,
  currentY
);

currentY += 5;

doc.text(
  `Rate : Rs ${kadapaRate || 0}`,
  14,
  currentY
);

currentY += 5;

doc.text(
  `Kadapa Total : Rs ${kadapaTotal.toFixed(2)}`,
  14,
  currentY
);

        currentY += 10;
      }

      /* KOTA */
      const kotaBody =
        [];

      kotaRows.forEach(
        (row) => {
          if (
            parseFloat(
              row.sqft
            ) > 0
          ) {
            kotaBody.push(
              [
                `${row.lengthFt || 0}' ${row.lengthIn || 0}"`,
                `${row.breadthFt || 0}' ${row.breadthIn || 0}"`,
                row.qty,
                row.sqft,
              ]
            );
          }
        }
      );

      if (
        kotaBody.length > 0
      ) {
        doc.text(
          "KOTA",
          14,
          currentY
        );

        autoTable(doc, {
          startY:
            currentY + 3,
          head: [[
            "Length",
            "Breadth",
            "Qty",
            "Sq Ft",
          ]],
          body: kotaBody,
        });

        currentY =
          doc
            .lastAutoTable
            .finalY +
          8;

        doc.text(
          `Kota Total : Rs ${kotaTotal.toFixed(
            2
          )}`,
          14,
          currentY
        );

        currentY += 10;
      }

      /* OTHER */
      const otherBody =
        [];

      otherRows.forEach(
        (row) => {
          if (
            parseFloat(
              row.total
            ) > 0
          ) {
            otherBody.push(
              [
                row.particular,
                row.qty,
                row.rate,
                row.total,
              ]
            );
          }
        }
      );

      if (
        otherBody.length > 0
      ) {
        doc.text(
          "OTHER",
          14,
          currentY
        );

        autoTable(doc, {
          startY:
            currentY + 3,
          head: [[
            "Particular",
            "Qty",
            "Rate",
            "Total",
          ]],
          body: otherBody,
        });

        currentY =
          doc
            .lastAutoTable
            .finalY +
          8;
      }

      doc.text(
  `Other Total : Rs ${otherTotal.toFixed(2)}`,
  14,
  currentY
);

currentY += 10;

      doc.setFontSize(14);

      doc.setFontSize(14);
doc.setFont("helvetica", "bold");

doc.text(
  `FINAL GRAND TOTAL`,
  14,
  currentY
);

doc.text(
  `Rs ${finalGrandTotal.toFixed(2)}`,
  150,
  currentY,
  { align: "right" }
);

      return doc.output(
        "blob"
      );
    };



  const downloadPDF =
    () => {
      const blob =
        generatePDFBlob();

      const url =
        URL.createObjectURL(
          blob
        );

      const a =
        document.createElement(
          "a"
        );

      a.href = url;
      a.download =
        "AnnaStone_Estimate.pdf";

      a.click();

      URL.revokeObjectURL(
        url
      );
    };

  const shareWhatsAppPDF =
    async () => {
      const blob =
        generatePDFBlob();

      const file =
        new File(
          [blob],
          "AnnaStone_Estimate.pdf",
          {
            type: "application/pdf",
          }
        );

      if (
        navigator.share
      ) {
        try {
          await navigator.share(
            {
              title:
                "Anna Stone Estimate",
              files: [file],
            }
          );
        } catch (e) {}
      } else {
        alert(
          "Sharing only supported on mobile."
        );
      }
    };

let activeSqft = 0;
let activeTotal = 0;

if (activeGranite) {
  activeSqft = activeGranite.rows.reduce(
    (sum, row) => sum + parseFloat(row.sqft || 0),
    0
  );

  activeTotal =
    activeSqft *
    (parseFloat(activeGranite.rate) || 0);
}

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
          <label>
            Customer Name
          </label>

          <input
            className="full-input"
            value={
              customerName
            }
            onChange={(e) =>
              setCustomerName(
                e.target.value
              )
            }
          />
        </div>

        <div className="client-field">
          <label>
            Date
          </label>

          <input
            type="date"
            className="full-input"
            value={
              invoiceDate
            }
            onChange={(e) =>
              setInvoiceDate(
                e.target.value
              )
            }
          />
        </div>
      </div>

      {/* PHONE */}
      <div className="stone-type-wrapper">
        <label>
          Phone Number
        </label>

        <input
          className="full-input"
          value={
            phoneNumber
          }
          onChange={(e) =>
            setPhoneNumber(
              e.target.value
            )
          }
        />
      </div>

      {/* STONE */}
      {/* <div className="stone-type-wrapper">
        <label>
          Stone Type
        </label>

        <select
          className="full-input"
          value={stoneType}
          onChange={(e) =>
            setStoneType(
              e.target.value
            )
          }
        >
          <option value="">
            Select
          </option>

          {popularStones.map(
            (
              stone,
              i
            ) => (
              <option
                key={i}
              >
                {stone}
              </option>
            )
          )}

          <option value="custom">
            Custom
          </option>
        </select>

        {stoneType ===
          "custom" && (
          <input
            className="full-input"
            placeholder="Enter stone"
            value={
              customStoneType
            }
            onChange={(e) =>
              setCustomStoneType(
                e.target.value
              )
            }
          />
        )}
      </div> */}




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
      
    {/* GRANITE */}

{calculatorType === "granite" && (
  <>
    <button
      className="add-btn"
      onClick={() =>
        setActiveGranite({
          name: "",
          rate: "",
          rows: createRows()
        })
      }
    >
      + Add Granite
    </button>

    {graniteList.map((g, i) => (

      <div className="saved-item" key={i}>
  <div>
    <b>{g.name}</b>
    <span> ₹{g.rate}</span>
  </div>

  <div className="action-btns">
    <button
      className="edit-btn"
      onClick={() => setActiveGranite({
  ...g,
  rows: g.rows.map(r => ({ ...r }))
})}
    >
      ✏️ Edit
    </button>

    <button
      className="delete-btn"
      onClick={() =>
        setGraniteList(graniteList.filter((_, x) => x !== i))
      }
    >
      🗑 Delete
    </button>
  </div>
</div>
      
    ))}

    

    {activeGranite && (
      <>
       <input
  list="granite-options"
  className="full-input"
  placeholder="Enter Granite Name"
  value={activeGranite.name}
  onChange={(e) =>
    setActiveGranite({
      ...activeGranite,
      name: e.target.value
    })
  }
/>

<datalist id="granite-options">
  <option value="Pearl Black" />
  <option value="Z Black" />
  <option value="Telephone Black" />
  <option value="Steel Grey" />
  <option value="Color Granite" />
</datalist>


       
        <GraniteCalculator
          rows={activeGranite.rows}
            inputRefs={inputRefs}  
          handleChange={(index, field, value) => {
            const updated = [...activeGranite.rows];
            updated[index][field] = value;

            const lft = parseFloat(updated[index].lengthFt) || 0;
            const lin = parseFloat(updated[index].lengthIn) || 0;
            const bft = parseFloat(updated[index].breadthFt) || 0;
            const bin = parseFloat(updated[index].breadthIn) || 0;
            const qty = parseFloat(updated[index].qty) || 1;

            const L = lft * 12 + lin + 1;
            const B = bft * 12 + bin + 1;

            updated[index].sqft = (((L * B) / 144) * qty).toFixed(2);

            setActiveGranite({
              ...activeGranite,
              rows: updated
            });
          }}
          addRow={() =>
            setActiveGranite({
              ...activeGranite,
              rows: [
                ...activeGranite.rows,
                {
                  lengthFt: "",
                  lengthIn: "",
                  breadthFt: "",
                  breadthIn: "",
                  qty: 1,
                  sqft: 0
                }
              ]
            })
          }
          deleteRow={(i) =>
            setActiveGranite({
              ...activeGranite,
              rows: activeGranite.rows.filter((_, x) => x !== i)
            })
          }
          rate={activeGranite.rate}
          setRate={(r) =>
            setActiveGranite({
              ...activeGranite,
              rate: r
            })
          }
            totalSqft={activeSqft}
  grandTotal={activeTotal}
        />

        <button
          className="pdf-btn"
          onClick={() => {
            if (!activeGranite.name.trim()) {
  alert("⚠️ Please enter Granite Name");
  return;
}

            setGraniteList([...graniteList, activeGranite]);
            setActiveGranite(null);
          }}
        >
          Save Granite
        </button>
      </>
    )}
  </>
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

      {showPreview && (
  <EstimatePreview
    onClose={() => setShowPreview(false)}
    customerName={customerName}
    phoneNumber={phoneNumber}
    invoiceDate={invoiceDate}
    graniteList={graniteList}
    kadapaRows={kadapaRows}
    kadapaTotal={kadapaTotal}
    kotaRows={kotaRows}
    kotaTotal={kotaTotal}
    otherRows={otherRows}
    otherTotal={otherTotal}
    finalGrandTotal={finalGrandTotal}
  />
)}

    <button
  className="preview-btn"
  onClick={() => setShowPreview(true)}
>
  👁 Preview Estimate
</button>
    </div>
  );
}