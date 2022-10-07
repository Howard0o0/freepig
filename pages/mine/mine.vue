<template>
	<view>
		<uni-card :title="vuex_user.nickname" :sub-title="vuex_user.campus" :extra="authTag"
			:thumbnail="vuex_user.avatar_url" @click="userInfoCardOnClick"></uni-card>
		<uni-grid :column="4" :highlight="true" :showBorder="false" :square="false" @change="gridItemOnClick">
			<uni-grid-item v-for="(item, index) in grids" :index="index" :key="index">
				<view class="grid-item-box" style="background-color: #fff;">
					<u-icon size="30" :name="item.icon"></u-icon>
					<view>{{item.text}}</view>
				</view>
			</uni-grid-item>
		</uni-grid>

		<uni-notice-bar class="bottom-notice-bar"
			v-if="userInfo.role=='VERIFY_BROKEN' && !identifyFailNoticeShowTimeout" :text="identifyFailReason" />

	</view>
</template>

<script>

import store from '@/store/index.js';
import { utils } from '../../common/common.js';

export default {
	data() {
		return {
			authTag: '未认证',
			grids: [
				{
					icon: "/static/mine/grid-auth.png",
					text: "身份认证",
				},
				{
					icon: "/static/mine/grid-mygoods.png",
					text: "我的宝贝",
				},
			],
			identifyFailReason: "",
			identifyFailNoticeShowTimeout: false,
			userInfo: null,
		}
	},
	onLoad() {
		this.refreshAuthTag()
	},
	onShow() {
		this.identifyFailNoticeShowTimeout = false
		utils.refreshUserInfo()
		this.userInfo = store.state.vuex_user
		this.generateVerifyBrokenReason()
		let that = this
		setTimeout(function () {
			that.identifyFailNoticeShowTimeout = true
			console.log('[DEBUG] identifyFailNoticeShowTimeout')
		}, 3000)
	},
	methods: {

		generateVerifyBrokenReason() {
			this.identifyFailReason = "身份审核失败: " + store.state.vuex_user.identify_fail_reason
		},

		userInfoCardOnClick() {
			uni.navigateTo({ url: '../../page_subject/pages/set_userinfo' })
		},

		refreshAuthTag() {
			switch (store.state.vuex_user.role) {
				case "STUDENT":
					this.authTag = "已认证"
					break
				case "VISITOR":
					this.authTag = "未认证"
					break
				case "PENDING":
					this.authTag = "审核中"
					break
				case "VERIFY_BROKEN":
					this.authTag = "审核未通过"
					break
			}
		},

		gridItemOnClick(e) {
			console.log("grid item clicked: ", e)
			switch (e.detail.index) {
				case 0:
					console.log("jumping to auth page")
					uni.navigateTo({ url: '../../page_subject/pages/auth' })
				case 1:
					console.log("jumping to mygoods page")
					uni.navigateTo({ url: '../../page_subject/pages/my_goods' })
			}
		}
	}
}
</script>

<style lang="scss">
.wrap {
	padding: 12px;
}

.demo-layout {
	height: 25px;
	border-radius: 4px;
}

.bg-blue {
	background: #2979ff;
}

.grid-item-box {
	flex: 1;
	// position: relative;
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 15px 0;
	font-size: 30rpx;
}

.bottom-notice-bar {
	position: fixed;
	bottom: 3rpx;
}
</style>
