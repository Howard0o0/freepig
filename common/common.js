import { api } from '../config/api.js';
import store from '../store/index.js';
import {
	mapState
} from "vuex";

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
    console.debug('wx login response: ', response)
    var wx_login_code = response[1].code
    console.debug("wx_login_code: ", wx_login_code)
    if (!wx_login_code || wx_login_code == "") {
        uni.$u.toast("微信登录失败: ", response[1].errMsg)
        console.error("wx login fail. err: ", response[1].errMsg)
        return false;
    }

    const resp = await api.getTokenFromServer({ wx_login_code: wx_login_code })
    console.debug("getTokenFromServer resp: ", resp)
    if (resp.code != api.SUCCESS_CODE) {
        uni.$u.toast("获取登录凭证失败")
        console.error("getTokenFromServer fail. resp: ", resp)
        return false;
    }
    uni.$u.vuex('vuex_token', resp.data.token);
    console.debug("token: ", store.state.vuex_token)

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

function getFirstImage(imageURLs) {
    if (!imageURLs) { return ""; }
    const tokens = imageURLs.split(',');
    if (tokens.length == 0) { return "" }
    return tokens[0]
}

function toUserHomePage(userID) {
    uni.navigateTo({
        url: '/page_subject/pages/user_info_detail?user_id=' + userID
    });
}

function timeFormatToNAgo(gmtTime) {
    var date = new Date(gmtTime);
    let ts = date.getTime()
    return getDateDiff(ts)
}

async function gotoChatRoomWithUser(toUserID) {
    uni.showLoading({
        title: '建立会话',
    });
    console.log('[DEBUG] create conversation with user ', toUserID)
    const resp = await api.createConversation(toUserID)
    if (resp.code != api.SUCCESS_CODE) {
        uni.showToast({
            title: '网络好像不太好',
            icon: "fail",
            duration: 1000,
        })
        return
    }
    const conversationID = resp.data.conversation_id
    console.log('[DEBUG] conversation id created: ', conversationID)
    store.commit('createConversationActive', {
        conversationID: conversationID,
        toUserId: toUserID.toString(),
    })
    uni.hideLoading();
    uni.navigateTo({
        url: '/page_subject/pages/chat'
    })
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
    getFirstImage,
    toUserHomePage,
    gotoChatRoomWithUser,
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
    getFirstImage,
    toUserHomePage,
    gotoChatRoomWithUser,
}
