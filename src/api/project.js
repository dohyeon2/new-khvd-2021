import axios from "axios";
import { apiURI } from "../vars/api";
import { parseObjectToQuery } from "../utils/functions";
export const getPostApi = async (queries) =>
    axios.get(`${apiURI}khvd/v1/project?${parseObjectToQuery({
        ...queries,
    })}`);
