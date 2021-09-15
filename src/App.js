import React, { useEffect } from 'react';
import Editor from './components/Editor';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { setUser, setUserSuccess } from './modules/user';
import { googleAPIClientID } from './vars/credential';

const EditorContainer = styled.div`
    border:1px solid #000;
`;

function App() {
  const { user } = useSelector(s => s);
  const dispatch = useDispatch();
  const responseGoogle = (response) => {
    dispatch(setUser());
    dispatch(setUserSuccess(response));
  }
  useEffect(() => {
    console.log(user);
  }, [user, googleAPIClientID]);

  
  return (
    <div className="App">
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
  );
}

export default App;
