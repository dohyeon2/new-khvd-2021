import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUser, setUserSuccess } from '../modules/user';
import { web } from '../vars/credential.json';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { apiURI } from '../vars/api';
import axios from 'axios';

function LoginBtn() {
    //global states
    const { user } = useSelector(s => s);
    const dispatch = useDispatch();

    function dispatchUserToRedux(data) {
        //리덕스 스테이트에 유저 정보를 등록합니다.
        dispatch(setUser());
        dispatch(setUserSuccess(data));
    }

    async function signonBackend(googleLoginResponse) {
        //데이터 서버에 로그인합니다.
        if (IsKHUEmail(googleLoginResponse.profileObj.email)) {
            const userData = await axios.post(apiURI + 'khvd/v1/signon', {
                id_token: googleLoginResponse.tokenObj.id_token,
                tokenExist: localStorage.getItem("khvd_user_token") ? true : false,
            });
            const token = userData?.data?.wordpressData?.data?.tokenObj?.data?.token;
            token && localStorage.setItem("khvd_user_token", token);
            dispatchUserToRedux({
                googleData: googleLoginResponse,
                wordpressData: userData.data,
            });
            console.log(googleLoginResponse.tokenObj);
            localStorage.setItem("google_access_token", googleLoginResponse.tokenObj.access_token);
        } else {
            window.alert("경희대학교 이메일로 로그인해주세요.");
        }
    }

    const responseGoogleOnSuccess = (response) => {
        //구글 로그인 성공 시 응답입니다.
        signonBackend(response);
    }

    const responseGoogleOnFail = (response) => {
        //구글 로그인 실패 시 응답입니다.
        console.log(response);
    }

    const responseGoogleLogOutSuccess = async () => {
        localStorage.removeItem("khvd_user_token");
        dispatch(setUser());
        dispatch(setUserSuccess(null));
    }
    function IsKHUEmail(email) {
        //경희대학교 이메일이 맞는지 확인합니다.
        const host = email.split("@")[1];
        if (host === "khu.ac.kr") return true;
        else return false;
    }

    if (user.loading) {
        return (<div>Loading...</div>);
    }

    if (!user.data) {
        return (
            <GoogleLogin
                clientId={web.client_id}
                buttonText="Login"
                onSuccess={responseGoogleOnSuccess}
                onFailure={responseGoogleOnFail}
                cookiePolicy={'single_host_origin'}
                scope={"profile email https://www.googleapis.com/auth/drive"}
                isSignedIn={true}
            />
        );
    }

    return (<GoogleLogout onLogoutSuccess={responseGoogleLogOutSuccess} />);

}

export default LoginBtn;