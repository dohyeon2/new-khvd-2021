import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { setUser, setUserSuccess } from '../modules/user';
import { googleAPIClientID } from '../vars/credential';
import { GoogleLogin, GoogleLogout } from 'react-google-login';

const DashBoardContainer = styled.div`

`;

function MyDashboard() {
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
        <DashBoardContainer>
            <GoogleLogin
                clientId={googleAPIClientID}
                buttonText="Login"
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                cookiePolicy={'single_host_origin'}
                isSignedIn={true}
            />
            <GoogleLogout />
        </DashBoardContainer>
    );
}

export default MyDashboard;