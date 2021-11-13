import axios from "axios";
import { apiURI } from "../vars/api";
import { parseObjectToQuery } from "../utils/functions";

export const getUserApi = async (queries) =>
    axios.get(`${apiURI}khvd/v1.1/users?${parseObjectToQuery({
        ...queries,
    })}`);
