




import React, {
  useState
} from "react";

import "./styles/App.css";

import CreateEstimate
  from "./pages/CreateEstimate";

import ReviewEstimates
  from "./pages/ReviewEstimates";

  import Home
  from "./pages/Home";

export default function App() {

  const [page, setPage] =
    useState("home");

  const [editingEstimate,
setEditingEstimate] =
  useState(null);

  return (

    <div>

{page === "home" && (
  <Home setPage={setPage} />
)}

{page === "create" && (
  <CreateEstimate
  setPage={setPage}
  editingEstimate={
    editingEstimate
  }
  setEditingEstimate={
    setEditingEstimate
  }
/>
)}

{page === "review" && (
<ReviewEstimates
  setPage={setPage}
  setEditingEstimate={
    setEditingEstimate
  }
/>
)}

    </div>

  );
}