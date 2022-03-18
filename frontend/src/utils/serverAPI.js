import axios from "axios";
import CookieManager from "./CookieManager";

//school: 192.168.0.132:5000
//ganju's: 79.113.205.105:5000
const host = 'localhost:5000';
export const baseHttpURL = `http://${host}`;
export const baseURLPref = `${baseHttpURL}/api/v1`;
export const baseWsURL = `ws://${host}`;
const timeout = 30000e3;

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

export async function getUserDataFromJwtReq() {
    const res = await axiosAuthInstanceToAPI.get('/user/profile');
    return res?.data;
}