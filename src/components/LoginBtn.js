import React from 'react';
import useUser from '../hook/useUser.js';

function LoginBtn({ logoutRedirect }) {
    const { oauthSignIn } = useUser();
    return (
        <button onClick={() => {
            oauthSignIn();
        }}>로그인</button>
    );


}

export default LoginBtn;