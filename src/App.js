import React, { useRef, useEffect } from 'react';
import { Switch, Route, useLocation } from "react-router-dom";
import MyDashboardContainer from './pages/MyDashboardContainer';
import 'normalize.css';
import './App.css'
import Project from './pages/Project';
import ProjectList from './pages/ProjectList';
import LoginCallBack from './pages/LoginCallBack';
import ProjectListTest from './pages/ProjectListTest';
import Intro from './pages/Intro';
import useGlobal from './hook/useGlobal';
import Main from './pages/Main';
import Appbar from './components/Appbar';
import Footer from './components/Footer';

function App() {
  const { global } = useGlobal();
  const location = useLocation();
  return (
    <>
      <Appbar />
      <Switch>
        <Route path="/" exact>
          {global.intro ? <Intro /> : <Main />}
        </Route>
        <Route path="/login">
          <LoginCallBack />
        </Route>
        <Route path="/project/:id">
          <Project />
        </Route>
        <Route path="/project_admin">
          <ProjectListTest />
        </Route>
        <Route path="/project">
          <ProjectList />
        </Route>
        <Route path="/my-dashboard/:page">
          <MyDashboardContainer />
        </Route>
        <Route path="/my-dashboard">
          <MyDashboardContainer />
        </Route>
      </Switch>
      <Footer />
    </>
  );
}

export default App;
