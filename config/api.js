
// post请求，通过wx_login_code获取token
export const getTokenFromServer = (params, config = {}) => uni.$u.http.post('/login/by-wx-account', params, config)
export const getUserInfoFromServer = () => uni.$u.http.get('/user', {})
export const getCampusList = (keyword) => uni.$u.http.get('/info/campus', { params: { keyword: keyword } })
export const getMajorList = (campusID) => uni.$u.http.get('/info/major', { params: { campus_id: campusID } })
export const getEmailVerifyCode = (email) => uni.$u.http.get('/auth/emailcode', { params: { email: email } })
export const identifyByEmail = (email, emailVerifyCode, realname, campusID, majorID, kickoffYear, degree) => uni.$u.http.post('/auth/campus-identity-by-edu-email', {
    email: email,
    email_verify_code: emailVerifyCode,
    realname: realname,
    campus_id: campusID,
    major_id: majorID,
    kickoff_year: kickoffYear,
    degree: degree
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
}