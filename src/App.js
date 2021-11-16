import React, { useEffect } from 'react';
import { Switch, Route } from "react-router-dom";
import MyDashboardContainer from './pages/MyDashboardContainer';
import { useHistory } from 'react-router';
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
import ParticipantList from './pages/ParticipantList';
import Participant from './pages/Participant';
import { getCookie } from './utils/functions';
import FloatingMenu from './components/FloatingMenu';
import { PageLoading } from './components/Loading';
import IntroAnimation from './pages/IntroAnimation';
import Guestbook from './pages/Guestbook';
import GuestbookEditor from './components/GuestbookEditor';
import GuestbookViewer from './components/GuestbookViewer';
import PopupStore from './pages/PopupStore';

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
  const { global, setGlobal } = useGlobal();
  const history = useHistory();
  history.listen(x => {
    document.getElementById("root").scrollTo({ top: 0, left: 0 });
  });
  useEffect(() => {
    if (getCookie("skip_intro") === "1") {
      setGlobal({ intro: false });
    }
  }, []);
  return (
    <>
      <GlobalStyle />
      <Appbar />
      <Switch>
        <Route path="/" exact>
          {global.intro ? <Intro /> : <Main />}
          {global.intro && <IntroAnimation />}
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
        <Route path="/participant/:id">
          <Participant />
        </Route>
        <Route path="/participant">
          <ParticipantList />
        </Route>
        <Route path="/guestbook">
          <Guestbook />
        </Route>
        <Route path="/popupstore">
          <PopupStore />
        </Route>
        <Route path="/my-dashboard/:page">
          <MyDashboardContainer />
        </Route>
        <Route path="/my-dashboard">
          <MyDashboardContainer />
        </Route>
      </Switch>
      {<PageLoading />}
      {global.floatingMenu && <FloatingMenu />}
      {global.footer && <Footer />}
      {global.editorVisible &&
        <GuestbookEditor {...global.editorData} />
      }
      {global.guestbookData &&
        <GuestbookViewer {...global.guestbookData} />
      }
    </>
  );
}

export default App;
