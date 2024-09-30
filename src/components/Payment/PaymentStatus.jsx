// src/components/Payment/PaymentStatus.js
import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebaseConfig";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";

const PaymentStatus = () => {
  const { currentUser } = useAuth();
  const [payments, setPayments] = useState([]);
  const [statusUpdates, setStatusUpdates] = useState({});

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const paymentsRef = collection(db, "payments");
        const q = query(paymentsRef, where("userId", "==", currentUser.uid));
        const querySnapshot = await getDocs(q);
        const paymentList = [];
        querySnapshot.forEach((doc) => {
          paymentList.push({ id: doc.id, ...doc.data() });
        });
        setPayments(paymentList);
      } catch (err) {
        console.error("Failed to fetch payments:", err);
      }
    };

    fetchPayments();
  }, [currentUser]);

  const handleStatusChange = (paymentId, newStatus) => {
    setStatusUpdates((prev) => ({ ...prev, [paymentId]: newStatus }));
  };

  const updatePaymentStatus = async (paymentId) => {
    try {
      const paymentRef = doc(db, "payments", paymentId);
      await updateDoc(paymentRef, {
        status: statusUpdates[paymentId],
      });
      alert("Payment status updated successfully!");
    } catch (err) {
      console.error("Failed to update payment status:", err);
      alert("Failed to update payment status.");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Payment Status</h2>
      {payments.length > 0 ? (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Group ID</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td>{payment.groupId}</td>
                <td>${payment.amount.toFixed(2)}</td>
                <td>{payment.status}</td>
                <td>{payment.createdAt.toDate().toLocaleDateString()}</td>
                <td>
                  <select
                    value={statusUpdates[payment.id] || payment.status}
                    onChange={(e) => handleStatusChange(payment.id, e.target.value)}
                  >
                    <option value="paid">Paid</option>
                    <option value="unpaid">Unpaid</option>
                  </select>
                  <button onClick={() => updatePaymentStatus(payment.id)} className="btn btn-sm btn-primary ml-2">
                    Update Status
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No payments found.</p>
      )}
    </div>
  );
};

export default PaymentStatus;
