// src/components/Group/CreateGroup.js
import React, { useState } from "react";
import { db } from "../../firebase/firebaseConfig";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { useHistory } from "react-router-dom";

const CreateGroup = () => {
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const { currentUser } = useAuth();
  const history = useHistory();

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await addDoc(collection(db, "groups"), {
        groupName,
        description,
        createdBy: currentUser.uid,
        createdAt: Timestamp.now(),
      });
      history.push("/dashboard");
    } catch (err) {
      setError("Failed to create group. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Create Group</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleCreateGroup}>
        <div className="form-group mt-3">
          <label>Group Name</label>
          <input
            type="text"
            className="form-control"
            required
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
        </div>
        <div className="form-group mt-3">
          <label>Description</label>
          <textarea
            className="form-control"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary mt-4">
          Create Group
        </button>
      </form>
    </div>
  );
};

export default CreateGroup;
