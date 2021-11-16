import axios from "axios";
import { apiURI } from "../vars/api";

export const uploadFile = async (params) =>
    axios.post(`${apiURI}khvd/v1/file`,
        params,
        {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
