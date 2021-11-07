import axios from 'axios';
import credential from '../vars/credential.json';
import { useSelector, useDispatch } from 'react-redux';
import { setUser, setUserSuccess } from '../reducers/user';
import { apiURI } from '../vars/api';

const objectToQuery = (object) => {
    const result = Object.keys(object).map((x) => {
        return encodeURI(x + "=" + object[x]);
    });
    return result.join("&");
};

const getUserInfoByToken = async (token) => {
    const userData = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo?alt=json', {
        headers: {
            Authorization: "Bearer " + token,
        }
    });
    return userData;
}
function useUser() {
    //global states
    const { user } = useSelector(s => s);
    const dispatch = useDispatch();

    function dispatchUserToRedux(data) {
        //리덕스 스테이트에 유저 정보를 등록합니다.
        dispatch(setUser());
        dispatch(setUserSuccess(data));
    }

    const oauthSignIn = () => {
        // Google's OAuth 2.0 endpoint for requesting an access token
        var oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
        // Create <form> element to submit parameters to OAuth 2.0 endpoint.
        var form = document.createElement('form');
        form.setAttribute('method', 'GET'); // Send as a GET request.
        form.setAttribute('action', oauth2Endpoint);

        // Parameters to pass to OAuth 2.0 endpoint.
        var params = {
            'client_id': credential.web.client_id,
            'redirect_uri': window.location.origin + "/login",
            'response_type': 'token',
            'scope': 'profile email https://www.googleapis.com/auth/drive',
            'include_granted_scopes': 'true',
            'state': 'pass-through value'
        };
        // Add form parameters as hidden input values.
        for (var p in params) {
            var input = document.createElement('input');
            input.setAttribute('type', 'hidden');
            input.setAttribute('name', p);
            input.setAttribute('value', params[p]);
            form.appendChild(input);
        }

        // Add form to page and submit it to open the OAuth 2.0 endpoint.
        document.body.appendChild(form);
        form.submit();
    }

    async function getUserInfo() {
        const userData = await axios.post(apiURI + `wp/v2/users/me`, {}, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("khvd_user_token"),
            }
        });
        dispatchUserToRedux({
            ...user.data,
            wordpressData: userData.data,
        });
    }

    async function signonBackend(attr) {
        const { email, access_token, picture } = attr;
        //데이터 서버에 로그인합니다.
        if (IsKHUEmail(email)) {
            try {
                const userSignon = await axios.post(apiURI + 'khvd/v1/signon', attr);
                const token = userSignon?.data.data.tokenObj.data.token;
                token && localStorage.setItem("khvd_user_token", token);

                const userData = await axios.post(apiURI + `wp/v2/users/me`, {}, {
                    headers: {
                        Authorization: "Bearer " + token,
                    }
                });

                //어드민인지 확인
                const isAdmin = userData.data.roles?.includes("administrator");

                dispatchUserToRedux({
                    wordpressData: userData.data,
                    isAdmin: isAdmin,
                    googleData: {
                        picture: picture
                    }
                });

            } catch (e) {
                e.response?.data?.message ? window.alert(e.response.data.message) : window.alert("문제 발생");

            }

        } else {
            window.alert("경희대학교 이메일로 로그인해주세요.");
            return;
        }
    }
    function IsKHUEmail(email) {
        //경희대학교 이메일이 맞는지 확인합니다.
        const host = email.split("@")[1];
        if (host === "khu.ac.kr") return true;
        else return false;
    }

    return { oauthSignIn, user, dispatchUserToRedux, getUserInfo, signonBackend };
}

export default useUser;