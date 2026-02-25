

export default function StoneSelector({

stoneType,
setStoneType,
customStoneType,
setCustomStoneType,
popularStones

}){

return(

<div className="stone-type-wrapper">

<label>Stone Type</label>

<select
className="full-input"
value={stoneType}
onChange={(e)=>setStoneType(e.target.value)}
>

<option value="">Select</option>

{popularStones.map((s,i)=>(

<option key={i}>{s}</option>

))}

<option value="custom">Custom</option>

</select>


{stoneType==="custom" && (

<input
className="full-input"
placeholder="Enter stone"
value={customStoneType}
onChange={(e)=>setCustomStoneType(e.target.value)}
/>

)}

</div>

);

}