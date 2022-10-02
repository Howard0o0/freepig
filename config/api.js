
// post请求，通过wx_login_code获取token
export const getTokenFromServer = (params, config = {
    header: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
}) => uni.$u.http.post('/login/by-wx-account', params, config)

export const getUserInfoFromServer = () => uni.$u.http.get('/user', {
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
    degree: degree
}, {
    header: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
})

export const identifyByCertification = (certificationImageFilePath, realname, campusID, majorID, kickoffYear, degree) => uni.$u.http.upload('/auth/campus-identity-by-student-credential', {
    FormData: {
        realname: realname,
        campus_id: campusID,
        major_id: majorID,
        kickoff_year: kickoffYear,
        degree: degree
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
}