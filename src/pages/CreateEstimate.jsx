
import React, {
  useRef,
  useState,
  useEffect
} from "react";

import {
  loadEstimates,
  saveEstimates,
  getNextEstimateNumber,
  saveDraft,
loadDraft,
clearDraft
} from "../storage/estimateStorage";

import jsPDF from "jspdf";

import autoTable
  from "jspdf-autotable";

import "../styles/App.css";

import "../styles/Home.css";

import EstimatePreview
  from "../components/EstimatePreview";

import GraniteCalculator
  from "../components/GraniteCalculator";

import KadapaCalculator
  from "../components/KadapaCalculator";

import OtherCalculator
  from "../components/OtherCalculator";


export default function CreateEstimate({
  setPage,
  editingEstimate,
  setEditingEstimate
}){
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

const [kadapaList, setKadapaList] = useState([]);

const [activeKadapa, setActiveKadapa] =
  useState(null);



  const [otherRows, setOtherRows] =
    useState(createOtherRows());

  /* =========================
     HELPERS
  ========================= */


  /* =========================
     GRANITE FORMULA
  ========================= */

  /* =========================
     KADAPA / KOTA
  ========================= */



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

const kadapaRound = (inch) => {

  if (inch <= 0) return 0;

  if (inch <= 5) {
    return 6;
  }

  if (inch >= 6 && inch <= 8) {
    return 9;
  }

  const remainder = inch % 6;

  if (remainder === 0) {
    return inch + 6;
  }

  return inch + (6 - remainder);
};

const kadapaTotal =
  
kadapaList.reduce((sum, k) => {

    const sqft =
      k.rows.reduce(
        (s, r) =>
          s + parseFloat(r.sqft || 0),
        0
      );

    return (
      sum +
      sqft *
        (parseFloat(k.rate) || 0)
    );

  }, 0);



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
    kadapaTotal  + otherTotal);

const saveCurrentEstimate = () => {

  const estimates =
    loadEstimates();

  if (editingEstimate) {

    const updated =
      estimates.map((e) => {

        if (
          e.id === editingEstimate.id
        ) {

          return {

            ...e,

            customerName,

            phoneNumber,

            invoiceDate,

            graniteList,

            kadapaList,

            otherRows,

            finalGrandTotal
          };
        }

        return e;

      });

    saveEstimates(updated);

    alert(
      "✅ Estimate Updated"
    );

    clearDraft();

  setEditingEstimate(null);

setPage("home");



return;
  }

  const estimate = {

    id: Date.now(),

    estimateNumber:
      getNextEstimateNumber(),

    customerName,

    phoneNumber,

    invoiceDate,

    graniteList,

    kadapaList,

    otherRows,

    finalGrandTotal
  };

  saveEstimates([
    estimate,
    ...estimates
  ]);

  alert(
    "✅ Estimate Saved"
    
  );
  clearDraft();
  setPage("home");
};

const [draftLoaded, setDraftLoaded] =
  useState(false);

  useEffect(() => {

  if (editingEstimate) {

    setDraftLoaded(true);

    return;
  }

  const draft =
    loadDraft();

  if (draft) {

    setCustomerName(
      draft.customerName || ""
    );

    setPhoneNumber(
      draft.phoneNumber || ""
    );

    setInvoiceDate(
      draft.invoiceDate || ""
    );

    setGraniteList(
      draft.graniteList || []
    );

    setActiveGranite(
  draft.activeGranite || null
);

    setKadapaList(
      draft.kadapaList || []
    );

    setActiveKadapa(
  draft.activeKadapa || null
);

    setOtherRows(
      draft.otherRows || []
    );

    setCalculatorType(
  draft.calculatorType || "granite"
);

  }

  
  setDraftLoaded(true);

}, [editingEstimate]);

loadDraft() 

useEffect(() => {

  if (!draftLoaded)
    return;

saveDraft({

  customerName,

  phoneNumber,

  invoiceDate,

  graniteList,

  activeGranite,

  kadapaList,

  activeKadapa,

  otherRows,

  calculatorType

});

}, [

  draftLoaded,

  customerName,
  phoneNumber,
  invoiceDate,

  graniteList,
  activeGranite,

  kadapaList,
  activeKadapa,

  otherRows,

  calculatorType

]);

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

  doc.setFillColor(25, 25, 25);

doc.rect(0, 0, 210, 30, "F");

doc.setTextColor(255,255,255);

doc.setFontSize(20);

doc.setFont(
  "helvetica",
  "bold"
);

doc.text(
  "ANNA STONE ESTIMATE",
  14,
  18
);

doc.setTextColor(0,0,0);

doc.setFontSize(11);

doc.setFont(
  "helvetica",
  "normal"
);

doc.text(
  `Customer : ${
    customerName || "-"
  }`,
  14,
  42
);

doc.text(
  `Phone : ${
    phoneNumber || "-"
  }`,
  14,
  49
);

doc.text(
  `Date : ${invoiceDate}`,
  14,
  56
);

let currentY = 68;

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
    theme: "grid",

styles: {
  fontSize: 10,
  cellPadding: 3
},

headStyles: {
  fillColor: [35,35,35],
  textColor: 255,
  fontStyle: "bold"
},
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

doc.setFont(
  "helvetica",
  "bold"
);

doc.text(
  `SqFt : ${sqftTotal.toFixed(2)}`,
  14,
  currentY
);

doc.text(
  `Rate : Rs ${g.rate}`,
  75,
  currentY
);

doc.text(
  `Total : Rs ${total.toFixed(2)}`,
  140,
  currentY
);

currentY += 10;

doc.setFont(
  "helvetica",
  "normal"
);

  currentY += 10;
});

      /* KADAPA */
 
kadapaList.forEach((k) => {

  doc.text(
    `${k.name}`,
    14,
    currentY
  );

  const body = [];

  k.rows.forEach((row) => {

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
    theme: "grid",

styles: {
  fontSize: 10,
  cellPadding: 3
},

headStyles: {
  fillColor: [35,35,35],
  textColor: 255,
  fontStyle: "bold"
},
    startY: currentY + 3,
    head: [["Length","Breadth","Qty","Sq Ft"]],
    body
  });

  currentY =
    doc.lastAutoTable.finalY + 5;

  const sqftTotal =
    k.rows.reduce(
      (s, r) =>
        s + parseFloat(r.sqft || 0),
      0
    );

  const total =
    sqftTotal *
    (parseFloat(k.rate) || 0);

  doc.text(
    `Total SqFt : ${sqftTotal.toFixed(2)}`,
    14,
    currentY
  );

  currentY += 5;

doc.setFont(
  "helvetica",
  "bold"
);

doc.text(
  `SqFt : ${sqftTotal.toFixed(2)}`,
  14,
  currentY
);

doc.text(
  `Rate : Rs ${k.rate}`,
  75,
  currentY
);

doc.text(
  `Total : Rs ${total.toFixed(2)}`,
  140,
  currentY
);

currentY += 10;

doc.setFont(
  "helvetica",
  "normal"
);

});
      




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
          theme: "grid",

styles: {
  fontSize: 10,
  cellPadding: 3
},

headStyles: {
  fillColor: [35,35,35],
  textColor: 255,
  fontStyle: "bold"
},
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

useEffect(() => {

  if (!editingEstimate)
    return;

  setCustomerName(
    editingEstimate.customerName || ""
  );

  setPhoneNumber(
    editingEstimate.phoneNumber || ""
  );

  setInvoiceDate(
    editingEstimate.invoiceDate || ""
  );

  setGraniteList(
    editingEstimate.graniteList || []
  );

  setKadapaList(
    editingEstimate.kadapaList || []
  );

  setOtherRows(
    editingEstimate.otherRows || []
  );

}, [editingEstimate]);

  return (
    <div className="container">
        <button
  className="back-btn"
  onClick={() =>
    setPage("home")
  }
>
  ← Home
</button>
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
  className={`calculator-card ${
    calculatorType === "kadapa"
      ? "active"
      : ""
  }`}
  onClick={() =>
    setCalculatorType("kadapa")
  }
>
  🧱
  <h4>Kadapa / Kota</h4>
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

{calculatorType === "kadapa" && (
  <>

    <button
      className="add-btn"
      onClick={() =>
        setActiveKadapa({
          name: "",
          rate: "",
          rows: createRows()
        })
      }
    >
      + Add Kadapa / Kota
    </button>

    {kadapaList.map((k, i) => (

      <div className="saved-item" key={i}>

        <div>
          <b>{k.name}</b>
          <span> ₹{k.rate}</span>
        </div>

        <div className="action-btns">

          <button
            className="edit-btn"
            onClick={() =>
              setActiveKadapa({
                ...k,
                rows: k.rows.map(r => ({ ...r }))
              })
            }
          >
            ✏️ Edit
          </button>

          <button
            className="delete-btn"
            onClick={() =>
              setKadapaList(
                kadapaList.filter((_, x) => x !== i)
              )
            }
          >
            🗑 Delete
          </button>

        </div>

      </div>

    ))}

    {activeKadapa && (
      <>

        <input
          list="kadapa-options"
          className="full-input"
          placeholder="Enter Kadapa / Kota Name"
          value={activeKadapa.name}
          onChange={(e) =>
            setActiveKadapa({
              ...activeKadapa,
              name: e.target.value
            })
          }
        />

        <datalist id="kadapa-options">
          <option value="Kadapa" />
          <option value="Kadapa Polish" />
          <option value="Kota" />
        </datalist>

        <KadapaCalculator
          rows={activeKadapa.rows}
          inputRefs={inputRefs}

          handleChange={(index, field, value) => {

            const updated = [
              ...activeKadapa.rows
            ];

            updated[index][field] = value;

            const lft =
              parseFloat(updated[index].lengthFt) || 0;

            const lin =
              parseFloat(updated[index].lengthIn) || 0;

            const bft =
              parseFloat(updated[index].breadthFt) || 0;

            const bin =
              parseFloat(updated[index].breadthIn) || 0;

            const qty =
              parseFloat(updated[index].qty) || 1;

            const rawL =
              lft * 12 + lin;

            const rawB =
              bft * 12 + bin;

            const L = kadapaRound(rawL);

            const B = kadapaRound(rawB);

            updated[index].sqft = (
              ((L * B) / 144) * qty
            ).toFixed(2);

            setActiveKadapa({
              ...activeKadapa,
              rows: updated
            });

          }}

          addRow={() =>
            setActiveKadapa({
              ...activeKadapa,
              rows: [
                ...activeKadapa.rows,
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
            setActiveKadapa({
              ...activeKadapa,
              rows:
                activeKadapa.rows.filter(
                  (_, x) => x !== i
                )
            })
          }

          rate={activeKadapa.rate}

          setRate={(r) =>
            setActiveKadapa({
              ...activeKadapa,
              rate: r
            })
          }

          totalSqft={
            activeKadapa.rows.reduce(
              (sum, row) =>
                sum +
                parseFloat(row.sqft || 0),
              0
            )
          }

          grandTotal={
            activeKadapa.rows.reduce(
              (sum, row) =>
                sum +
                parseFloat(row.sqft || 0),
              0
            ) *
            (parseFloat(activeKadapa.rate) || 0)
          }

        />

        <button
          className="pdf-btn"
          onClick={() => {

            if (!activeKadapa.name.trim()) {

              alert(
                "⚠️ Please enter Kadapa / Kota Name"
              );

              return;
            }

            setKadapaList([
              ...kadapaList,
              activeKadapa
            ]);

            setActiveKadapa(null);

          }}
        >
          Save Kadapa / Kota
        </button>

      </>
    )}

  </>
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

      <button
  className="pdf-btn"
  onClick={saveCurrentEstimate}
>
  💾 Save Estimate
</button>

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
    kadapaList={kadapaList}

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