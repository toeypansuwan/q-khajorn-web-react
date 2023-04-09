import axios from "axios";
import { BASE_URL_API } from "./services";
import liff from "@line/liff";
import jwt from 'jwt-decode'

const token = localStorage.getItem("accessToken");
const loginUser = async ({ email, password }) => {
    const data = {
        email,
        password
    }
    try {
        const res_data = (await axios.post(`${BASE_URL_API}auth/login`, data)).data
        const access_token = res_data.access_token;
        localStorage.setItem("accessToken", access_token)
        return true;
    } catch (err) {
        localStorage.setItem("accessToken", null)
        return false;
    }
}
const checkAuth = () => {
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    if (!token) {
        return false;
    }
    try {
        const decodedToken = jwt(token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
            localStorage.removeItem('accessToken')
            return false;
        }
        return true;
    } catch (error) {
        console.error('Error decoding token:', error);
        return false;
    }
};
const logoutUser = () => {
    localStorage.removeItem('accessToken');
    // navigate('/system/login');
    return true;
}

const switchRich = async (key) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            }
        }
        const res_data = (await axios.post(`${BASE_URL_API}auth/switch-rich-menu`, { lineId: (await liff.getProfile()).userId, key }, config)).data
        if (res_data.res_code == 200) {
            return true;
        }
    } catch (err) {
        return false;
    }
}

export {
    loginUser,
    token,
    switchRich,
    checkAuth,
    logoutUser
}