import axios from "axios";

const baseURL = 'http://192.168.0.132:5000/api/v1';
const timeout = 5e3;

export const axiosInstanceToAPI = axios.create({
    baseURL,
    timeout,
});