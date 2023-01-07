import store from '../store/index.js';

// post请求，通过wx_login_code获取token
export const getTokenFromServer = (params, config = {
    header: {
        'Content-Type': 'application/x-www-form-urlencoded', 'Token': store.state.vuex_token,
    }
}) => uni.$u.http.post('/login/by-wx-account', params, config)

export const adminLogin = (username, passwd) => uni.$u.http.post('/login/by-username-passwd', {
    username: username,
    password: passwd,
}, {
    header: {
        'Content-Type': 'application/x-www-form-urlencoded', 'Token': store.state.vuex_token,
    }
})

export const getUserInfoFromServer = (params = {}) => uni.$u.http.get('/user', {
    params: params,
    header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Token': store.state.vuex_token,
    }
})

export const getTIMSig = () => uni.$u.http.get('/user/tim-sig', {
    header: {
        'Content-Type': 'application/x-www-form-urlencoded', 'Token': store.state.vuex_token,
    }
})

export const getRecommendUserList = () => uni.$u.http.get('/user/recommend-list', {
    header: {
        'Content-Type': 'application/x-www-form-urlencoded', 'Token': store.state.vuex_token,
    }
})

export const getRecommendRule = () => uni.$u.http.get('/activity/recommend/rule', {
    header: {
        'Content-Type': 'application/x-www-form-urlencoded', 'Token': store.state.vuex_token,
    }
})

export const getCampusList = (keyword) => uni.$u.http.get('/info/campus', {
    params: { keyword: keyword },
    header: {
        'Content-Type': 'application/x-www-form-urlencoded', 'Token': store.state.vuex_token,
    }
})

export const getMajorList = (campusID) => uni.$u.http.get('/info/major', {
    params: { campus_id: campusID },
    header: {
        'Content-Type': 'application/x-www-form-urlencoded', 'Token': store.state.vuex_token,
    }
})

export const getEmailVerifyCode = (email) => uni.$u.http.get('/auth/emailcode', {
    params: { email: email },
    header: {
        'Content-Type': 'application/x-www-form-urlencoded', 'Token': store.state.vuex_token,
    }
})

export const identifyByEmail = (email, emailVerifyCode, realname, campusID, majorID, kickoffYear, degree, recommendCode) => uni.$u.http.post('/auth/campus-identity-by-edu-email', {
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
        'Content-Type': 'application/x-www-form-urlencoded', 'Token': store.state.vuex_token,
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
        'Content-Type': 'application/x-www-form-urlencoded', 'Token': store.state.vuex_token,
    }
})

export const getUUID = () => uni.$u.http.get('/info/uuid', {
    header: {
        'Content-Type': 'application/x-www-form-urlencoded', 'Token': store.state.vuex_token,
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
        'Content-Type': 'application/x-www-form-urlencoded', 'Token': store.state.vuex_token,
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
        'Content-Type': 'application/x-www-form-urlencoded', 'Token': store.state.vuex_token,
    }
})

export const updateGoodsInfo = (params = {}) => uni.$u.http.post('/goods', params, {
    header: {
        'Content-Type': 'application/x-www-form-urlencoded', 'Token': store.state.vuex_token,
    }
})

export const setGoodsStatus = (goodsID, status) => uni.$u.http.post('/goods/status', { goods_id: goodsID, status: status }, {
    header: {
        'Content-Type': 'application/x-www-form-urlencoded', 'Token': store.state.vuex_token,
    }
})

export const setUserInfo = (avatar_url, nickname, gender, walletCodeURL) => uni.$u.http.post('/user', {
    avatar_url: avatar_url,
    gender: gender,
    nickname: nickname,
    wallet_code: walletCodeURL,
}, {
    header: {
        'Content-Type': 'application/x-www-form-urlencoded', 'Token': store.state.vuex_token,
    }
})

export const drawPrize = (payeeRealName, bankAccount) => uni.$u.http.post('/activity/recommend/draw-prize', {
    payee_realname: payeeRealName,
    bank_account: bankAccount,
}, {
    header: {
        'Content-Type': 'application/x-www-form-urlencoded', 'Token': store.state.vuex_token,
    }
})

export const getGoodsList = (longitude = 0, latitude = 0, tagID = 0, keyword = "", pageIndex = 0, pageSize = 30) => uni.$u.http.get('/goods/', {
    header: {
        'Content-Type': 'application/x-www-form-urlencoded', 'Token': store.state.vuex_token,
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

export const getArticleList = (longitude = 0, latitude = 0, pageIndex = 0, pageSize = 30, authorUserID = 0) => uni.$u.http.get('/article/', {
    header: {
        'Content-Type': 'application/x-www-form-urlencoded', 'Token': store.state.vuex_token,
    },
    params: {
        'longitude': longitude,
        'latitude': latitude,
        'page_index': pageIndex,
        'page_size': pageSize,
        'author_user_id': authorUserID,
    }
})

export const getUserGoodsList = (userID, pageIndex, pageSize) => uni.$u.http.get('/goods/by-user', {
    header: {
        'Content-Type': 'application/json', 'Token': store.state.vuex_token,
    },
    params: {
        'user_id': userID,
        'page_index': pageIndex,
        'page_size': pageSize,
    }
})

export const getGoodsByID = (id) => uni.$u.http.get('/goods/by-id', {
    header: {
        'Content-Type': 'application/json', 'Token': store.state.vuex_token,
    },
    params: {
        'id': id,
    }
})

export const getPrizeUserList = () => uni.$u.http.get('/activity/recommend/prize-list', {
    header: {
        'Content-Type': 'application/x-www-form-urlencoded', 'Token': store.state.vuex_token,
    }
})

export const verifyRecommendCode = (recommendCode) => uni.$u.http.get('/auth/verify-recommend-code', {
    header: {
        'Content-Type': 'application/x-www-form-urlencoded', 'Token': store.state.vuex_token,
    },
    params: {
        'recommend_code': recommendCode,
    }
})

export const getConversationList = () => uni.$u.http.get('/chat/conversation', {
    header: {
        'Content-Type': 'application/x-www-form-urlencoded', 'Token': store.state.vuex_token,
    },
    params: {}
})

export const getHistoryMessageListFromBeginning = (conversation_id, count) => uni.$u.http.get('/chat/conversation/history-message', {
    header: {
        'Content-Type': 'application/x-www-form-urlencoded', 'Token': store.state.vuex_token,
    },
    params: {
        'conversation_id': conversation_id,
        'count': count,
    }
})

export const getHistoryMessageList = (conversation_id, count, next_request_message_id) => uni.$u.http.get('/chat/conversation/history-message', {
    header: {
        'Content-Type': 'application/x-www-form-urlencoded', 'Token': store.state.vuex_token,
    },
    params: {
        'conversation_id': conversation_id,
        'next_request_message_id': next_request_message_id,
        'count': count,
    }
})

export const getLatestMessageList = (conversation_id, count) => uni.$u.http.get('chat/conversation/latest-message', {
    header: {
        'Content-Type': 'application/x-www-form-urlencoded', 'Token': store.state.vuex_token,
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
        'Content-Type': 'application/x-www-form-urlencoded', 'Token': store.state.vuex_token,
    }
})

export const ackMessage = (messageID) => uni.$u.http.post('/chat/message/ack', {
    message_id: messageID,
}, {
    header: {
        'Content-Type': 'application/x-www-form-urlencoded', 'Token': store.state.vuex_token,
    }
})

export const createConversation = (toUserID) => uni.$u.http.post('/chat/conversation', {
    to_user_id: toUserID,
}, {
    header: {
        'Content-Type': 'application/x-www-form-urlencoded', 'Token': store.state.vuex_token,
    }
})

export const adminGetUserList = (pageIndex, pageSize, role = "") => uni.$u.http.get('admin/user-list', {
    header: {
        'Content-Type': 'application/x-www-form-urlencoded', 'Token': store.state.vuex_token,
    },
    params: {
        'page_index': pageIndex,
        'page_size': pageSize,
        'role': role
    }
})

export const setUserRole = (userID, role, rejectReason = "") => uni.$u.http.post('admin/update-user-role', {
    user_id: userID,
    role: role,
    identify_fail_reason: rejectReason,
}, {
    header: {
        'Content-Type': 'application/x-www-form-urlencoded', 'Token': store.state.vuex_token,
    }
})

export const likeArticle = (articleID) => uni.$u.http.post('article/like', {
    article_id: articleID,
}, {
    header: {
        'Content-Type': 'application/x-www-form-urlencoded', 'Token': store.state.vuex_token,
    }
})

export const likeComment = (commentID) => uni.$u.http.post('article/like-comment', {
    comment_id: commentID,
}, {
    header: {
        'Content-Type': 'application/json', 'Token': store.state.vuex_token,
    }
})

export const readArticle = (articleID) => uni.$u.http.post('article/read', {
    article_id: articleID,
}, {
    header: {
        'Content-Type': 'application/json', 'Token': store.state.vuex_token,
    }
})

export const postArticleComment = (articleID, content, parentID) => uni.$u.http.post('article/comment', {
    article_id: articleID,
    content: content,
    parent_id: parentID,
}, {
    header: {
        'Content-Type': 'application/json', 'Token': store.state.vuex_token,
    }
})

export const reportOffense = (toUserID, text, images) => uni.$u.http.post('user/report-offence', {
    to_user_id: toUserID,
    text: text,
    images: images,
}, {
    header: {
        'Content-Type': 'application/json', 'Token': store.state.vuex_token,
    }
})

export const getArticleCommentList = (articleID, pageIndex, pageSize, mustIncludeCommentID = null) => uni.$u.http.get('article/comment', {
    header: {
        'Content-Type': 'application/json', 'Token': store.state.vuex_token,
    },
    params: {
        article_id: articleID,
        page_index: pageIndex,
        page_size: pageSize,
        must_include_comment_id: mustIncludeCommentID,
    }
})

export const getArticleCommentListByUser = (userID, pageIndex, pageSize) => uni.$u.http.get('article/comment/by-user', {
    header: {
        'Content-Type': 'application/json', 'Token': store.state.vuex_token,
    },
    params: {
        user_id: userID,
        page_index: pageIndex,
        page_size: pageSize,
    }
})

export const getAdminUserID = () => uni.$u.http.get('user/admin-userid', {
    header: {
        'Content-Type': 'application/json', 'Token': store.state.vuex_token,
    },
    params: {
    }
})

export const getArticleLikeListByUser = (userID, pageIndex, pageSize) => uni.$u.http.get('article/like-article/by-user', {
    header: {
        'Content-Type': 'application/json', 'Token': store.state.vuex_token,
    },
    params: {
        user_id: userID,
        page_index: pageIndex,
        page_size: pageSize,
    }
})

export const getCommentLikeListByUser = (userID, pageIndex, pageSize) => uni.$u.http.get('article/like-comment/by-user', {
    header: {
        'Content-Type': 'application/json', 'Token': store.state.vuex_token,
    },
    params: {
        user_id: userID,
        page_index: pageIndex,
        page_size: pageSize,
    }
})

export const getArticle = (articleID) => uni.$u.http.get('article/by-id', {
    header: {
        'Content-Type': 'application/json', 'Token': store.state.vuex_token,
    },
    params: {
        article_id: articleID,
    }
})

export const postArticle = (text, imageURLs) => uni.$u.http.post('article/', {
    text: text,
    images: imageURLs,
}, {
    header: {
        'Content-Type': 'application/x-www-form-urlencoded', 'Token': store.state.vuex_token,
    }
})

export const adminHandleUserPrize = (prizeItemID, prize, failMsg = "") => uni.$u.http.post('admin/handle-user-prize', {
    prize_id: prizeItemID,
    prize: prize,
    fail_msg: failMsg,
}, {
    header: {
        'Content-Type': 'application/x-www-form-urlencoded', 'Token': store.state.vuex_token,
    }
})

export const adminGetNewUserPrizeList = () => uni.$u.http.get('admin/new-user-prize-list', {
    header: {
        'Content-Type': 'application/x-www-form-urlencoded', 'Token': store.state.vuex_token,
    },
    params: {
    }
})

export const adminGetOldUserPrizeList = () => uni.$u.http.get('admin/old-user-prize-list', {
    header: {
        'Content-Type': 'application/x-www-form-urlencoded', 'Token': store.state.vuex_token,
    },
    params: {
    }
})

export const getShareLink = () => uni.$u.http.get('/activity/recommend/share-link', {
    header: {
        'Content-Type': 'application/x-www-form-urlencoded', 'Token': store.state.vuex_token,
    },
    params: {
    }
})

export const SUCCESS_CODE = 200

export const USER_ROLE = {
    STUDENT: "STUDENT",
    PENDING: "PENDING",
    VERIFY_BROKEN: "VERIFY_BROKEN",
    VISITOR: "VISITOR",
}

export const api = {
    SUCCESS_CODE,
    USER_ROLE,

    adminLogin,
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
    getUserGoodsList,
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
    createConversation,
    adminGetUserList,
    setUserRole,
    adminHandleUserPrize,
    adminGetNewUserPrizeList,
    adminGetOldUserPrizeList,
    getShareLink,
    getArticleList,
    likeArticle,
    postArticleComment,
    getArticleCommentList,
    likeComment,
    getArticle,
    readArticle,
    postArticle,
    getGoodsByID,
    getArticleCommentListByUser,
    getArticleLikeListByUser,
    getCommentLikeListByUser,
    reportOffense,
    getAdminUserID, 
}
