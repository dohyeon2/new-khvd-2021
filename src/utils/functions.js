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

export default { setCookie, getCookie };