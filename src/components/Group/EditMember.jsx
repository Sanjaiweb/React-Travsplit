// src/components/Group/EditMember.js
import React, { useState, useEffect } from "react";
import { db } from "../../firebase/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useHistory, useParams } from "react-router-dom";

const EditMember = () => {
  const { memberId } = useParams();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const history = useHistory();

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const memberDoc = await getDoc(doc(db, "group_members", memberId));
        if (memberDoc.exists()) {
          const memberData = memberDoc.data();
          setEmail(memberData.email);
        } else {
          setError("Member not found.");
        }
      } catch (err) {
        setError("Failed to fetch member details.");
        console.error(err);
      }
    };

    fetchMember();
  }, [memberId]);

  const handleEditMember = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const memberRef = doc(db, "group_members", memberId);
      await updateDoc(memberRef, {
        email,
      });

      history.push("/dashboard");
    } catch (err) {
      setError("Failed to update member. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Edit Member</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleEditMember}>
        <div className="form-group mt-3">
          <label>Member Email</label>
          <input
            type="email"
            className="form-control"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary mt-4">
          Update Member
        </button>
      </form>
    </div>
  );
};

export default EditMember;
