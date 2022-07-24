import axios from "axios";
import CookieManager from "./CookieManager";



export const host = '192.168.43.105';
export const hostWithPort = `${host}:3001`;
export const baseHttpURL = `http://${hostWithPort}`;
export const baseURLPref = `${baseHttpURL}/api/v1`;
export const baseWsURL = `ws://${hostWithPort}`;
const timeout = 30000e3;

export const axiosInstanceToAPI = axios.create({
    baseURL: baseURLPref,
    timeout,
});

export const axiosAuthInstanceToAPI = axios.create({
    baseURL: baseURLPref,
    timeout,
    headers: {
        "Access-Control-Allow-Origin"   : "*",
        "Access-Control-Allow-Methods" : "DELETE, POST, GET, OPTIONS",
        "Access-Control-Allow-Headers" : "Content-Type, Authorization, X-Requested-With",
        Authorization: CookieManager.getCookie('jwt')
    }
});

export async function getUserDataFromJwtReq() {
    const res = await axiosAuthInstanceToAPI.get('/user/profile');
    return res?.data;
}
