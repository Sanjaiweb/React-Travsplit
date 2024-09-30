// src/components/Auth/Register.js
import React, { useState } from "react";
import { auth, db } from "../../firebase/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useHistory, Link } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const history = useHistory();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // Add user details to Firestore
      await setDoc(doc(db, "users", user.uid), {
        username,
        email,
        createdAt: new Date(),
      });
      history.push("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Register</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleRegister}>
        <div className="form-group mt-3">
          <label>Username</label>
          <input
            type="text"
            className="form-control"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group mt-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group mt-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary mt-4">
          Register
        </button>
      </form>
      <p className="mt-3">
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
};

export default Register;
