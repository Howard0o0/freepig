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
		safeAreaHeight: 0,
		conversationList: [],
	},

	data() {
		return {
			timLoginTimer: null,
			refreshMessageTimer: null,
			refreshConversationListTimer: null,
		}
	},

	onLaunch: async function () {
		if (!this.$store.state.vuex_token || this.$store.state.vuex_token == "") {
			await this.getToken()
		}
		await utils.refreshUserInfo()
		console.log('[DEBUG] token: ', this.$store.state.vuex_token)
		const resp = await api.getTIMSig()
		if (resp.code != api.SUCCESS_CODE) { return }
		if (this.$store.state.vuex_user.role != "STUDENT") {
			var that = this
			this.timLoginTimer = setInterval(() => {
				if (that.$store.state.vuex_user.role != "STUDENT") return;
				this.TIMLogin(this.$store.state.vuex_user.id.toString(), resp.data.tim_sig)
				uni.showToast({
					title: '认证完成 enjoy!',
					icon: 'none',
					duration: 1500
				});
				clearInterval(this.timLoginTimer);
			}, 1000);
			return;
		}
		this.TIMLogin(this.$store.state.vuex_user.id.toString(), resp.data.tim_sig)
		this.globalData.safeAreaHeight = this.getSafeAreaHeight()

		this.launchTimerRefreshMessage()
		this.launchTimerRefreshConversationList()
		console.log('App Launch')
	},
	onShow: function () {
		console.log('App Show')
	},
	onHide: function () {
		console.log('App Hide')
	},
	methods: {
		watch: function (method, istr) {
			var obj = this.globalData
			console.log(obj)
			Object.defineProperty(obj, istr, {
				configurable: true,
				enumerable: true,
				set: function (value) {
					this._consumerGoodsStatus = value
					method(value)
				},
				get: function (value) {
					return this._consumerGoodsStatus
				}
			})
		},

		launchTimerRefreshMessage() {
			this.refreshMessageTimer = setInterval(async () => {
				if (!this.$store.state.conversationActive || !this.$store.state.conversationActive.historyMessageLoaded) { return; }
				const resp = await api.getLatestMessageList(this.$store.state.conversationActive.conversationID, 100)
				if (resp.code != api.SUCCESS_CODE) {
					console.log('[ERROR] getLatestMessageList fail: ', resp.msg)
				}
				let messageList = resp.data
				const timMessageList = utils.myMessageListToTIMMessageList(messageList, this.$store.state.vuex_user.id, this.$TIM)
				this.$store.commit("pushCurrentMessageList", timMessageList);
				await utils.ackLastRecvMessage(messageList, this.$store.state.vuex_user.id)
			}, 2000);
		},

		launchTimerRefreshConversationList() {
			this.refreshConversationListTimer = setInterval(async () => {
				let resp = await api.getConversationList()
				if (resp.code != api.SUCCESS_CODE) {
					console.log('[ERROR] getConversationList fail. reason: ', resp.msg)
					return
				}
				this.globalData.conversationList = resp.data

				let totalUnreadCount = 0
				for (let i in this.globalData.conversationList) {
					let conversation = this.globalData.conversationList[i]
					totalUnreadCount += conversation.unread_count
				}

				if (totalUnreadCount > 0) {
					uni.setTabBarBadge({
						index: 1,
						text: '' + totalUnreadCount
					})
				} else {
					uni.removeTabBarBadge({
						index: 1,
					})
				}
			}, 2000);
		},

		hasBottomSafeArea() {
			let screenHeight = wx.getSystemInfoSync().screenHeight
			let bottom = wx.getSystemInfoSync().safeArea.bottom
			return screenHeight !== bottom
		},

		getSafeAreaHeight() {
			if (!this.hasBottomSafeArea) {
				return 0;
			}
			return wx.getSystemInfoSync().screenHeight - wx.getSystemInfoSync().safeArea.bottom;
		},

		async getToken() {

			uni.showToast({
				title: '登录中',
				icon: 'loading',
				duration: 2000
			});

			var response = await uni.login({ provider: 'weixin' })
			console.log('[DBUEG] wx login response: ', response)
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
