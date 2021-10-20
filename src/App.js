import React, { useRef, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import MyDashboardContainer from './pages/MyDashboardContainer';
import 'normalize.css';
import './App.css'
import Project from './pages/Project';
import LoginCallBack from './pages/LoginCallBack';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
      </Route>
      <Route path="/login">
        <LoginCallBack />
      </Route>
      <Route path="/projects">
      </Route>
      <Route path="/project/:id">
        <Project />
      </Route>
      <Route path="/my-dashboard/:page">
        <MyDashboardContainer />
      </Route>
      <Route path="/my-dashboard">
        <MyDashboardContainer />
      </Route>
    </Switch>
    </Router >
  );
}

export default App;
