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
		}
	},

	onLaunch: async function () {
		if (!this.$store.state.vuex_token || this.$store.state.vuex_token == "") {
			let resp = await utils.getToken()
			if (resp.code != api.SUCCESS_CODE) {
				uni.$u.toast("登录失败")
				return;
			}
		}
		const success = await utils.refreshUserInfo()
		if (!success) {
			uni.$u.toast("刷新用户信息失败")
			return
		}
		console.log('[DEBUG] token: ', this.$store.state.vuex_token)
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

		async launchTimerRefreshMessage() {
			const func = async () => {
				if (!this.$store.state.conversationActive || !this.$store.state.conversationActive.historyMessageLoaded) { return; }
				const resp = await api.getLatestMessageList(this.$store.state.conversationActive.conversationID, 100)
				if (resp.code != api.SUCCESS_CODE) {
					console.log('[ERROR] getLatestMessageList fail: ', resp.msg)
				}
				let messageList = resp.data
				const timMessageList = utils.myMessageListToTIMMessageList(messageList, this.$store.state.vuex_user.id, this.$TIM)
				this.$store.commit("pushCurrentMessageList", timMessageList);
				await utils.ackLastRecvMessage(messageList, this.$store.state.vuex_user.id)
			}
			await func()
			this.refreshMessageTimer && clearInterval(this.refreshMessageTimer)
			this.refreshMessageTimer = setInterval(func, 2000);
		},

		async launchTimerRefreshConversationList() {
			const func = async () => {
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
			}
			console.log('[DEBUG] refreshing conversation list...')
			await func()
			console.log('[DEBUG] conversation list loaded')
			this.refreshConversationListTimer && clearInterval(this.refreshConversationListTimer)
			this.refreshConversationListTimer = setInterval(func, 2000);
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
</style>
