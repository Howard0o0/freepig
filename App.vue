<script>
import common from './common/common.js';
import { getTokenFromServer } from './config/api.js';
export default {

	onLaunch: function () {
		// this.GetToken()
		this.fn();
		// this.initHttpConf()
		this.getToken()

		console.log('App Launch')
	},
	onShow: function () {
		console.log('App Show')
	},
	onHide: function () {
		console.log('App Hide')
	},
	methods: {
		fn() {
			console.log("heihei")
		},
		initHttpConf() {
			uni.$u.http.setConfig((config) => {
				config.baseURL = common.baseURL;
				config.header = {
					'content-type': 'application/x-www-form-urlencoded'
				}
				return config
			})
		},
		async getToken() {
			var response = await uni.login({provider: 'weixin'})
			var wx_login_code = response[1].code
			console.log("wx_login_code: ", wx_login_code)
			var token = await getTokenFromServer({wx_login_code: wx_login_code})	
			console.log("token: ", token)
			this.$u.vuex('vuex_user.token', token);

			// uni.login({
			// 	provider: 'weixin',
			// }).then(res => {
			// 	var wx_login_code = res[1].code
			// 	uni.request({
			// 		url: common.baseURL + "/login/by-wx-account",
			// 		data: {
			// 			wx_login_code: wx_login_code
			// 		},
			// 		method: "POST",
			// 		header: {
			// 			"content-type": "application/x-www-form-urlencoded"
			// 		},
			// 		success: (res) => {
			// 			console.log(res.data);
			// 		}
			// 	})
			// });
		}
	}

}
</script>

<style lang="scss">
/*每个页面公共css */
/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
@import "@/uni_modules/uview-ui/index.scss";
</style>
