
// post请求，通过wx_login_code获取token
export const getTokenFromServer = (params, config = {}) => uni.$u.http.post('/login/by-wx-account', params, config)
export const getUserInfoFromServer = () => uni.$u.http.get('/user', {})
export const getCampusList = (keyword) => uni.$u.http.get('/info/campus', { params: { keyword: keyword } })
export const getMajorList = (campusID) => uni.$u.http.get('/info/major', { params: { campus_id: campusID } })

export const api = {
    getTokenFromServer,
    getUserInfoFromServer,
    getCampusList,
    getMajorList,
}