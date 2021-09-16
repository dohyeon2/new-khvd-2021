//유저 상태를 관리하기 위한 reducer module

//action type contants
const SET_USER = 'user/SET_USER';
const SET_USER_SUCCESS = 'user/SET_USER_DATA';
const SET_USER_ERROR = 'user/SET_USER_ERROR';

//액션 생성 함수
export const setUser = () => ({ type: SET_USER });
export const setUserSuccess = (userData) => ({ type: SET_USER_SUCCESS, payload: userData });
export const setUserError = (error) => ({ type: SET_USER_ERROR, payload: error });

// 초기 상태
const initialState = {
    loading: false,
    data: null,
    error: false,
};

//리듀서 작성
export default function user(state = initialState, action) {

    switch (action.type) {

        case SET_USER:
            return {
                ...state,
                loading: true,
            }

        case SET_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload
            }

        case SET_USER_ERROR:
            return {
                ...state,
                loading: false,
                error: true,
            }
        default:
            return state;
            
    }

}