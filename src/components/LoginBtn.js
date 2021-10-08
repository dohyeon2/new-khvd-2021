import React from 'react';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import useUser from '../hook/useUser';

function LoginBtn({ logoutRedirect }) {
    const { responseGoogleLogOutSuccess, options, user } = useUser({ logoutRedirect: logoutRedirect });

    if (user.loading) {
        return (<div>Loading...</div>);
    }

    if (!user.data) {
        return (
            <GoogleLogin {...{ ...options, loggedIn: false }} />
        );
    }

    return (<GoogleLogout onLogoutSuccess={responseGoogleLogOutSuccess} />);

}

export default LoginBtn;