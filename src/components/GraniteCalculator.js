import React from "react";

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

}) {

    return (

        <>

            <div className="table-wrapper">

                <table>

                    <thead>

                        <tr>
                            <th colSpan="2">Length</th>
                            <th rowSpan="2">×</th>
                            <th colSpan="2">Breadth</th>
                            <th rowSpan="2">Qty</th>
                            <th rowSpan="2">Sq Ft</th>
                            <th rowSpan="2">Delete</th>
                        </tr>

                        <tr>
                            <th>Ft</th>
                            <th>In</th>
                            <th>Ft</th>
                            <th>In</th>
                        </tr>

                    </thead>

                    <tbody>

                        {rows.map((row, i) => (

                            <tr key={i}>

                                <td>

                                    <input

                                        ref={(el) => (inputRefs.current[i * 5] = el)}

                                        className="calc-input"

                                        value={row.lengthFt}

                                        onChange={(e) => {

                                            handleChange(i, "lengthFt", e.target.value);

                                            autoJump(e.target.value, i * 5);

                                        }}

                                        onKeyDown={(e) => {

                                            if (e.key === " " || e.key === "Enter") {

                                                e.preventDefault();

                                                focusNext(i * 5);

                                            }

                                        }}

                                    />

                                </td>



                                <td>

                                    <input

                                        ref={(el) => (inputRefs.current[i * 5 + 1] = el)}

                                        className="calc-input"

                                        value={row.lengthIn}

                                        onChange={(e) => {

                                            handleChange(i, "lengthIn", e.target.value);

                                            autoJump(e.target.value, i * 5 + 1);

                                        }}

                                        onKeyDown={(e) => {

                                            if (e.key === " " || e.key === "Enter") {

                                                e.preventDefault();

                                                focusNext(i * 5 + 1);

                                            }

                                        }}

                                    />

                                </td>

                                <td>×</td>


                                <td>

                                    <input

                                        ref={(el) => (inputRefs.current[i * 5 + 2] = el)}

                                        className="calc-input"

                                        value={row.breadthFt}

                                        onChange={(e) => {

                                            handleChange(i, "breadthFt", e.target.value);

                                            autoJump(e.target.value, i * 5 + 2);

                                        }}

                                        onKeyDown={(e) => {

                                            if (e.key === " " || e.key === "Enter") {

                                                e.preventDefault();

                                                focusNext(i * 5 + 2);

                                            }

                                        }}

                                    />

                                </td>


                                <td>

                                    <input

                                        ref={(el) => (inputRefs.current[i * 5 + 3] = el)}

                                        className="calc-input"

                                        value={row.breadthIn}

                                        onChange={(e) => {

                                            handleChange(i, "breadthIn", e.target.value);

                                            autoJump(e.target.value, i * 5 + 3);

                                        }}

                                        onKeyDown={(e) => {

                                            if (e.key === " " || e.key === "Enter") {

                                                e.preventDefault();

                                                focusNext(i * 5 + 3);

                                            }

                                        }}

                                    />

                                </td>



                                <td>

                                    <input

                                        ref={(el) => (inputRefs.current[i * 5 + 4] = el)}

                                        type="number"

                                        min="1"

                                        className="calc-input"

                                        value={row.qty}

                                        onChange={(e) => handleChange(i, "qty", e.target.value)}

                                        onKeyDown={(e) => {

                                            if (e.key === " " || e.key === "Enter") {

                                                e.preventDefault();

                                                focusNext(i * 5 + 4);

                                            }

                                        }}

                                    />

                                </td>


                                <td>{row.sqft}</td>

                                <td>

                                    <button onClick={() => deleteRow(i)}>

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

                <label>Rate (₹ / Sq Ft)</label>

                <input

                    className="rate-input"

                    value={rate}

                    onChange={(e) => setRate(e.target.value)}

                />

                <p>Total Sq Ft: {totalSqft.toFixed(2)}</p>

                <h2>Grand Total ₹ {grandTotal.toFixed(2)}</h2>

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