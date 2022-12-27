import { api } from '../config/api.js';
import store from '../store/index.js';

async function refreshUserInfo() {
    var resp = await api.getUserInfoFromServer()
    if (resp.code != api.SUCCESS_CODE) {
        return false;
    }
    uni.$u.vuex('vuex_user', resp.data);
    return true;
}

function interceptUnauthorizedPageCallback() {
    console.debug('jumping to page mine')

    uni.showModal({
        content: "为了保证圈子的干净, 需要先认证呀 别忘了领红包哦! ＞▽＜ ",
        showCancel: false,
        success: async function (res) {
            uni.reLaunch({
                url: '/pages/mine/mine'
            })
        }
    })
}

function joinCampusAndMajorInfo(campusName, majorName) {
    return campusName + " | " + majorName
}

function myMessageToTIMMessage(myMessage, selfUserID, TIM) {
    let timMessage = {
        conversationID: myMessage.conversation_id,
        ID: myMessage.id,
        flow: ((myMessage.from_user_id + "") == (selfUserID + "")) ? "out" : "in",
        payload: (myMessage.type == "TEXT") ? { text: myMessage.payload } : { imageInfoArray: [{ url: myMessage.payload }] },
        type: (myMessage.type == "TEXT") ? TIM.TYPES.MSG_TEXT : TIM.TYPES.MSG_IMAGE,
        time: Date.parse(myMessage.created_at) / 1000,
    }
    return timMessage
}

function myMessageListToTIMMessageList(myMesageList, selfUserID, TIM) {
    let timMessageList = []
    for (let i in myMesageList) {
        let message = myMesageList[i]
        // call myMessageToTIMMessage fail????
        let timMessage = utils.myMessageToTIMMessage(message, selfUserID, TIM)
        // console.log("[DEBUG] message", timMessage)
        timMessageList.push(timMessage)
    }
    return timMessageList
}

async function ackLastRecvMessage(messageList, selfUserID) {
    for (let i = messageList.length - 1; i >= 0; i--) {
        let message = messageList[i]
        if (message.to_user_id != selfUserID) { continue }
        const resp = await api.ackMessage(message.id)
        if (resp.code != api.SUCCESS_CODE) {
            console.log('[ERROR] ack message ' + message.id + " failed. reason: ", resp.msg)
            return false
        }
        return true
    }
    return true
}

//TODO: move to common
async function getToken() {

    uni.showToast({
        title: '登录中',
        icon: 'loading',
        duration: 2000
    });

    const response = await uni.login({ provider: 'weixin' })
    console.log('[DBUEG] wx login response: ', response)
    var wx_login_code = response[1].code
    console.log("[DEBUG] wx_login_code: ", wx_login_code)
    if (!wx_login_code || wx_login_code == "") {
        uni.$u.toast("微信登录失败: ", response[1].errMsg)
        return false;
    }

    const resp = await api.getTokenFromServer({ wx_login_code: wx_login_code })
    if (resp.code != api.SUCCESS_CODE) {
        uni.$u.toast("获取登录凭证失败")
        return false;
    }
    uni.$u.vuex('vuex_token', resp.data.token);
    console.log("[DEBUG] token: ", store.state.vuex_token)

    return true
}

async function promiseRequestSubscribeMessage(templateIDList) {
    return new Promise(
        function (resolve, reject) {
            uni.requestSubscribeMessage({
                tmplIds: templateIDList,
                success(res) {
                    console.info('订阅微信提醒成功')
                    resolve(true)
                },
                fail(res) {
                    console.error('订阅微信提醒失败: ', res)
                    resolve(false)
                }
            })
        }
    )
}

function getDateDiff(milliSecTimestamp) {
    var minute = 1000 * 60;
    var hour = minute * 60;
    var day = hour * 24;
    var halfamonth = day * 15;
    var month = day * 30;
    var now = new Date().getTime();
    var diffValue = now - milliSecTimestamp;
    if (diffValue < 0) { return; }
    var monthC = diffValue / month;
    var weekC = diffValue / (7 * day);
    var dayC = diffValue / day;
    var hourC = diffValue / hour;
    var minC = diffValue / minute;
    let result = ""
    if (monthC >= 1) {
        result = "" + parseInt(monthC) + "月前";
    }
    else if (weekC >= 1) {
        result = "" + parseInt(weekC) + "周前";
    }
    else if (dayC >= 1) {
        result = "" + parseInt(dayC) + "天前";
    }
    else if (hourC >= 1) {
        result = "" + parseInt(hourC) + "小时前";
    }
    else if (minC >= 1) {
        result = "" + parseInt(minC) + "分钟前";
    } else {
        result = "刚刚";
    }

    return result;
}

function timeFormatToNAgo(gmtTime) {
    var date = new Date("2022-12-27T20:10:43+08:00");
    let ts = date.getTime()
    return getDateDiff(ts)
}

export default {
    refreshUserInfo,
    interceptUnauthorizedPageCallback,
    joinCampusAndMajorInfo,
    myMessageListToTIMMessageList,
    myMessageToTIMMessage,
    ackLastRecvMessage,
    getToken,
    promiseRequestSubscribeMessage,
    timeFormatToNAgo,
}

export const utils = {
    refreshUserInfo,
    interceptUnauthorizedPageCallback,
    joinCampusAndMajorInfo,
    myMessageListToTIMMessageList,
    myMessageToTIMMessage,
    ackLastRecvMessage,
    getToken,
    promiseRequestSubscribeMessage,
    timeFormatToNAgo,
}
