module.exports = (vm) => {
    // 初始化请求配置
    uni.$u.http.setConfig((config) => {
        /* config 为默认全局配置*/
        config.baseURL = 'http://localhost:8080/api/v1'; /* 根域名 */
        // config.baseURL = 'http://192.168.2.116:8080/api/v1'; /* 根域名 */
        // config.baseURL = 'https://secondmarket.top/api/v1'; /* 根域名 */
        return config
    })

    // 请求拦截
    uni.$u.http.interceptors.request.use((config) => { // 可使用async await 做异步操作
        config.data = config.data || {}
        // 可以在此通过vm引用vuex中的变量，具体值在vm.$store.state中
        config.header['Authorization'] = vm.$store.state.vuex_token
        return config
    }, config => { // 可使用async await 做异步操作
        return Promise.reject(config)
    })

    // 响应拦截
    uni.$u.http.interceptors.response.use((response) => { /* 对响应成功做点什么 可使用async await 做异步操作*/
        // console.log('[DEBUG] [response interceptor] response from server: ', response)
        const responseFromServer = response.data

        // 自定义参数
        const custom = response.config?.custom
        if (responseFromServer.code !== 200) {
            console.log("请求失败 ", responseFromServer.msg)
            uni.showToast({
                title: responseFromServer.msg,
                icon: 'none',
                duration: 2000
            });

            // 如果需要catch返回，则进行reject
            if (custom?.catch) {
                return Promise.reject(responseFromServer)
            } else {
                // 否则返回一个pending中的promise，请求不会进入catch中
                return new Promise(() => { })
            }
        }
        return responseFromServer
    }, async (response) => {
        const res = await uni.getNetworkType()
        if (res.networkType === "none") {
            uni.$u.toast("无可用网络T T")
        } else {
            uni.$u.toast("连接服务器失败 抢修中... T T")
        }
        return Promise.reject(response)
    })
}