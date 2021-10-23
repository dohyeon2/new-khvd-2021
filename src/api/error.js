import axios from "axios";
import { apiURI } from "../vars/api";

export const writeErrorLog = async ({ content, meta }) => {
    console.log('서버에 에러를 씁니다');
    try {
        const error = await axios.post(apiURI + 'khvd/v1/error',
            {
                title: "error_log",
                content: content,
                meta: meta || [],
            },
            {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("khvd_user_token"),
                }
            });
        return error;
    } catch (e) {
        window.alert("에러 쓰기에 실패했습니다.\n" + e.response.data.message);
    }
}