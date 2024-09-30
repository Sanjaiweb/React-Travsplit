// src/components/Expense/AddExpense.js
import React, { useState, useEffect } from "react";
import { db } from "../../firebase/firebaseConfig";
import { collection, query, where, getDocs, addDoc, Timestamp } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { useHistory } from "react-router-dom";

const AddExpense = () => {
  const { currentUser } = useAuth();
  const [groups, setGroups] = useState([]);
  const [groupId, setGroupId] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const history = useHistory();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const groupsRef = collection(db, "groups");
        const q = query(groupsRef, where("createdBy", "==", currentUser.uid));
        const querySnapshot = await getDocs(q);
        const groupList = [];
        querySnapshot.forEach((doc) => {
          groupList.push({ id: doc.id, ...doc.data() });
        });
        setGroups(groupList);
      } catch (err) {
        setError("Failed to fetch groups.");
        console.error(err);
      }
    };

    fetchGroups();
  }, [currentUser]);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    setError("");

    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    if (!groupId) {
      setError("Please select a group.");
      return;
    }

    try {
      await addDoc(collection(db, "expenses"), {
        groupId,
        userId: currentUser.uid,
        description,
        amount: amt,
        createdAt: Timestamp.now(),
      });

      history.push("/dashboard");
    } catch (err) {
      setError("Failed to add expense. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Add Expense</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleAddExpense}>
        <div className="form-group mt-3">
          <label>Group</label>
          <select
            className="form-control"
            value={groupId}
            onChange={(e) => setGroupId(e.target.value)}
            required
          >
            <option value="">Select Group</option>
            {groups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.groupName}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group mt-3">
          <label>Description</label>
          <input
            type="text"
            className="form-control"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="form-group mt-3">
          <label>Amount</label>
          <input
            type="number"
            className="form-control"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary mt-4">
          Add Expense
        </button>
      </form>
    </div>
  );
};

export default AddExpense;
