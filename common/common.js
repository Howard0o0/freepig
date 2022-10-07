var token = ""
const baseURL = "https://182.92.109.123:8080/api/v1"
import { api } from '../config/api.js';

async function refreshUserInfo() {
    var resp = await api.getUserInfoFromServer()
    uni.$u.vuex('vuex_user', resp.data);
}

function interceptUnauthorizedPageCallback() {
    console.log('[DEBUG] jumping to page mine')
    uni.showToast({
        title: '为了保证圈子的干净, 需要先认证噢',
        icon: 'none',
        duration: 1000
    });

    setTimeout(() => {
        uni.reLaunch({
            url: '/pages/mine/mine'
        })
    }, 1000);
}

export default {
    token,
    baseURL,
    refreshUserInfo,
}

export const utils = {
    refreshUserInfo,
    interceptUnauthorizedPageCallback,
}