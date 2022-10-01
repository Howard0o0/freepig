var token = ""
const baseURL = "https://182.92.109.123:8080/api/v1"
import { api } from '../config/api.js';

async function refreshUserInfo() {
    var resp = await api.getUserInfoFromServer()
    uni.$u.vuex('vuex_user', resp.data);
}

export default {
    token,
    baseURL,
    refreshUserInfo,
}

export const utils = {
    refreshUserInfo
}