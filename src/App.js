import React, { useEffect } from 'react';
import Editor from './components/Editor';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { setUser, setUserSuccess } from './modules/user';
import { googleAPIClientID } from './vars/credential';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

const EditorContainer = styled.div`
    border:1px solid #000;
`;

function App() {
  //global states
  const { user } = useSelector(s => s);
  const dispatch = useDispatch();

  //구글 로그인 응답
  const responseGoogle = (response) => {
    dispatch(setUser());
    dispatch(setUserSuccess(response));
  }

  useEffect(() => {
    console.log(user);
  }, [user, googleAPIClientID]);

  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <div className="app">
            <GoogleLogin
              clientId={googleAPIClientID}
              buttonText="Login"
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              cookiePolicy={'single_host_origin'}
              isSignedIn={true}
            />
            <GoogleLogout />
            <EditorContainer>
              <Editor />
            </EditorContainer>
          </div>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
