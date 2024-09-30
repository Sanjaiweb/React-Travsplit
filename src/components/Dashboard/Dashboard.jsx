// src/components/Dashboard/Dashboard.js
import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import TotalExpenses from "./TotalExpenses";
import TripStatistics from "./TripStatistics";
import RecentTransactions from "./RecentTransactions";
import { db } from "../../firebase/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

const Dashboard = () => {
  const { currentUser } = useAuth();

  return (
    <div className="container mt-5">
      <h2>Welcome, {currentUser.email}!</h2>
      <div className="mt-4">
        <Link to="/group/create" className="btn btn-success mr-2">
          Create Group
        </Link>
        <Link to="/expense/add" className="btn btn-primary">
          Add Expense
        </Link>
      </div>

      <div className="mt-5">
        <TotalExpenses />
      </div>

      <div className="mt-5">
        <TripStatistics />
      </div>

      <div className="mt-5">
        <RecentTransactions />
      </div>
    </div>
  );
};

export default Dashboard;
