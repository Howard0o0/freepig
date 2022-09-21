import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import uView from '@/uni_modules/uview-ui'
import store from '@/store';

Vue.prototype.$store = store
Vue.config.productionTip = false


let vuexStore = require("@/store/$u.mixin.js");
Vue.mixin(vuexStore);


App.mpType = 'app'

// 引入全局uView
Vue.use(uView)

const app = new Vue({
    store,
    ...App
})

// 引入请求封装，将app参数传递到配置中
require('./config/request.js')(app)

app.$mount()
    // #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
    const app = createSSRApp(App)
    return {
        app
    }
}
// #endif