import { useSelector, useDispatch } from 'react-redux';
import { setUser, setUserSuccess } from '../modules/user';
import { web } from '../vars/credential.json';
import { useGoogleLogin } from 'react-google-login';
import { apiURI } from '../vars/api';
import axios from 'axios';
import { useHistory } from 'react-router';

export default function useUser(attr = {}) {
    //global states
    const { user } = useSelector(s => s);
    const dispatch = useDispatch();
    const history = useHistory();
    const options = {
        clientId: web.client_id,
        buttonText: "Login",
        onSuccess: responseGoogleOnSuccess,
        onFailure: responseGoogleOnFail,
        cookiePolicy: 'single_host_origin',
        scope: "profile email https://www.googleapis.com/auth/drive",
        isSignedIn: true,
    };
    const { signIn, loaded } = useGoogleLogin({ ...options, isSignedIn: attr.loggedIn || false });

    function dispatchUserToRedux(data) {
        //리덕스 스테이트에 유저 정보를 등록합니다.
        dispatch(setUser());
        dispatch(setUserSuccess(data));
    }

    async function signonBackend(googleLoginResponse) {
        //데이터 서버에 로그인합니다.
        if (IsKHUEmail(googleLoginResponse.profileObj.email)) {
            const userSignon = await axios.post(apiURI + 'khvd/v1/signon', {
                id_token: googleLoginResponse.tokenObj.id_token,
            });
            const token = userSignon?.data.data.tokenObj.data.token;
            token && localStorage.setItem("khvd_user_token", token);

            const userData = await axios.post(apiURI + `wp/v2/users/me`, {}, {
                headers: {
                    Authorization: "Bearer " + token,
                }
            });

            //재로그인 요청
            if (user.data?.reSignInTimeOut) {
                clearTimeout(user.data.reSignInTimeOut);
            }
            const timeOut = setTimeout(() => {
                signIn();
            }, googleLoginResponse.tokenObj.expires_in * 1000);

            //어드민인지 확인
            const isAdmin = userData.data.roles?.includes("administrator");

            dispatchUserToRedux({
                googleData: googleLoginResponse,
                wordpressData: userData.data,
                reSignInTimeOut: timeOut,
                isAdmin: isAdmin,
            });

            localStorage.setItem("google_access_token", googleLoginResponse.tokenObj.access_token);
            if (attr.logoutRedirect) {
                history.push(attr.logoutRedirect);
            }

        } else {
            window.alert("경희대학교 이메일로 로그인해주세요.");
            return;
        }
    }

    function responseGoogleOnSuccess(response) {
        //구글 로그인 성공 시 응답입니다.
        signonBackend(response);
    }

    function responseGoogleOnFail(response) {
        window.alert("구글에 로그인 하던 중 문제가 발생했습니다.");
        // console.log(response);
        //구글 로그인 실패 시 응답입니다.
    }

    const responseGoogleLogOutSuccess = async () => {
        localStorage.removeItem("khvd_user_token");
        dispatch(setUser());
        dispatch(setUserSuccess(null));
        if (attr.logoutRedirect) {
            history.push(attr.logoutRedirect);
        }
    }
    function IsKHUEmail(email) {
        //경희대학교 이메일이 맞는지 확인합니다.
        const host = email.split("@")[1];
        if (host === "khu.ac.kr") return true;
        else return false;
    }

    return { signIn, responseGoogleLogOutSuccess, options, user, dispatchUserToRedux };
}