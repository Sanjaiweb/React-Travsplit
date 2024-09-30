// src/components/Group/DeleteMember.js
import React, { useState } from "react";
import { db } from "../../firebase/firebaseConfig";
import { doc, deleteDoc } from "firebase/firestore";
import { useHistory, useParams } from "react-router-dom";

const DeleteMember = () => {
  const { memberId } = useParams();
  const [error, setError] = useState("");
  const history = useHistory();

  const handleDeleteMember = async () => {
    setError("");
    try {
      await deleteDoc(doc(db, "group_members", memberId));
      history.push("/dashboard");
    } catch (err) {
      setError("Failed to delete member. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Delete Member</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <p>Are you sure you want to delete this member?</p>
      <button className="btn btn-danger" onClick={handleDeleteMember}>
        Yes, Delete
      </button>
      <button className="btn btn-secondary ml-2" onClick={() => history.push("/dashboard")}>
        Cancel
      </button>
    </div>
  );
};

export default DeleteMember;
