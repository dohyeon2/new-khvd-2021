import axios from "axios";
import { apiURI } from "../vars/api";
import { parseObjectToQuery } from "../utils/functions";

export const getUserApi = async (queries) =>
    axios.get(`${apiURI}khvd/v1.1/users?${parseObjectToQuery({
        ...queries,
    })}`);

export const updateDesignerCheer = async (pid) =>
    axios.put(`${apiURI}khvd/v1/project`, {
        type: 'cheer',
        pid: pid
    });