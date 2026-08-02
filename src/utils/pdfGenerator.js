

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generatePDFBlob = (estimate) => {

    const {

customerName,
phoneNumber,
invoiceDate,

graniteList,
kadapaList,
otherRows,

finalGrandTotal

} = estimate;

const otherTotal =
otherRows.reduce(
(sum,row)=>
sum+parseFloat(row.total||0),
0
);

        const doc =
          new jsPDF({
            unit: "mm",
            format: "a4",
          });

        doc.setFillColor(25, 25, 25);

        doc.rect(0, 0, 210, 30, "F");

        doc.setTextColor(255, 255, 255);

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

        doc.setTextColor(0, 0, 0);

        doc.setFontSize(11);

        doc.setFont(
          "helvetica",
          "normal"
        );

        doc.text(
          `Customer : ${customerName || "-"
          }`,
          14,
          42
        );

        doc.text(
          `Phone : ${phoneNumber || "-"
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

  // Heading
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(`GRANITE : ${g.name}`, 14, currentY);

  // Note
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.text(
    "Note: Measurements include a standard 1-inch cutting allowance.",
    14,
    currentY + 5
  );

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

    startY: currentY + 10,

    styles: {
      fontSize: 10,
      cellPadding: 3
    },

    headStyles: {
      fillColor: [35, 35, 35],
      textColor: 255,
      fontStyle: "bold"
    },

    head: [["Length", "Breadth", "Qty", "Sq Ft"]],
    body
  });

  currentY = doc.lastAutoTable.finalY + 8;

  const sqftTotal =
    g.rows.reduce(
      (s, r) => s + parseFloat(r.sqft || 0),
      0
    );

  const qtyTotal =
    g.rows.reduce(
      (s, r) => s + (parseFloat(r.qty) || 0),
      0
    );

  const total =
    sqftTotal *
    (parseFloat(g.rate) || 0);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);

  doc.text(`Qty : ${qtyTotal}`, 14, currentY);
  doc.text(`SqFt : ${sqftTotal.toFixed(2)}`, 55, currentY);
 doc.text(`Rate : Rs ${g.rate}`,110,currentY);
doc.text(`Total : Rs ${total.toFixed(2)}`,160,currentY);

  currentY += 14;

});

     /* KADAPA */

kadapaList.forEach((k) => {

  // Heading
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(`${k.name}`, 14, currentY);

  // Note
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.text(
   "Note: Measurements include the standard Kadapa cutting allowance.",
    14,
    currentY + 5
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

    startY: currentY + 10,

    styles: {
      fontSize: 10,
      cellPadding: 3
    },

    headStyles: {
      fillColor: [35,35,35],
      textColor:255,
      fontStyle:"bold"
    },

    head: [["Length","Breadth","Qty","Sq Ft"]],

    body

  });

  currentY = doc.lastAutoTable.finalY + 8;

  const sqftTotal =
    k.rows.reduce(
      (s,r)=>s+parseFloat(r.sqft||0),
      0
    );

  const qtyTotal =
    k.rows.reduce(
      (s,r)=>s+(parseFloat(r.qty)||0),
      0
    );

  const total =
    sqftTotal *
    (parseFloat(k.rate)||0);

  doc.setFont("helvetica","bold");
  doc.setFontSize(10);

  doc.text(`Qty : ${qtyTotal}`,14,currentY);
  doc.text(`SqFt : ${sqftTotal.toFixed(2)}`,55,currentY);
  doc.text(`Rate : Rs${k.rate}`,110,currentY);
  doc.text(`Total : Rs${total.toFixed(2)}`,160,currentY);

  currentY += 14;

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
              fillColor: [35, 35, 35],
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