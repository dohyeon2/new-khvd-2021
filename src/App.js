import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import MyDashboard from './components/MyDashboard';
import MyDashboardContainer from './pages/MyDashboardContainer';
import 'normalize.css';
import './App.css'

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
        </Route>
        <Route path="/login" exact>
          <MyDashboard />
        </Route>
        <Route path="/my-dashboard" exact>
          <MyDashboardContainer />
        </Route>
      </Switch>
    </Router >
  );
}

export default App;
