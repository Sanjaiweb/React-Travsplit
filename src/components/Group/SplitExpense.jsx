// src/components/Group/SplitExpense.js
import React, { useState, useEffect } from "react";
import { db } from "../../firebase/firebaseConfig";
import { collection, query, where, getDocs, addDoc, Timestamp } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { useHistory, useParams } from "react-router-dom";

const SplitExpense = () => {
  const { groupId } = useParams();
  const { currentUser } = useAuth();
  const [totalAmount, setTotalAmount] = useState("");
  const [members, setMembers] = useState([]);
  const [error, setError] = useState("");
  const history = useHistory();

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const membersRef = collection(db, "group_members");
        const q = query(membersRef, where("groupId", "==", groupId));
        const querySnapshot = await getDocs(q);
        const memberIds = [];
        querySnapshot.forEach((doc) => {
          memberIds.push(doc.data().userId);
        });

        // Fetch user details
        const usersRef = collection(db, "users");
        const usersQuery = query(usersRef, where("__name__", "in", memberIds));
        const usersSnapshot = await getDocs(usersQuery);
        const userList = [];
        usersSnapshot.forEach((doc) => {
          userList.push({ id: doc.id, ...doc.data() });
        });

        setMembers(userList);
      } catch (err) {
        setError("Failed to fetch group members.");
        console.error(err);
      }
    };

    fetchMembers();
  }, [groupId]);

  const handleSplitExpense = async (e) => {
    e.preventDefault();
    setError("");

    const amount = parseFloat(totalAmount);
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    const splitAmount = amount / members.length;

    try {
      // Add expense document
      await addDoc(collection(db, "expenses"), {
        groupId,
        userId: currentUser.uid,
        amount,
        splitAmount,
        createdAt: Timestamp.now(),
      });

      // Optionally, notify members about the new expense via a separate collection or real-time updates

      history.push("/dashboard");
    } catch (err) {
      setError("Failed to split expense. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Split Expense</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSplitExpense}>
        <div className="form-group mt-3">
          <label>Total Expense Amount</label>
          <input
            type="number"
            className="form-control"
            required
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
          />
        </div>
        <div className="mt-3">
          <h4>Members:</h4>
          <ul className="list-group">
            {members.map((member) => (
              <li key={member.id} className="list-group-item">
                {member.username} - ${ (parseFloat(totalAmount) / members.length).toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
        <button type="submit" className="btn btn-primary mt-4">
          Split Expense
        </button>
      </form>
    </div>
  );
};

export default SplitExpense;
