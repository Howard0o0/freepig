<template>
	<view class="left-right-margin centerAlign background">
		<image class="logo" src="/page_subject/static/logo_round.png" mode="aspectFit"></image>
		<text class="slogan">兜兜校缘</text>
		<text class="slogan">发现校园新鲜事·认识有趣新同学</text>


		<view class='flex-row' style="margin-top: 100rpx;" @click="contactUsOnclick">
			<view style="margin-left: 30rpx;">联系我们</view>
			<view style="margin-right: 30rpx;">></view>
		</view>

		<view class='flex-row' @click="emailOnClick">
			<view style="margin-left: 30rpx;">{{ email }}</view>
			<view style="margin-right: 30rpx;">></view>
		</view>

	</view>
</template>

<script>

import { api } from '../../config/api.js';
import { utils } from '../../common/common.js';


export default {
	data() {
		return {
			email: "support@doraewhite.com",
		}
	},

	onLoad(option) {
	},

	methods: {
		async contactUsOnclick() {
			console.debug("contactUsOnclick")
			uni.showLoading({ 'title': '联系中' })
			const resp = await api.getAdminUserID()
			uni.hideLoading()
			if (resp.code != api.SUCCESS_CODE) { return; }
			let adminUserID = resp.data
			console.debug("contacting admin " + adminUserID)
			utils.gotoChatRoomWithUser(adminUserID)
		},

		emailOnClick() {
			console.debug("emailOnClick")
			var that = this
			uni.setClipboardData({
				data: that.email,
				success: () => {
					uni.showToast({//提示
						title: '邮箱已复制',
						icon: 'success',
						duration: 2000
					})
				},
				fail: () => {
					console.error("邮箱复制失败")
					uni.$u.toast("邮箱复制失败")
				}
			});
		},

	}
}
</script>

<style>
.logo {
	width: 200rpx;
	height: 200rpx;
	margin-top: 30rpx;
}

.slogan {
	width: 100%;
	text-align: center;
	padding-top: 10rpx;

	font-family: PingFang SC;
	font-size: 25rpx;
	font-weight: 400;
	line-height: 20rpx;
	color: #b7b7b7;
}

.flex-row {
	padding-top: 1rpx;
	padding-bottom: 1rpx;
	background: #f6f6f6;
	width: 750rpx;
	height: 100rpx;
	line-height: 100rpx;
	display: flex;
	justify-content: space-between;

	border-style: solid;
	border-width: 0.5px;
	border-color: rgb(238, 238, 238);
}

/* .background {
	background: #f0f0f0;
} */
page {
	background-color: #ffffff;
}
</style>
