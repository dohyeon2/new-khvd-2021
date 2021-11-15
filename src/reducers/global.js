import { getCookie, setCookie } from "../utils/functions";

const INITIAL_STATE = {
    intro: getCookie("intro_skip") === "1" ? false : true,
    appbarVisibility: true,
    guestbookSeed: Date.now(),
    footer: true,
};

const SET_GLOBAL = 'global/SET_GLOBAL';

/**
 * 데이터 값을 입력받아, 글로벌 state 세팅을 위한 action object 반환하는 함수
 * @param {object} data Global state에 삽입할 새로운 state key:value 페어
 * @returns {object} Global state 설정을 위한 action object
 */
export const setGlobal = (data) => ({ type: SET_GLOBAL, payload: data });

/**
 * 글로벌 state 관리를 위한 global reducer정의
 * @param {object} state 상태
 * @param {object} action 액션 
 * @returns 새로운 상태 반환
 */
const global = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SET_GLOBAL:
            return {
                ...state,
                ...action.payload
            };
        default:
            return state;
    }
}

export default global;