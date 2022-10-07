import { utils } from "../common/common"

// 页面白名单
const whiteList = [
    "/pages/index/index",
    "/pages/mine/mine",
    "/page_subject/pages/auth",
    "/page_subject/pages/auth_by_certification",
    "/page_subject/pages/auth_by_email",
    "/page_subject/pages/pick_campus",
    "/page_subject/pages/set_userinfo",
]

function isPageInWhiteList(url) {
    for (let i in whiteList) {
        let pageURL = whiteList[i]
        if (url.indexOf(pageURL) != -1) { return true }
    }
    return false
}

module.exports = (vm) => {

    uni.addInterceptor('navigateTo', {
        // 页面跳转前进行拦截, invoke根据返回值进行判断是否继续执行跳转
        invoke(e) {
            if (!isPageInWhiteList(e.url) && vm.$store.state.vuex_user.role != "STUDENT") {
                utils.interceptUnauthorizedPageCallback()
                return false
            }
            return true
        },
        success(e) {
            // console.log(e)
        }
    })

    uni.addInterceptor('switchTab', {
        // 页面跳转前进行拦截, invoke根据返回值进行判断是否继续执行跳转
        invoke(e) {
            if (!isPageInWhiteList(e.url) && vm.$store.state.vuex_user.role != "STUDENT") {

                uni.showToast({
                    title: '为了保证圈子的干净, 需要先认证噢',
                    icon: 'error',
                    duration: 1000
                });

                setTimeout(() => {
                    uni.reLaunch({
                        url: '/pages/mine/mine'
                    })
                }, 1000);
                return false
            }
            return true
        },
        success(e) {
            // console.log(e)
        }
    })
}