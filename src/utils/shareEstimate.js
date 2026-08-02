import {
generatePDFBlob
}
from "./pdfGenerator";

export async function shareEstimatePDF(
estimate
){

const blob =
generatePDFBlob(estimate);

const safeName =
(estimate.customerName || "Customer")
.replace(/[^a-zA-Z0-9]/g,"_");

const file =
new File(

[blob],

`Estimate_${estimate.estimateNumber}_${safeName}.pdf`,

{
type:"application/pdf"
}

);

const text =
`🪨 ANNA STONE ESTIMATE

Estimate #${estimate.estimateNumber}

Customer : ${estimate.customerName||"-"}

Phone : ${estimate.phoneNumber||"-"}

Grand Total : ₹${estimate.finalGrandTotal.toFixed(2)}

Thank you for choosing Anna Stone.`;

if(
navigator.canShare &&
navigator.canShare({files:[file]})
){

await navigator.share({

title:"Anna Stone Estimate",

text,

files:[file]

});

}
else{

alert(
"File sharing is not supported on this device."
);

}

}