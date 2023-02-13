import axios from "axios";
import { BASE_URL_API } from "./services";

const token = localStorage.getItem("token");
const loginUser = async ({ email, password }) => {
    const data = {
        email,
        password
    }
    try {
        const res_data = await (await axios.post(`${BASE_URL_API}auth/login`, data)).data
        const access_token = res_data.access_token;
        localStorage.setItem("accessToken", access_token)
        return true;
    } catch (err) {
        localStorage.setItem("accessToken", null)
        return false;
    }
}
const isUserLogin = () => {
    return localStorage.accessToken !== undefined && localStorage.accessToken !== null;
}

const switchRich = () => {

}

export {
    loginUser,
    isUserLogin,
    token,
}