import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

// screens
import Login from './screens/Login'
import AddPark from './screens/AddPark'
import Dashboard from './screens/Dashboard'
import Map from './screens/Map'

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/addpark">
          <AddPark />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/map">
          <Map />
        </Route>
        <Route path="/">
          <Dashboard />
        </Route>
      </Switch>
    </Router>
  );
}