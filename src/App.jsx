// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Dashboard from "./components/Dashboard/Dashboard";
import CreateGroup from "./components/Group/CreateGroup";
import AddMember from "./components/Group/AddMember";
import EditMember from "./components/Group/EditMember";
import DeleteMember from "./components/Group/DeleteMember";
import SplitExpense from "./components/Group/SplitExpense";
import AddExpense from "./components/Expense/AddExpense";
import EditExpense from "./components/Expense/EditExpense";
import DeleteExpense from "./components/Expense/DeleteExpense";
import PaymentPage from "./components/Payment/PaymentPage";
import PaymentStatus from "./components/Payment/PaymentStatus";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Switch>
          {/* Public Routes */}
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />

          {/* Private Routes */}
          <PrivateRoute exact path="/dashboard" component={Dashboard} />
          <PrivateRoute exact path="/group/create" component={CreateGroup} />
          <PrivateRoute exact path="/group/add-member/:groupId" component={AddMember} />
          <PrivateRoute exact path="/group/edit-member/:memberId" component={EditMember} />
          <PrivateRoute exact path="/group/delete-member/:memberId" component={DeleteMember} />
          <PrivateRoute exact path="/group/split-expense/:groupId" component={SplitExpense} />
          <PrivateRoute exact path="/expense/add" component={AddExpense} />
          <PrivateRoute exact path="/expense/edit/:expenseId" component={EditExpense} />
          <PrivateRoute exact path="/expense/delete/:expenseId" component={DeleteExpense} />
          <PrivateRoute exact path="/payment/:groupId" component={PaymentPage} />
          <PrivateRoute exact path="/payment/status" component={PaymentStatus} />

          {/* Default Route */}
          <PrivateRoute path="/" component={Dashboard} />
        </Switch>
      </Router>
    </AuthProvider>
  );
}

export default App;
