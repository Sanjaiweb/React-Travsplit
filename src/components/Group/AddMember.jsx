// src/components/Group/AddMember.js
import React, { useState } from "react";
import { db } from "../../firebase/firebaseConfig";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { useHistory, useParams } from "react-router-dom";

const AddMember = () => {
  const { groupId } = useParams();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const history = useHistory();

  const handleAddMember = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Find user by email
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        setError("User not found.");
        return;
      }

      const user = querySnapshot.docs[0].data();
      const userId = querySnapshot.docs[0].id;

      // Add to group_members collection
      await addDoc(collection(db, "group_members"), {
        groupId,
        userId,
        addedAt: Timestamp.now(),
      });

      history.push(`/group/${groupId}`);
    } catch (err) {
      setError("Failed to add member. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Add Member to Group</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleAddMember}>
        <div className="form-group mt-3">
          <label>User Email</label>
          <input
            type="email"
            className="form-control"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary mt-4">
          Add Member
        </button>
      </form>
    </div>
  );
};

export default AddMember;
