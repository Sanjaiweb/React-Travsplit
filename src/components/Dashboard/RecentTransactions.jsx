// src/components/Dashboard/RecentTransactions.js
import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebaseConfig";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";

const RecentTransactions = () => {
  const { currentUser } = useAuth();
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchRecentTransactions = async () => {
      const expensesRef = collection(db, "expenses");
      const q = query(
        expensesRef,
        where("userId", "==", currentUser.uid),
        orderBy("createdAt", "desc"),
        limit(5)
      );
      const querySnapshot = await getDocs(q);
      const recent = [];
      querySnapshot.forEach((doc) => {
        recent.push(doc.data());
      });
      setTransactions(recent);
    };

    fetchRecentTransactions();
  }, [currentUser]);

  return (
    <div className="card">
      <div className="card-header">Recent Transactions</div>
      <div className="card-body">
        {transactions.length > 0 ? (
          <ul className="list-group">
            {transactions.map((txn, index) => (
              <li key={index} className="list-group-item">
                <strong>{txn.description}</strong> - ${txn.amount.toFixed(2)} on{" "}
                {new Date(txn.createdAt.seconds * 1000).toLocaleDateString()}
              </li>
            ))}
          </ul>
        ) : (
          <p>No recent transactions.</p>
        )}
      </div>
    </div>
  );
};

export default RecentTransactions;
