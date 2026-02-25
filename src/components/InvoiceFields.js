

export default function InvoiceFields({

customerName,
setCustomerName,
invoiceDate,
setInvoiceDate

}){

return(

<div className="client-wrapper">

<div className="client-field">

<label>Customer Name</label>

<input
className="full-input"
value={customerName}
onChange={(e)=>setCustomerName(e.target.value)}
/>

</div>

<div className="client-field">

<label>Date</label>

<input
type="date"
className="full-input"
value={invoiceDate}
onChange={(e)=>setInvoiceDate(e.target.value)}
/>

</div>

</div>

);

}