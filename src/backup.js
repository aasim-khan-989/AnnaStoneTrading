

// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import React, { useState, useRef } from "react";
// import "./App.css";



// function App() {

//   const [calculatorType,setCalculatorType] = useState("");
  
//   const createRows = (count = 10) =>
//     Array.from({ length: count }, () => ({
//       lengthFt: "",
//       lengthIn: "",
//       breadthFt: "",
//       breadthIn: "",
//       qty: 1,
//       sqft: 0
//     }));

//   const [customerName, setCustomerName] = useState("");
//   const [invoiceDate, setInvoiceDate] = useState(
//     new Date().toISOString().split("T")[0]
//   );

//   const [stoneType, setStoneType] = useState("");
//   const [customStoneType, setCustomStoneType] = useState("");

//   const popularStones = [
//     "Granite",
//     "Granite - Pearl Black",
//     "Granite - Z Black",
//     "Granite - Telephone Black",
//     "Granite - Steel Black",
//     "Kadapa Stone"
//   ];



//   const [rows, setRows] = useState(createRows());
//   const [rate, setRate] = useState("");

//   /* ---------- AUTO FOCUS LOGIC ---------- */
//   const inputRefs = useRef([]);

//   const focusNext = (index) => {
//     if (inputRefs.current[index + 1]) {
//       inputRefs.current[index + 1].focus();
//     }
//   };

//   const autoJump = (value, refIndex) => {
//     if (value === " " || value.length >= 3) {
//       focusNext(refIndex);
//     }
//   };
//   /* -------------------------------------- */

//   // ================= PDF =================
//   const downloadPDF = () => {
//     const doc = new jsPDF();

//     doc.setFontSize(18);
//     doc.text("ANNA STONE - Invoice", 14, 20);

//     doc.setFontSize(12);
//     doc.text(`Customer: ${customerName || "-"}`, 14, 30);
//     doc.text(`Date: ${invoiceDate}`, 14, 38);

//     const finalStoneType =
//       stoneType === "custom" ? customStoneType : stoneType;
//     if (finalStoneType)
//       doc.text(`Stone Type: ${finalStoneType}`, 14, 46);

//     const tableColumn = ["Length", "Breadth", "Qty", "Sq Ft"];

//     const tableRows = [];

//     rows.forEach((row) => {
//       if (parseFloat(row.sqft) > 0) {
//         tableRows.push([
//                 `${row.lengthFt}' ${row.lengthIn}"`,
//         `${row.breadthFt}' ${row.breadthIn}"`,
//         row.qty,
//         row.sqft
//         ]);
//       }
//     });

//     autoTable(doc, { startY: 54, head: [tableColumn], body: tableRows });

//     const finalY = doc.lastAutoTable.finalY || 60;

//     doc.text(`Total Sq Ft: ${totalSqft.toFixed(2)}`, 14, finalY + 10);
//     doc.text(`Rate: ₹ ${rate}`, 14, finalY + 18);
//     doc.text(`Grand Total: ₹ ${grandTotal.toFixed(2)}`, 14, finalY + 26);

//     doc.save("Stone_Invoice.pdf");
//   };

//   // ================= CALC =================
//   const handleChange = (index, field, value) => {
//     const updatedRows = [...rows];
//     updatedRows[index][field] = value;

//     const lft = parseFloat(updatedRows[index].lengthFt) || 0;
//     const lin = parseFloat(updatedRows[index].lengthIn) || 0;
//     const bft = parseFloat(updatedRows[index].breadthFt) || 0;
//     const bin = parseFloat(updatedRows[index].breadthIn) || 0;
//     const qty = parseFloat(updatedRows[index].qty) || 1;


//     if (lft || lin || bft || bin) {
//       const L = lft * 12 + lin + 1;
//       const B = bft * 12 + bin + 1;
//       updatedRows[index].sqft = (((L * B) / 144) * qty).toFixed(2);
//     } else updatedRows[index].sqft = 0;

//     setRows(updatedRows);
//   };

//   const addRow = () =>
//     setRows([
//       ...rows,
//       { lengthFt: "", lengthIn: "", breadthFt: "", breadthIn: "", qty: 1, sqft: 0 }

//     ]);

//   const deleteRow = (i) => setRows(rows.filter((_, idx) => idx !== i));

//   const totalSqft = rows.reduce((s, r) => s + parseFloat(r.sqft || 0), 0);
//   const grandTotal = totalSqft * (parseFloat(rate) || 0);

//   return (
//     <div className="container">
//       <h1>ANNA STONE CALCULATOR</h1>

//       {/* HEADER */}
//       <div className="client-wrapper">
//         <div className="client-field">
//           <label>Customer Name</label>
//           <input
//             className="full-input"
//             value={customerName}
//             onChange={(e) => setCustomerName(e.target.value)}
//           />
//         </div>

//         <div className="client-field">
//           <label>Date</label>
//           <input
//             className="full-input"
//             type="date"
//             value={invoiceDate}
//             onChange={(e) => setInvoiceDate(e.target.value)}
//           />
//         </div>
//       </div>

//       {/* STONE TYPE */}
//       <div className="stone-type-wrapper">
//         <label>Stone Type</label>
//         <select
//           className="full-input"
//           value={stoneType}
//           onChange={(e) => setStoneType(e.target.value)}
//         >
//           <option value="">Select</option>
//           {popularStones.map((s, i) => (
//             <option key={i}>{s}</option>
//           ))}
//           <option value="custom">Custom</option>
//         </select>

//         {stoneType === "custom" && (
//           <input
//             className="full-input"
//             placeholder="Enter stone"
//             value={customStoneType}
//             onChange={(e) => setCustomStoneType(e.target.value)}
//           />
//         )}
//       </div>

//       {/* CALCULATOR TYPE */}

// <div className="stone-type-wrapper">

// <label>Select Calculator</label>

// <div style={{display:"flex",gap:"10px"}}>

// <button
// className="add-btn"
// onClick={()=>setCalculatorType("granite")}
// >

// Granite Calculator

// </button>

// <button
// className="pdf-btn"
// onClick={()=>setCalculatorType("kadapa")}
// >

// Kadapa (Coming Soon)

// </button>

// </div>

// </div>

//       {/* TABLE */}
//       <div className="table-wrapper">
//         <table>
//           <thead>
//             <tr>
//               <th colSpan="2">Length</th>
//               <th rowSpan="2">×</th>
//               <th colSpan="2">Breadth</th>
//               <th rowSpan="2">Qty</th>
//               <th rowSpan="2">Sq Ft</th>
//               <th rowSpan="2">Delete</th>
//             </tr>
//             <tr>
//               <th>Ft</th>
//               <th>In</th>
//               <th>Ft</th>
//               <th>In</th>
//             </tr>
//           </thead>

//           <tbody>
//   {rows.map((row, i) => (
//     <tr key={i}>
//       {/* LENGTH FT */}
//       <td>
//         <input
//           ref={(el) => (inputRefs.current[i * 5] = el)}
//           className="calc-input"
//           value={row.lengthFt}
//           onChange={(e) => {
//             handleChange(i, "lengthFt", e.target.value);
//             autoJump(e.target.value, i * 5);
//           }}
//           onKeyDown={(e) => {
//             if (e.key === " " || e.key === "Enter") {
//               e.preventDefault();
//               focusNext(i * 5);
//             }
//           }}
//         />
//       </td>

//       {/* LENGTH IN */}
//       <td>
//         <input
//           ref={(el) => (inputRefs.current[i * 5 + 1] = el)}
//           className="calc-input"
//           value={row.lengthIn}
//           onChange={(e) => {
//             handleChange(i, "lengthIn", e.target.value);
//             autoJump(e.target.value, i * 5 + 1);
//           }}
//           onKeyDown={(e) => {
//             if (e.key === " " || e.key === "Enter") {
//               e.preventDefault();
//               focusNext(i * 5 + 1);
//             }
//           }}
//         />
//       </td>

//       <td>×</td>

//       {/* BREADTH FT */}
//       <td>
//         <input
//           ref={(el) => (inputRefs.current[i * 5 + 2] = el)}
//           className="calc-input"
//           value={row.breadthFt}
//           onChange={(e) => {
//             handleChange(i, "breadthFt", e.target.value);
//             autoJump(e.target.value, i * 5 + 2);
//           }}
//           onKeyDown={(e) => {
//             if (e.key === " " || e.key === "Enter") {
//               e.preventDefault();
//               focusNext(i * 5 + 2);
//             }
//           }}
//         />
//       </td>

//       {/* BREADTH IN */}
//       <td>
//         <input
//           ref={(el) => (inputRefs.current[i * 5 + 3] = el)}
//           className="calc-input"
//           value={row.breadthIn}
//           onChange={(e) => {
//             handleChange(i, "breadthIn", e.target.value);
//             autoJump(e.target.value, i * 5 + 3);
//           }}
//           onKeyDown={(e) => {
//             if (e.key === " " || e.key === "Enter") {
//               e.preventDefault();
//               focusNext(i * 5 + 3);
//             }
//           }}
//         />
//       </td>

//       {/* QTY */}
//       <td>
//         <input
//           ref={(el) => (inputRefs.current[i * 5 + 4] = el)}
//           className="calc-input"
//           type="number"
//           min="1"
//           value={row.qty}
//           onChange={(e) => handleChange(i, "qty", e.target.value)}
//           onKeyDown={(e) => {
//             if (e.key === " " || e.key === "Enter") {
//               e.preventDefault();
//               focusNext(i * 5 + 4);
//             }
//           }}
//         />
//       </td>

//       {/* SQFT */}
//       <td>{row.sqft}</td>

//       {/* DELETE */}
//       <td>
//         <button onClick={() => deleteRow(i)}>❌</button>
//       </td>
//     </tr>
//   ))}
// </tbody>

//         </table>
//       </div>

//       <button className="add-btn" onClick={addRow}>Add Piece</button>

//       <div className="summary-box">
//         <label>Rate (₹ / Sq Ft)</label>
//         <input
//           className="rate-input"
//           value={rate}
//           onChange={(e) => setRate(e.target.value)}
//         />
//         <p>Total Sq Ft: {totalSqft.toFixed(2)}</p>
//         <h2>Grand Total ₹ {grandTotal.toFixed(2)}</h2>
//       </div>

//       <button className="pdf-btn" onClick={downloadPDF}>Download PDF</button>
//     </div>
//   );
// }

// export default App;

// new update





// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import React, { useState, useRef } from "react";
// import "./App.css";
// import GraniteCalculator from "./components/GraniteCalculator";
// import KadapaCalculator from "./components/KadapaCalculator";

// function App() {



//   const createRows = (count = 10) =>
//     Array.from({ length: count }, () => ({
//       lengthFt: "",
//       lengthIn: "",
//       breadthFt: "",
//       breadthIn: "",
//       qty: 1,
//       sqft: 0
//     }));


//   const [calculatorType, setCalculatorType] = useState("");
//   const [customerName, setCustomerName] = useState("");
//   const [invoiceDate, setInvoiceDate] = useState(
//     new Date().toISOString().split("T")[0]
//   );

//   const [stoneType, setStoneType] = useState("");
//   const [customStoneType, setCustomStoneType] = useState("");

//   const popularStones = [
//     "Granite",
//     "Granite - Pearl Black",
//     "Granite - Z Black",
//     "Granite - Telephone Black",
//     "Granite - Steel Black",
//     "Kadapa Stone"
//   ];

//   const [rows, setRows] = useState(createRows());
//   const [rate, setRate] = useState("");

//   /* ---------- AUTO FOCUS LOGIC ---------- */
//   const inputRefs = useRef([]);

//   const focusNext = (index) => {
//     if (inputRefs.current[index + 1]) {
//       inputRefs.current[index + 1].focus();
//     }
//   };

//   const autoJump = (value, refIndex) => {
//     if (value === " " || value.length >= 3) {
//       focusNext(refIndex);
//     }
//   };
//   /* -------------------------------------- */

//   // ================= PDF =================
//   // ================= PDF GENERATOR =================

//   const generatePDFBlob = () => {

//     const doc = new jsPDF({

//       unit: "mm",
//       format: "a4"

//     });


//     /* SAFE FONT */

//     doc.setFont("helvetica", "bold");

//     doc.setFontSize(18);

//     doc.text("ANNA STONE - ESTIMATE", 14, 20);



//     doc.setFont("helvetica", "normal");

//     doc.setFontSize(12);

//     doc.text(`Customer : ${customerName || "-"}`, 14, 30);

//     doc.text(`Date : ${invoiceDate}`, 14, 38);



//     const finalStoneType =

//       stoneType === "custom"

//         ? customStoneType

//         : stoneType;

//     if (finalStoneType) {

//       doc.text(`Stone Type : ${finalStoneType}`, 14, 46);

//     }


//     /* TABLE */

//     const tableColumn = [

//       "Length",

//       "Breadth",

//       "Qty",

//       "Sq Ft"

//     ];



//     const tableRows = [];

//     rows.forEach(row => {

//       if (parseFloat(row.sqft) > 0) {

//         tableRows.push([

//           `${row.lengthFt || 0}' ${row.lengthIn || 0}"`,

//           `${row.breadthFt || 0}' ${row.breadthIn || 0}"`,

//           String(row.qty),

//           String(row.sqft)

//         ]);

//       }

//     });


//     autoTable(doc, {

//       startY: 54,

//       head: [tableColumn],

//       body: tableRows,

//       styles: {

//         font: "helvetica",

//         fontSize: 11

//       }

//     });


//     const finalY = doc.lastAutoTable.finalY || 60;



//     doc.setFont("helvetica", "bold");

//     doc.text(

//       `Total Sq Ft : ${totalSqft.toFixed(2)}`,

//       14,

//       finalY + 12

//     );

//     doc.text(

//       `Rate : Rs ${rate || 0}`,

//       14,

//       finalY + 20

//     );

//     doc.text(

//       `Grand Total : Rs ${grandTotal.toFixed(2)}`,

//       14,

//       finalY + 28

//     );



//     return doc.output("blob");

//   };





//   /* DOWNLOAD PDF */

//   const downloadPDF = () => {

//     const blob = generatePDFBlob();


//    // ================= WHATSAPP SHARE =================



//     /* UNIQUE FILE NAME */

//     const now = new Date();



//     const datePart =

//       now.toISOString()

//         .replace(/[-:]/g, "")

//         .split(".")[0]

//         .replace("T", "_");



//     const safeCustomer =

//       (customerName || "Customer")

//         .replace(/\s+/g, "_");



//     const fileName =

//       `AnnaStone_Estimate_${safeCustomer}_${datePart}.pdf`;



//     const url = URL.createObjectURL(blob);



//     const a = document.createElement("a");

//     a.href = url;

//     a.download = fileName;

//     a.click();

//     URL.revokeObjectURL(url);

//   };

//   const shareWhatsAppPDF = async () => {

// const blob = generatePDFBlob();

// const file = new File(

// [blob],

// "AnnaStone_Estimate.pdf",

// {

// type:"application/pdf"

// }

// );

// if(navigator.share){

// try{

// await navigator.share({

// title:"Anna Stone Estimate",

// files:[file]

// });

// }catch(e){

// console.log("Share Cancelled");

// }

// }else{

// alert("Sharing supported only on Mobile Chrome.");

// }

// };


//   // ================= CALC =================
//   const handleChange = (index, field, value) => {
//     const updatedRows = [...rows];
//     updatedRows[index][field] = value;

//     const lft = parseFloat(updatedRows[index].lengthFt) || 0;
//     const lin = parseFloat(updatedRows[index].lengthIn) || 0;
//     const bft = parseFloat(updatedRows[index].breadthFt) || 0;
//     const bin = parseFloat(updatedRows[index].breadthIn) || 0;
//     const qty = parseFloat(updatedRows[index].qty) || 1;


//     if (lft || lin || bft || bin) {
//       const L = lft * 12 + lin + 1;
//       const B = bft * 12 + bin + 1;
//       updatedRows[index].sqft = (((L * B) / 144) * qty).toFixed(2);
//     } else updatedRows[index].sqft = 0;

//     setRows(updatedRows);
//   };

//   const addRow = () =>
//     setRows([
//       ...rows,
//       { lengthFt: "", lengthIn: "", breadthFt: "", breadthIn: "", qty: 1, sqft: 0 }

//     ]);

//   const deleteRow = (i) => setRows(rows.filter((_, idx) => idx !== i));

//   const totalSqft = rows.reduce((s, r) => s + parseFloat(r.sqft || 0), 0);
//   const grandTotal = totalSqft * (parseFloat(rate) || 0);

//   return (
//     <div className="container">


//       <div className="app-header">

//         <h1 className="app-title">

//           🪨 ANNA STONE

//         </h1>

//         <p className="app-subtitle">

//           Smart Stone Area Calculator • Fast Billing • Accurate Measurement

//         </p>

//       </div>


//       {/* HEADER */}
//       <div className="client-wrapper">
//         <div className="client-field">
//           <label>Customer Name</label>
//           <input
//             className="full-input"
//             value={customerName}
//             onChange={(e) => setCustomerName(e.target.value)}
//           />
//         </div>

//         <div className="client-field">
//           <label>Date</label>
//           <input
//             className="full-input"
//             type="date"
//             value={invoiceDate}
//             onChange={(e) => setInvoiceDate(e.target.value)}
//           />
//         </div>
//       </div>

//       {/* STONE TYPE */}
//       <div className="stone-type-wrapper">
//         <label>Stone Type</label>
//         <select
//           className="full-input"
//           value={stoneType}
//           onChange={(e) => setStoneType(e.target.value)}
//         >
//           <option value="">Select</option>
//           {popularStones.map((s, i) => (
//             <option key={i}>{s}</option>
//           ))}
//           <option value="custom">Custom</option>
//         </select>

//         {stoneType === "custom" && (
//           <input
//             className="full-input"
//             placeholder="Enter stone"
//             value={customStoneType}
//             onChange={(e) => setCustomStoneType(e.target.value)}
//           />
//         )}
//       </div>

//       {/* CALCULATOR SELECTOR */}

//       <div className="calculator-selector">

//         <h3>Select Calculator</h3>

//         <div className="calculator-grid">

//           <div
//             className={`calculator-card ${calculatorType === "granite" ? "active" : ""}`}
//             onClick={() => setCalculatorType("granite")}
//           >

//             🪨
//             <h4>Granite</h4>
//             <p>Stone Pieces Calculator</p>

//           </div>


//           <div
//             className={`calculator-card ${calculatorType === "kadappa" ? "active" : ""}`}
//             onClick={() => setCalculatorType("kadappa")}
//           >


//             🧱
//             <h4>Kadappa</h4>
//            {calculatorType === "kadappa" && (
//   <KadapaCalculator
//     rows={rows}
//     handleChange={handleKadapaChange}
//     inputRefs={inputRefs}
//     deleteRow={deleteRow}
//     addRow={addRow}
//     rate={rate}
//     setRate={setRate}
//     totalSqft={totalSqft}
//     grandTotal={grandTotal}
//     downloadPDF={downloadPDF}
//     shareWhatsAppPDF={shareWhatsAppPDF}
//   />
// )}

//           </div>


//           <div
//             className={`calculator-card ${calculatorType === "tiles" ? "active" : ""}`}
//             onClick={() => setCalculatorType("tiles")}
//           >

//             ⬜
//             <h4>Tiles</h4>
//             <p>Area Tiles Calculator</p>

//           </div>

//         </div>

//       </div>

//       {/* TABLE */}

//       {calculatorType === "granite" && (

//         <GraniteCalculator

//           rows={rows}
//           handleChange={handleChange}
//           inputRefs={inputRefs}
//           autoJump={autoJump}
//           focusNext={focusNext}
//           deleteRow={deleteRow}
//           addRow={addRow}
//           rate={rate}
//           setRate={setRate}
//           totalSqft={totalSqft}
//           grandTotal={grandTotal}
//           downloadPDF={downloadPDF}
//           shareWhatsAppPDF={shareWhatsAppPDF}

//         />

      
//       )
      
//       const kadapaRound = (inch) => {
//   if (inch <= 0) return 0;
//   return Math.ceil(inch / 6) * 6;
// };

// const handleKadapaChange = (index, field, value) => {
//   const updatedRows = [...rows];
//   updatedRows[index][field] = value;

//   const lft = parseFloat(updatedRows[index].lengthFt) || 0;
//   const lin = parseFloat(updatedRows[index].lengthIn) || 0;
//   const bft = parseFloat(updatedRows[index].breadthFt) || 0;
//   const bin = parseFloat(updatedRows[index].breadthIn) || 0;
//   const qty = parseFloat(updatedRows[index].qty) || 1;

//   const rawL = lft * 12 + lin;
//   const rawB = bft * 12 + bin;

//   const L = kadapaRound(rawL);
//   const B = kadapaRound(rawB);

//   updatedRows[index].sqft = (((L * B) / 144) * qty).toFixed(2);

//   setRows(updatedRows);
// };
//       }

      







//     </div>
//   );
// }

// export default App;

