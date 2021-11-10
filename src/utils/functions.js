/**
 * 쿠키 키, 밸류, 만료 기간을 입력받아 쿠키를 생성하는 함수
 * @param {string} cname 쿠키 key
 * @param {string} cvalue 쿠키 value
 * @param {int} exdays 쿠키 만료 기간
 */
export function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

/**
 * 쿠키의 키값을 입력받아 쿠키의 값을 출력하는 함수
 * @param {string} cname 
 * @returns {string} 쿠키의 값, 없으면 빈 문자열
 */
export function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

/**
 * key:value 오브젝트를 입력받아 querystring으로 바꿔주는 함수
 * @param {object} object 
 * @returns {string} query
 */
export const parseObjectToQuery = (object) => {
    let result = [];
    for (let i in object) {
        const curr = object[i];
        result.push(i + "=" + curr);
    }
    return result.join("&");
}

const getRelativeFrame = (currentFrame, start) => {
    return (currentFrame - start) > 0 ? (currentFrame - start) : 0;
}
const getPercent = (relativeFrame, end, start) => {
    return (relativeFrame / (end - start)) > 0 ? relativeFrame / (end - start) : 0
}
const getCurrentProceed = (goal, percent) => {
    return (goal * percent) > goal ? goal : goal * percent;
}

/**
 * 프레임 정보를 받아 시작 프레임 부터 종료 프레임 까지의 비율을 목적 값에 매핑하여 반환
 * @param {int} frame 현재 프레임
 * @param {int} start 시작 프레임
 * @param {int} end 종료 프레임
 * @param {int} goal 목적 값
 * @returns 목적 값까지 비율
 */
export const getSubFramePercent = (frame, start, end, goal) => {
    const relativeFrame = getRelativeFrame(frame, start);
    const percent = getPercent(relativeFrame, end, start);
    const currentProceed = getCurrentProceed(goal, percent);
    return currentProceed;
}

/**
 * 현재 기기가 터치를 지원하는지 확인
 * @returns {boolean} 터치 지원 여부
 */
export function isTouchDevice() {
    return (('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0));
}

/**
 * 
 * @param {string} c #hex color 
 * @returns {float} luma = 밝음 정도
 */
export function getColorBrightness(c) {
    c = c.substring(1);      // strip #
    let rgb = parseInt(c, 16);   // convert rrggbb to decimal
    let r = (rgb >> 16) & 0xff;  // extract red
    let g = (rgb >> 8) & 0xff;  // extract green
    let b = (rgb >> 0) & 0xff;  // extract blue

    let luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709

    return luma;
}

export default { setCookie, getCookie, parseObjectToQuery, getSubFramePercent, isTouchDevice };