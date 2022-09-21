module.exports = (vm) => {
    // 初始化请求配置
    uni.$u.http.setConfig((config) => {
        /* config 为默认全局配置*/
        config.baseURL = 'https://182.92.109.123:8080/api/v1'; /* 根域名 */
        return config
    })

    // 请求拦截
    uni.$u.http.interceptors.request.use((config) => { // 可使用async await 做异步操作
        config.data = config.data || {}
        // 可以在此通过vm引用vuex中的变量，具体值在vm.$store.state中
        config.header['Authorization'] = vm.$store.state.vuex_user.token
        config.header['Content-Type'] = 'application/x-www-form-urlencoded'
        return config
    }, config => { // 可使用async await 做异步操作
        return Promise.reject(config)
    })

    // 响应拦截
    uni.$u.http.interceptors.response.use((response) => { /* 对响应成功做点什么 可使用async await 做异步操作*/
        console.log('response from server: ', response)
        const responseFromServer = response.data

        // 自定义参数
        const custom = response.config?.custom
        if (responseFromServer.code !== 200) {
            // 如果没有显式定义custom的toast参数为false的话，默认对报错进行toast弹出提示
            if (custom.toast !== false) {
                uni.$u.toast(responseFromServer.message)
            }
            uni.$u.toast("http request fail. reason: ", responseFromServer.msg)

            // 如果需要catch返回，则进行reject
            if (custom?.catch) {
                return Promise.reject(responseFromServer)
            } else {
                // 否则返回一个pending中的promise，请求不会进入catch中
                return new Promise(() => { })
            }
        }
        return responseFromServer.data === undefined ? {} : responseFromServer.data
    }, (response) => {
        // 对响应错误做点什么 （statusCode !== 200）
        uni.$u.toast("http request fail. error code: ", response.statusCode)
        return Promise.reject(response)
    })
}