<script>
import { utils } from '@/common/common.js';
import { api } from '@/config/api.js';
import { getTokenFromServer, getUserInfoFromServer } from './config/api.js';
export default {
	mounted() {
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
			initializeRetryTimer: null,
		}
	},

	onLaunch: async function () {
		this.globalData.safeAreaHeight = this.getSafeAreaHeight()
		this.refreshFunc()

		this.initializeRetryTimer && clearInterval(this.initializeRetryTimer)
		this.initializeRetryTimer = setInterval(async () => {
			await this.refreshFunc()
		}, 2000);
		console.info('token: ', this.$store.state.vuex_token)
		console.log('App Launch')
	},
	onShow: function () {
		this.initializeRetryTimer && clearInterval(this.initializeRetryTimer)
		this.initializeRetryTimer = setInterval(async () => {
			await this.refreshFunc()
		}, 2000);
		console.log('App Show')
	},
	onUnload: function () {
		console.log('App Unload')
	},
	onHide: function () {
		this.initializeRetryTimer && clearInterval(this.initializeRetryTimer)
		console.log('App Hide')
	},
	methods: {
		watch: function (method, istr) {
			var obj = this.globalData
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

		async refreshFunc() {
			if (!this.$store.state.vuex_token || this.$store.state.vuex_token == "") {
				let success = await utils.getToken()
				if (!success) {
					uni.$u.toast("登录失败")
					return false;
				}
			}
			const success = await utils.refreshUserInfo()
			if (!success) {
				uni.$u.toast("刷新用户信息失败")
				return false;
			}
			// console.log('[DEBUG] token: ', this.$store.state.vuex_token)

			this.refreshConversationList()
			this.refreshMessage()
			return true;
		},

		async refreshMessage() {
			if (!this.$store.state.conversationActive || !this.$store.state.conversationActive.historyMessageLoaded) { return; }
			const resp = await api.getLatestMessageList(this.$store.state.conversationActive.conversationID, 100)
			if (resp.code != api.SUCCESS_CODE) {
				console.log('[ERROR] getLatestMessageList fail: ', resp.msg)
			}
			let messageList = resp.data
			const timMessageList = utils.myMessageListToTIMMessageList(messageList, this.$store.state.vuex_user.id, this.$TIM)
			this.$store.commit("pushCurrentMessageList", timMessageList);
			await utils.ackLastRecvMessage(messageList, this.$store.state.vuex_user.id)
		},

		async launchTimerRefreshMessage() {
			await this.refreshMessage()
			this.refreshMessageTimer && clearInterval(this.refreshMessageTimer)
			this.refreshMessageTimer = setInterval(this.refreshMessage, 2000);
		},

		async refreshConversationList() {
			// console.log('[DEBUG] refreshing conversation list...')
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
			// console.log('[DEBUG] conversation list loaded')
		},

		async launchTimerRefreshConversationList() {
			this.refreshConversationListTimer && clearInterval(this.refreshConversationListTimer)
			this.refreshConversationListTimer = setInterval(this.refreshConversationList, 2000);
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
	}

}
</script>

<style lang="scss">
/*每个页面公共css */
/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
@import "@/uni_modules/uview-ui/index.scss";
@import url("/components/gaoyia-parse/parse.css");
</style>
