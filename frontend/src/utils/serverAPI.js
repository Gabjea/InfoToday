import axios from "axios";
import CookieManager from "./CookieManager";

const host = '192.168.0.132:5000';
export const baseHttpURL = `http://${host}`;
export const baseURLPref = `${baseHttpURL}/api/v1`;
export const baseWsURL = `ws://${host}`;
const timeout = 5e3;

export const axiosInstanceToAPI = axios.create({
    baseURL: baseURLPref,
    timeout,
});

export const axiosAuthInstanceToAPI = axios.create({
    baseURL: baseURLPref,
    timeout,
    headers: {
        Authorization: CookieManager.getCookie('jwt')
    }
});