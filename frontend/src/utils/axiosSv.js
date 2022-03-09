import axios from "axios";

const baseURL = 'http://79.115.133.126:5000/api/v1';
const timeout = 5e3;

export const axiosInstanceToAPI = axios.create({
    baseURL,
    timeout,
});