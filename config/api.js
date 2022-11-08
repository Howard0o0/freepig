
// post请求，通过wx_login_code获取token
export const getTokenFromServer = (params, config = {
    header: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
}) => uni.$u.http.post('/login/by-wx-account', params, config)

export const getUserInfoFromServer = (params = {}) => uni.$u.http.get('/user', {
    params: params,
    header: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
})

export const getTIMSig = () => uni.$u.http.get('/user/tim-sig', {
    header: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
})

export const getRecommendUserList = () => uni.$u.http.get('/user/recommend-list', {
    header: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
})

export const getRecommendRule = () => uni.$u.http.get('/activity/recommend/rule', {
    header: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
})

export const getCampusList = (keyword) => uni.$u.http.get('/info/campus', {
    params: { keyword: keyword },
    header: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
})

export const getMajorList = (campusID) => uni.$u.http.get('/info/major', {
    params: { campus_id: campusID },
    header: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
})

export const getEmailVerifyCode = (email) => uni.$u.http.get('/auth/emailcode', {
    params: { email: email },
    header: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
})

export const identifyByEmail = (email, emailVerifyCode, realname, campusID, majorID, kickoffYear, degree) => uni.$u.http.post('/auth/campus-identity-by-edu-email', {
    email: email,
    email_verify_code: emailVerifyCode,
    realname: realname,
    campus_id: campusID,
    major_id: majorID,
    kickoff_year: kickoffYear,
    degree: degree,
    recommend_code: recommendCode,
}, {
    header: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
})

export const identifyByCertification = (certificationImageFilePath, realname, campusID, majorID, kickoffYear, degree, recommendCode) => uni.$u.http.upload('/auth/campus-identity-by-student-credential', {
    formData: {
        realname: realname,
        campus_id: campusID,
        major_id: majorID,
        kickoff_year: kickoffYear,
        degree: degree,
        recommend_code: recommendCode,
    },
    filePath: certificationImageFilePath,
    name: "credential_image",
}, {
    header: {
        'Content-Type': 'multipart/form-data'
    }
})

export const getTagList = () => uni.$u.http.get('/goods/tag', {
    header: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
})

export const getUUID = () => uni.$u.http.get('/info/uuid', {
    header: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
})

export const uploadImage = (goodsID, imageFilePath) => uni.$u.http.upload('/info/image', {
    formData: {
        goods_id: goodsID
    },
    filePath: imageFilePath,
    name: "images",
})

export const publishGoods = (goodsID, goodsDesc, tagID, price, imageURLs) => uni.$u.http.post('/goods', {
    goods_id: goodsID,
    description: goodsDesc,
    price: price,
    cost: 0,
    images: imageURLs,
    tag_id: tagID,
}, {
    header: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
})

export const updateGoods = (goodsID, goodsDesc, tagID, price, imageURLs) => uni.$u.http.put('/goods', {
    goods_id: goodsID,
    description: goodsDesc,
    price: price,
    cost: 0,
    images: imageURLs,
    tag_id: tagID,
}, {
    header: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
})

export const updateGoodsInfo = (params = {}) => uni.$u.http.post('/goods', params, {
    header: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
})

export const setGoodsStatus = (goodsID, status) => uni.$u.http.post('/goods/status', { goods_id: goodsID, status: status }, {
    header: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
})

export const setUserInfo = (avatar_url, nickname, gender) => uni.$u.http.post('/user', {
    avatar_url: avatar_url,
    gender: gender,
    nickname: nickname,
}, {
    header: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
})

export const drawPrize = (email, bankAccount) => uni.$u.http.post('/activity/recommend/draw-prize', {
    email: email,
    bank_account: bankAccount,
}, {
    header: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
})

export const getGoodsList = (longitude = 0, latitude = 0, tagID = 0, keyword = "", pageIndex = 0, pageSize = 30) => uni.$u.http.get('/goods/', {
    header: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    params: {
        'longitude': longitude,
        'latitude': latitude,
        'tag_id': tagID,
        'keyword': keyword,
        'page_index': pageIndex,
        'page_size': pageSize,
    }
})

export const getMyGoodsList = () => uni.$u.http.get('/goods/by-user', {
    header: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
})

export const getPrizeUserList = () => uni.$u.http.get('/activity/recommend/prize-list', {
    header: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
})

export const verifyRecommendCode = (recommendCode) => uni.$u.http.get('/auth/verify-recommend-code', {
    header: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    params: {
        'recommend_code': recommendCode,
    }
})

export const getConversationList = () => uni.$u.http.get('/chat/conversation', {
    header: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    params: {}
})

export const getHistoryMessageListFromBeginning = (conversation_id, count) => uni.$u.http.get('/chat/conversation/history-message', {
    header: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    params: {
        'conversation_id': conversation_id,
        'count': count,
    }
})

export const getHistoryMessageList = (conversation_id, count, next_request_message_id) => uni.$u.http.get('/chat/conversation/history-message', {
    header: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    params: {
        'conversation_id': conversation_id,
        'next_request_message_id': next_request_message_id,
        'count': count,
    }
})

export const getLatestMessageList = (conversation_id, count) => uni.$u.http.get('chat/conversation/latest-message', {
    header: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    params: {
        'conversation_id': conversation_id,
        'size': count,
    }
})

// message : {
//     "to_user_id": to_user_id,
//     "type": type,
//     "payload": payload,
//     "conversation_id": conversationID,
// }
export const sendMessage = (message) => uni.$u.http.post('/chat/message', message, {
    header: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
})

export const ackMessage = (messageID) => uni.$u.http.post('/chat/message/ack', {
    message_id: messageID,
}, {
    header: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
})

export const SUCCESS_CODE = 200

export const api = {
    SUCCESS_CODE,
    getTokenFromServer,
    getUserInfoFromServer,
    getCampusList,
    getMajorList,
    getEmailVerifyCode,
    identifyByEmail,
    identifyByCertification,
    getTagList,
    getUUID,
    uploadImage,
    publishGoods,
    updateGoodsInfo,
    setGoodsStatus,
    getGoodsList,
    getMyGoodsList,
    getTIMSig,
    setUserInfo,
    updateGoods,
    getRecommendUserList,
    getRecommendRule,
    verifyRecommendCode,
    drawPrize,
    getPrizeUserList,
    getConversationList,
    getHistoryMessageListFromBeginning,
    getHistoryMessageList,
    sendMessage,
    ackMessage,
    getLatestMessageList,
}