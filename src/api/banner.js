import axios from "axios";
import { apiURI } from "../vars/api";
import { parseObjectToQuery } from "../utils/functions";

export const getBanner = async (params) =>
    axios.get(`${apiURI}khvd/v1/banner?${parseObjectToQuery(params)}`);
