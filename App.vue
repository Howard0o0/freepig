<script>
import common from './common/common.js';
import { getTokenFromServer } from './config/api.js';
export default {

	onLaunch: function () {
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
		async getToken() {
			var response = await uni.login({provider: 'weixin'})
			var wx_login_code = response[1].code
			console.log("[DEBUG] wx_login_code: ", wx_login_code)
			var resp = await getTokenFromServer({wx_login_code: wx_login_code})	
			this.$u.vuex('vuex_user.token', resp.token);
			console.log("[DEBUG] token: ", this.$store.state.vuex_user.token)
		}
	}

}
</script>

<style lang="scss">
/*每个页面公共css */
/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
@import "@/uni_modules/uview-ui/index.scss";
</style>
