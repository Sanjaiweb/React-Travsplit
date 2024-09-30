// src/components/Dashboard/TotalExpenses.js
import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";

const TotalExpenses = () => {
  const { currentUser } = useAuth();
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchTotalExpenses = async () => {
      const expensesRef = collection(db, "expenses");
      const q = query(expensesRef, where("userId", "==", currentUser.uid));
      const querySnapshot = await getDocs(q);
      let sum = 0;
      querySnapshot.forEach((doc) => {
        sum += doc.data().amount;
      });
      setTotal(sum);
    };

    fetchTotalExpenses();
  }, [currentUser]);

  return (
    <div className="card">
      <div className="card-header">Total Expenses</div>
      <div className="card-body">
        <h5 className="card-title">${total.toFixed(2)}</h5>
      </div>
    </div>
  );
};

export default TotalExpenses;
