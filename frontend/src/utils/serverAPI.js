import axios from "axios";
import CookieManager from "./CookieManager";

//school: 192.168.0.132:5000
//ganju's: 79.115.133.126:5000
const host = '192.168.0.132:5000';
export const baseHttpURL = `http://${host}`;
export const baseURLPref = `${baseHttpURL}/api/v1`;
export const baseWsURL = `ws://${host}`;
const timeout = 2e3;

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
    return res.data;
}