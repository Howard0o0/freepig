<script>
import utils from './common/common.js';
import { api } from '@/config/api.js';
import { getTokenFromServer, getUserInfoFromServer } from './config/api.js';
export default {
	mounted() {
		/**官网有很多关于关于sdk 其他的监听方法（比如：有新的消息，用户资料更新等等）
		 * 详情可对照： https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/SDK.html
		 * 监听的含义：服务端发生了数据变更---前端全局可以接收到变更通知--前端就可以自动触发某个事件来更新相应数据
		 * */
		// 登录成功后会触发 SDK_READY 事件，该事件触发后，可正常使用 SDK 接口
		this.tim.on(this.$TIM.EVENT.SDK_READY, this.onReadyStateUpdate, this);
		// 收到新消息
		this.tim.on(this.$TIM.EVENT.MESSAGE_RECEIVED, this.onReceiveMessage);
		// 会话列表更新
		this.tim.on(this.$TIM.EVENT.CONVERSATION_LIST_UPDATED, event => {
			this.$store.commit("updateConversationList", event.data);
		});
	},

	globalData: {
		selectedGoodsToShowInDetail: null,
		selectedGoodsToModify: null,
	},

	onLaunch: async function () {
		await this.getToken()
		await utils.refreshUserInfo()
		const resp = await api.getTIMSig()
		if (resp.code != api.SUCCESS_CODE) { return }
		if (this.$store.state.vuex_user.role != "STUDENT") { return }
		this.TIMLogin(this.$store.state.vuex_user.id.toString(), resp.data.tim_sig)
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
			var response = await uni.login({ provider: 'weixin' })
			var wx_login_code = response[1].code
			console.log("[DEBUG] wx_login_code: ", wx_login_code)
			var resp = await getTokenFromServer({ wx_login_code: wx_login_code })
			this.$u.vuex('vuex_token', resp.data.token);
			console.log("[DEBUG] token: ", this.$store.state.vuex_token)
		},

		async getUserInfo() {
			var resp = await getUserInfoFromServer()
			this.$u.vuex('vuex_user', resp.data);
			console.log("[DEBUG] user info: ", this.$store.state.vuex_user)
		},

		onReadyStateUpdate({ name }) {
			const isSDKReady = name === this.$TIM.EVENT.SDK_READY ? true : false;
			//自动监听并更新 sdk 的ready 状态 （未登录是 notReady  登录后是ready）
			this.$store.commit("toggleIsSDKReady", isSDKReady);
			//sdk ready 后  肯定完成了登录操作    这里可以获取用户存储在im的基础信息/离线消息/黑名单列表
		},

		//根据消息列表请求聊天对象的用户信息 并完成数据拼接
		onReceiveMessage({ data: messageList }) {
			// this.handleAt(messageList);
			this.$store.commit("pushCurrentMessageList", messageList);
		},

		TIMLogin(userID, userSig) {
			var userInfo = {
				userID: userID,
				userSig: userSig
			}
			let promise = this.tim.login({
				userID: userID,
				userSig: userSig
			});
			promise.then((res) => {
				//登录成功后 更新登录状态
				this.$store.commit("toggleIsLogin", true);
				//自己平台的用户基础信息
				uni.setStorageSync('userInfo', JSON.stringify(userInfo))
				//tim 返回的用户信息
				uni.setStorageSync('userTIMInfo', JSON.stringify(res.data))
			}).catch((err) => {
				console.warn('login error:', err); // 登录失败的相关信息
			});
		},
	}

}
</script>

<style lang="scss">
/*每个页面公共css */
/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
@import "@/uni_modules/uview-ui/index.scss";
</style>
