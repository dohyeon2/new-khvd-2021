import React, { useRef, useEffect } from 'react';
import { Switch, Route, useHistory } from "react-router-dom";
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
import ProjectCategory from './pages/ProjectCategory';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  @keyframes loadingPlaceholder{
      0%{
          background-color: #999;
      }
      100%{
          background-color: #333;
      }
  }
  @keyframes fadeIn{
    0%{
      opacity: 0;
    }
    100%{
      opacity:1;
    }
  }
`

function App() {
  const { global } = useGlobal();
  return (
    <>
      <GlobalStyle />
      <Appbar />
      <Switch>
        <Route path="/" exact>
          {global.intro ? <Intro /> : <Main />}
        </Route>
        <Route path="/login">
          <LoginCallBack />
        </Route>
        <Route path="/project_admin">
          <ProjectListTest />
        </Route>
        <Route path="/project/:categorySlug/:id">
          <Project />
        </Route>
        <Route path="/project/:categorySlug">
          <ProjectList />
        </Route>
        <Route path="/project">
          <ProjectCategory />
        </Route>
        <Route path="/my-dashboard/:page">
          <MyDashboardContainer />
        </Route>
        <Route path="/my-dashboard">
          <MyDashboardContainer />
        </Route>
      </Switch>
      {global.footer && <Footer />}
    </>
  );
}

export default App;
