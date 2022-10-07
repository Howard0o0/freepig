import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import uView from '@/uni_modules/uview-ui'
import store from '@/store';

import tim from './commen/tim/tim.js'
import commen from './commen/commen.js'
import TIM from 'tim-js-sdk'

Vue.prototype.$store = store
Vue.config.productionTip = false


let vuexStore = require("@/store/$u.mixin.js");
Vue.mixin(vuexStore);

Vue.config.productionTip = false
Vue.prototype.tim = tim.tim  			//tim sdk 引入后生成的tim服务
Vue.prototype.$TIM = TIM				//tim 的状态/事件 常量
Vue.prototype.$commen = commen

App.mpType = 'app'

// 引入全局uView
Vue.use(uView)

const app = new Vue({
    store,
    ...App
})

// 引入请求封装，将app参数传递到配置中
require('./config/request.js')(app)
require('./config/page_interceptor.js')(app)

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