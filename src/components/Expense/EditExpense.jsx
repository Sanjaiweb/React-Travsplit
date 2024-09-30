// src/components/Expense/EditExpense.js
import React, { useState, useEffect } from "react";
import { db } from "../../firebase/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useHistory, useParams } from "react-router-dom";

const EditExpense = () => {
  const { expenseId } = useParams();
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const history = useHistory();

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const expenseRef = doc(db, "expenses", expenseId);
        const expenseSnap = await getDoc(expenseRef);
        if (expenseSnap.exists()) {
          const expenseData = expenseSnap.data();
          setDescription(expenseData.description);
          setAmount(expenseData.amount);
        } else {
          setError("Expense not found.");
        }
      } catch (err) {
        setError("Failed to fetch expense details.");
        console.error(err);
      }
    };

    fetchExpense();
  }, [expenseId]);

  const handleEditExpense = async (e) => {
    e.preventDefault();
    setError("");

    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    try {
      const expenseRef = doc(db, "expenses", expenseId);
      await updateDoc(expenseRef, {
        description,
        amount: amt,
      });

      history.push("/dashboard");
    } catch (err) {
      setError("Failed to update expense. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Edit Expense</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleEditExpense}>
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
          Update Expense
        </button>
      </form>
    </div>
  );
};

export default EditExpense;
