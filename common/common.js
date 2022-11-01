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

function joinCampusAndMajorInfo(campusName, majorName) {
    return campusName + " | " + majorName
}

function myMessageToTIMMessage(myMessage, selfUserID, TIM) {
    let timMessage = {
        conversationID: myMessage.conversation_id,
        ID: myMessage.id,
        flow: (myMessage.from_user_id == selfUserID) ? "out" : "in",
        payload: (myMessage.type == "TEXT") ? { text: message.payload } : { imageInfoArray: [{ url: message.payload }] },
        type: (myMessage.type == "TEXT") ? TIM.TYPES.MSG_TEXT : TIM.TYPES.MSG_IMAGE,
    }
    return timMessage
}

function myMessageListToTIMMessageList(myMesageList, selfUserID, TIM) {
    let timMessageList = []
    for (let i in myMesageList) {
        let message = myMesageList[i]
        // call myMessageToTIMMessage fail????
        let timMessage = utils.myMessageToTIMMessage(message, selfUserID, TIM)
        console.log("[DEBUG] message", timMessage)
        timMessageList.push(timMessage)
    }
    return timMessageList
}

export default {
    refreshUserInfo,
}

export const utils = {
    refreshUserInfo,
    interceptUnauthorizedPageCallback,
    joinCampusAndMajorInfo,
    myMessageListToTIMMessageList,
    myMessageToTIMMessage,
}