

import React, {
  useEffect,
  useState
} from "react";

import EstimatePreview
from "../components/EstimatePreview";

import {
  loadEstimates,
  saveEstimates
} from "../storage/estimateStorage";

import "../styles/Home.css";

export default function ReviewEstimates({
  setPage,
  setEditingEstimate
}){

  const [estimates, setEstimates] =
    useState([]);

  useEffect(() => {

    setEstimates(
      loadEstimates()
    );

  }, []);

  const [previewEstimate,
setPreviewEstimate] =
  useState(null);

  const deleteEstimate = (
    id
  ) => {

    const updated =
      estimates.filter(
        (e) => e.id !== id
      );

    setEstimates(updated);

    saveEstimates(updated);
  };

  const shareEstimate = async (e) => {

  const text = `🪨 ANNA STONE ESTIMATE

Estimate #${e.estimateNumber}

Customer : ${e.customerName || "-"}

Phone : ${e.phoneNumber || "-"}

Grand Total : ₹${e.finalGrandTotal.toFixed(2)}

Thank you for choosing Anna Stone.
`;

  try {

    if (navigator.share) {

      await navigator.share({

        title:
          `Estimate #${e.estimateNumber}`,

        text

      });

    } else {

      alert(
        "Sharing not supported on this device"
      );
    }

  } catch (err) {

    console.log(err);

  }
};

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
          📋 Saved Estimates
        </h1>

        <p className="app-subtitle">
          Review all saved estimates
        </p>

      </div>

      {estimates.length === 0 && (

        <div className="saved-item">

          No estimates found

        </div>

      )}

      {estimates.map((e) => (

        <div
          className="saved-item"
          key={e.id}
        >

          <div>

            <h3>
              Estimate #
              {e.estimateNumber}
            </h3>

            <p>
              {e.customerName || "-"}
            </p>

            <p>
              {e.phoneNumber || "-"}
            </p>

            <p>
              ₹
              {e.finalGrandTotal.toFixed(
                2
              )}
            </p>

          </div>

         <div className="action-strip">

<button
  className="action-btn edit-action"
  onClick={() => {

    setEditingEstimate(e);

    setPage("create");

  }}
>
  ✏️ Edit
</button>

<button
  className="action-btn preview-action"
  onClick={() =>
    setPreviewEstimate(e)
  }
>
  👁 Preview
</button>


<button
  className="action-btn share-action"
  onClick={() =>
    shareEstimate(e)
  }
>
  📤 Share
</button>

  <button
    className="action-btn delete-action"
    onClick={() =>
      deleteEstimate(e.id)
    }
  >
    🗑 Delete
  </button>

</div>

        </div>

      ))}

      {previewEstimate && (

  <EstimatePreview

    onClose={() =>
      setPreviewEstimate(null)
    }

    customerName={
      previewEstimate.customerName
    }

    phoneNumber={
      previewEstimate.phoneNumber
    }

    invoiceDate={
      previewEstimate.invoiceDate
    }

    graniteList={
      previewEstimate.graniteList
    }

    kadapaList={
      previewEstimate.kadapaList
    }

    otherRows={
      previewEstimate.otherRows
    }

    otherTotal={
      previewEstimate.otherRows.reduce(
        (s, r) =>
          s +
          parseFloat(r.total || 0),
        0
      )
    }

    finalGrandTotal={
      previewEstimate.finalGrandTotal
    }

  />

)}

    </div>

  );
}