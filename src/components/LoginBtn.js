import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUser, setUserSuccess } from '../modules/user';
import { googleAPIClientID } from '../vars/credential';
import { GoogleLogin, GoogleLogout } from 'react-google-login';

function LoginBtn() {
    //global states
    const { user } = useSelector(s => s);
    const dispatch = useDispatch();

    //구글 로그인 응답
    const responseGoogle = (response) => {
        dispatch(setUser());
        dispatch(setUserSuccess(response));
    }

    if (user.loading) {
        return (<div>Loading...</div>);
    }

    if (!user.data) {
        return (
            <GoogleLogin
                clientId={googleAPIClientID}
                buttonText="Login"
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                cookiePolicy={'single_host_origin'}
                isSignedIn={true}
            />
        );
    }

    return (<GoogleLogout onLogoutSuccess={() => {
        dispatch(setUser());
        dispatch(setUserSuccess(null));
    }} />);

}

export default LoginBtn;