import axios from 'axios';
import React, { useEffect } from 'react';
import useUser from '../hook/useUser';
import { useHistory } from 'react-router-dom';

function getGoogleTokenFromHash() {
  const hashList = window.location.hash.substring(1).split("&");
  const hashObject = {};
  hashList.map((x, i) => {
    const hashKeyNValue = x.split("=");
    hashObject[hashKeyNValue[0]] = hashKeyNValue[1];
  });
  const access_token = hashObject.access_token;
  return access_token;
}
function LoginCallBack() {
  const { signonBackend } = useUser();
  const history = useHistory();
  useEffect(() => {
    (async () => {
      const access_token = await getGoogleTokenFromHash();
      const userData = await axios.get("https://www.googleapis.com/oauth2/v1/userinfo?alt=json", {
        headers: {
          Authorization: "Bearer " + access_token,
        }
      });
      if (userData.error) return;
      signonBackend({
        email: userData.data.email,
        name: userData.data.name,
        userid: userData.data.id,
        picture: userData.data.picture,
      });
      history.push('/my-dashboard');
    })();
  }, []);
  return (
    <div>
      login...
    </div>
  );
}

export default LoginCallBack;