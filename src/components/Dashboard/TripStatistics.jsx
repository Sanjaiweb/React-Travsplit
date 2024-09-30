// src/components/Dashboard/TripStatistics.js
import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";

const TripStatistics = () => {
  const { currentUser } = useAuth();
  const [totalTrips, setTotalTrips] = useState(0);

  useEffect(() => {
    const fetchTotalTrips = async () => {
      const groupsRef = collection(db, "groups");
      const q = query(groupsRef, where("createdBy", "==", currentUser.uid));
      const querySnapshot = await getDocs(q);
      setTotalTrips(querySnapshot.size);
    };

    fetchTotalTrips();
  }, [currentUser]);

  return (
    <div className="card">
      <div className="card-header">Trip Statistics</div>
      <div className="card-body">
        <h5 className="card-title">{totalTrips} Trips/Groups</h5>
      </div>
    </div>
  );
};

export default TripStatistics;
