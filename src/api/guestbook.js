import axios from "axios";
import { apiURI } from "../vars/api";
import { parseObjectToQuery } from "../utils/functions";

export const writeGuestbook = async (params) =>
    axios.post(`${apiURI}khvd/v1/guestbook`, {
        ...params,
    });

export const getGuestbook = async (params) =>
    axios.get(`${apiURI}khvd/v1/guestbook?${parseObjectToQuery(params)}`);

export const deleteGuestbook = async (params) =>
    axios.delete(`${apiURI}khvd/v1/guestbook?${parseObjectToQuery(params)}`);
