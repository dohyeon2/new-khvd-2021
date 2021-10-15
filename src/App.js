import React, { useRef, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import MyDashboardContainer from './pages/MyDashboardContainer';
import 'normalize.css';
import './App.css'
import Project from './pages/Project';
import LoginCallBack from './pages/LoginCallBack';

function Image({ src }) {
  const wrap = useRef();
  useEffect(() => {
    const image = document.createElement('img');
    image.src = src;
    wrap.current.appendChild(image);
  })
  return <div className="image-wrap" ref={wrap}></div>
}

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <img src='http://drive.google.com/uc?export=view&id=1hsGzO7uv-mKg06UkM9eUEPx83gX5uNJV' />
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
