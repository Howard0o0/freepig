
// post请求，通过wx_login_code获取token
export const getTokenFromServer = (params, config = {}) => uni.$u.http.post('/login/by-wx-account', params, config)
export const getUserInfoFromServer = () => uni.$u.http.get('/user', {})