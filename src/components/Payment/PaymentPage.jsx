// src/components/Payment/PaymentPage.js
import React, { useState } from "react";
import { db } from "../../firebase/firebaseConfig";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { useHistory, useParams } from "react-router-dom";

const PaymentPage = () => {
  const { groupId } = useParams();
  const { currentUser } = useAuth();
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const history = useHistory();

  const handlePayment = async (e) => {
    e.preventDefault();
    setError("");

    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    try {
      // Create a payment record in Firestore
      await addDoc(collection(db, "payments"), {
        groupId,
        userId: currentUser.uid,
        amount: amt,
        status: "pending",
        createdAt: Timestamp.now(),
      });

      alert("Payment record created successfully!");
      history.push("/dashboard"); // Redirect to dashboard after payment record creation
    } catch (err) {
      setError("Failed to initiate payment. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Record a Payment</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handlePayment}>
        <div className="form-group mt-3">
          <label>Amount to Pay</label>
          <input
            type="number"
            className="form-control"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-success mt-4">
          Record Payment
        </button>
      </form>
    </div>
  );
};

export default PaymentPage;
