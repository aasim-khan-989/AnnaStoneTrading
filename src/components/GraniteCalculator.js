

import React,{useState} from "react";

export default function GraniteCalculator({

rows,
handleChange,
inputRefs,
autoJump,
focusNext,
deleteRow,
addRow,
rate,
setRate,
totalSqft,
grandTotal,
downloadPDF

}){


/* ===== SEPARATE FT TOGGLES ===== */

const [showLengthFt,setShowLengthFt]=useState(false);

const [showBreadthFt,setShowBreadthFt]=useState(false);



return(

<>

<div className="table-wrapper">

<table>

<thead>


{/* HEADER ROW 1 */}

<tr>

<th colSpan={showLengthFt?2:1}>

Length

</th>

<th>

×

</th>

<th colSpan={showBreadthFt?2:1}>

Breadth

</th>

<th>

Qty

</th>

<th>

SqFt

</th>

<th>

Delete

</th>

</tr>



{/* HEADER ROW 2 */}

<tr>

{/* LENGTH TOGGLE */}

<th

colSpan={showLengthFt?2:1}

className="ft-toggle-header"

onClick={()=>setShowLengthFt(v=>!v)}

>

{showLengthFt ? "Hide Ft" : "Show Ft"}

</th>


<th></th>


{/* BREADTH TOGGLE */}

<th

colSpan={showBreadthFt?2:1}

className="ft-toggle-header"

onClick={()=>setShowBreadthFt(v=>!v)}

>

{showBreadthFt ? "Hide Ft" : "Show Ft"}

</th>


<th></th>

<th></th>

<th></th>

</tr>



{/* HEADER ROW 3 */}

<tr>

{showLengthFt && <th>Ft</th>}

<th>In</th>

<th></th>

{showBreadthFt && <th>Ft</th>}

<th>In</th>

<th>Qty</th>

<th>SqFt</th>

<th>❌</th>

</tr>

</thead>



<tbody>

{rows.map((row,i)=>(

<tr key={i}>


{/* LENGTH FT */}

{showLengthFt &&(

<td>

<input

ref={(el)=>(inputRefs.current[i*5]=el)}

className="calc-input large-input"

value={row.lengthFt}

inputMode="numeric"

onChange={(e)=>{

handleChange(i,"lengthFt",e.target.value);

autoJump(e.target.value,i*5);

}}

onKeyDown={(e)=>{

if(e.key===" "||e.key==="Enter"){

e.preventDefault();

focusNext(i*5);

}

}}

 />

</td>

)}



{/* LENGTH IN */}

<td>

<input

ref={(el)=>(inputRefs.current[i*5+1]=el)}

className="calc-input large-input"

value={row.lengthIn}

inputMode="numeric"

onChange={(e)=>{

handleChange(i,"lengthIn",e.target.value);

autoJump(e.target.value,i*5+1);

}}

 />

</td>



<td className="multiply">

×

</td>



{/* BREADTH FT */}

{showBreadthFt &&(

<td>

<input

ref={(el)=>(inputRefs.current[i*5+2]=el)}

className="calc-input large-input"

value={row.breadthFt}

inputMode="numeric"

onChange={(e)=>{

handleChange(i,"breadthFt",e.target.value);

autoJump(e.target.value,i*5+2);

}}

 />

</td>

)}



{/* BREADTH IN */}

<td>

<input

ref={(el)=>(inputRefs.current[i*5+3]=el)}

className="calc-input large-input"

value={row.breadthIn}

inputMode="numeric"

onChange={(e)=>{

handleChange(i,"breadthIn",e.target.value);

autoJump(e.target.value,i*5+3);

}}

 />

</td>



{/* QTY */}

<td>

<input

ref={(el)=>(inputRefs.current[i*5+4]=el)}

type="number"

min="1"

className="calc-input large-input qty-input"

value={row.qty}

onFocus={(e)=>e.target.select()}

onChange={(e)=>

handleChange(

i,

"qty",

e.target.value

)

}

/>

</td>



<td className="sqft-cell">

{row.sqft}

</td>


<td>

<button

className="delete-btn"

onClick={()=>deleteRow(i)}

>

❌

</button>

</td>


</tr>

))}

</tbody>

</table>

</div>



<button

className="add-btn"

onClick={addRow}

>

Add Piece

</button>



<div className="summary-box">

<label>

Rate (₹ / Sq Ft)

</label>

<input

className="rate-input"

value={rate}

onChange={(e)=>setRate(e.target.value)}

/>

<p>

Total Sq Ft :

{totalSqft.toFixed(2)}

</p>

<h2>

Grand Total ₹

{grandTotal.toFixed(2)}

</h2>

</div>



<button

className="pdf-btn"

onClick={downloadPDF}

>

Download PDF

</button>

</>

);

}