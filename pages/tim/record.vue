<template>
	<view>
		<!-- 聊天记录 会话列表 -->
		<view class="conversition-box">
			<view class="list-box" v-if="timConversationWithUserInfoList.length > 0">
				<view class="item-box" v-for="(item, index) in timConversationWithUserInfoList" :key="index"
					@click="toRoom(item)">
					<view class="item-img">
						<img :src="item.toUser.avatar_url" alt="">
					</view>
					<view class="item-text">
						<view class="item-user">
							{{ item.toUser.nickname }}
						</view>
						<view class="item-text-info">
							<rich-text :nodes="nodesFliter(item.conversation.lastMessage.messageForShow)"></rich-text>

						</view>
					</view>
					<view class="item-msg">
						<view class="item-msg-icon" v-if="item.conversation.unreadCount">
							{{ item.conversation.unreadCount }}</view>
					</view>
				</view>
			</view>
			<view class="list-box" v-else>
				<span class="msg-box centerAlign">暂无聊天记录</span>
			</view>
		</view>

	</view>
</template>

<script>
import { utils } from "@/common/common"
import { api } from '@/config/api.js'
import {
	mapState
} from "vuex";

export default {
	name: 'record',
	data() {
		return {
			// conversationList: [],
			toUserList: [],
			isActive: 0, //默认聊天记录
			timConversationWithUserInfoList: [],
		}
	},
	computed: {
		...mapState({
			isLogin: state => state.isLogin,
			isSDKReady: state => state.isSDKReady,
			conversationList: state => state.conversationList,
		})
	},
	watch: {
		conversationList(val) {
			this.getUserInfo(val)
		}
	},
	methods: {
		//聊天的节点加上外层的div
		nodesFliter(str) {
			let nodeStr = '<div style="align-items: center;word-wrap:break-word;">' + str + '</div>'
			return nodeStr
		},

		refreshConversationList(conversationList) {
			let timConversationList = [];
			for (let i in conversationList) {
				let conversation = conversationList[i]
				let lastMessage = conversation.last_message
				let theOtherUserID = (conversation.from_user_id == this.$store.state.vuex_user.id) ? conversation.to_user_id : conversation.from_user_id;
				timConversationList.push({
					conversationID: conversation.id,
					userProfile: { userID: theOtherUserID },
					unreadCount: conversation.unread_count,
					lastMessage: { messageForShow: lastMessage.type == "IMAGE" ? "[图片]" : lastMessage.payload }
				});
			}
			if (timConversationList.length) {
				//将返回的会话列表拼接上 用户的基本资料  
				//说明：如果已经将用户信息 提交到tim服务端了 就不需要再次拼接
				this.$store.commit("updateConversationList", timConversationList);
			}
			uni.hideLoading()
		},

		//获取消息列表
		getConversationList() {
			// 拉取会话列表
			this.refreshConversationList(getApp().globalData.conversationList)
		},

		getIndexOfTimConversationWithUserInfoList(conversationID) {
			for (let i in this.timConversationWithUserInfoList) {
				if (this.timConversationWithUserInfoList[i].conversation.conversationID == conversationID) {
					return i
				}
			}
			return -1
		},

		//根据消息列表请求聊天对象的用户信息 并完成数据拼接
		async getUserInfo(conversationList) {
			for (let i in conversationList) {
				const item = conversationList[i]
				let obj = {}
				obj.conversation = item
				const resp = await api.getUserInfoFromServer({ user_id: item.userProfile.userID })
				if (resp.code != api.SUCCESS_CODE) { continue }
				obj.toUser = resp.data

				let oldConversationIndex = this.getIndexOfTimConversationWithUserInfoList(item.conversationID)
				if (oldConversationIndex == -1) {
					this.timConversationWithUserInfoList.push(JSON.parse(JSON.stringify(obj)));
				} else {
					this.timConversationWithUserInfoList[oldConversationIndex] = obj
				}
			}
		},
		toRoom(item) {
			this.$store.commit('updateConversationActive', item)
			uni.navigateTo({
				url: '/pages/tim/room'
			})
		}
	},
	onShow() {
	},
	onLoad() {
		uni.showLoading({
			title: '正在获取列表'
		})
		getApp().watch(this.refreshConversationList, 'conversationList')
	}
}
</script>

<style scoped lange="scss">
.list-box {
	width: 94%;
	margin: 40rpx auto;
}

.item-box {
	width: auto;
	height: 130rpx;
	padding: 20rpx;
	overflow: hidden;
	border-bottom: 1px solid #eee;
}

.item-img {
	float: left;
	margin-top: 20rpx;
	width: 80rpx;
	height: 80rpx;
}

.item-img img {
	width: 80rpx;
	height: 80rpx;
}

.item-text {
	float: left;
	margin-left: 30rpx;
	width: 500rpx;
	height: 100rpx;
	color: #666;
	font-size: 28rpx;
	overflow: hidden;
	text-overflow: ellipsis;
}

.item-user {
	width: auto;
	height: 60rpx;
	line-height: 60rpx;
	color: 333;
	font-size: 32rpx;
	overflow: hidden;
	text-overflow: ellipsis;

}

.item-text-info {
	width: auto;
	height: 60rpx;
	line-height: 60rpx;
	color: #666;
	font-szie: 24rpx;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.user-box {
	width: auto;
	height: 80rpx;
	padding: 0 20rpx;
}

.nav-tab {
	padding-top: 20rpx;
	background: #fff;
	height: 80rpx;

}

.tab-item {
	float: left;
	height: 70rpx;
	padding: 0 20rpx;
	line-height: 70rpx;
	color: #666;
	font-size: 28rpx;
	border: 1px solid #F56C6C;
	border-top-left-radius: 25rpx;
	border-bottom-left-radius: 25rpx;
}

.tab-item1 {
	float: left;
	height: 70rpx;
	padding: 0 20rpx;
	line-height: 70rpx;
	color: #666;
	font-size: 28rpx;
	border: 1px solid #F56C6C;
	border-top-right-radius: 25rpx;
	border-bottom-right-radius: 25rpx;
}

.tab-item-active {
	color: #fff;
	background: #F56C6C;
}

.msg-box {
	line-height: 30rpx;
	font-size: 28rpx;
	color: #666;
}

.user-item-box {
	padding: 20rpx 0;
	width: auto;
	height: 70rpx;
	line-height: 70rpx;
	cursor: pointer;
	border-bottom: 1px solid #eee;
}

.user-img {
	float: left;
	width: 70rpx;
	height: 70rpx;
	border-radius: 50%;
	overflow: hidden;
}

.user-img image {
	width: 70rpx;
	height: 70rpx;
	border-radius: 50%;
}

.user-name {
	float: left;
	margin-left: 20rpx;
	width: 250rpx;
	height: 70rpx;
	line-height: 70rpx;
	color: #666;
	font-weight: 500;
}

.item-msg {
	float: left;
	width: 40rpx;
	height: 100rpx;
}

.item-msg-icon {
	width: 40rpx;
	height: 40rpx;
	border-radius: 50%;
	background: #f06c7a;
	color: #fff;
	line-height: 40rpx;
	margin-top: 30rpx;
	text-align: center;
	font-size: 24rpx;
}

.clear-box {
	clear: both;
}

.out-login {
	float: right;
	margin-right: 20rpx;
	height: 70rpx;
	line-height: 70rpx;
	padding: 0 40rpx;
	border-radius: 25rpx;
	color: #fff;
	background: #F56C6C;
	font-size: 26rpx;
}
</style>
