<template>
	<view>
		<uni-card :title="vuex_user.nickname" :sub-title="joinCampusAndMajorInfo(vuex_user.campus, vuex_user.major)"
			:extra="authTag" :thumbnail="vuex_user.avatar_url" @click="userInfoCardOnClick"></uni-card>
		<uni-grid :column="4" :highlight="true" :showBorder="false" :square="false" @change="gridItemOnClick">
			<uni-grid-item v-for="(item, index) in grids" :index="index" :key="index">
				<view class="grid-item-box" style="background-color: #fff;">
					<u-icon size="30" :name="item.icon"></u-icon>
					<view>{{ item.text }}</view>
				</view>
			</uni-grid-item>
		</uni-grid>

		<button class="left-rigth-margin" v-if="vuex_user.id <= 100" @click="adminLogin">username login</button>
		<button class="left-rigth-margin" v-if="vuex_user.id <= 100" @click="wxLogin">wx login</button>

		<uni-notice-bar class="bottom-notice-bar"
			v-if="userInfo.role == 'VERIFY_BROKEN' && !identifyFailNoticeShowTimeout" :text="identifyFailReason" />

	</view>
</template>

<script>

import store from '@/store/index.js';
import { utils } from '../../common/common.js';
import { api } from '../../config/api.js';

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
				{
					icon: "/static/mine/grid-contact-us.png",
					text: "联系我们",
				},
				{
					icon: "/static/mine/grid-recommend.png",
					text: "内推大奖",
				},
			],
			identifyFailReason: "",
			identifyFailNoticeShowTimeout: false,
			userInfo: null,
		}
	},
	onLoad() {
		uni.share({
			provider: 'weixin',
			scene: "WXSceneSession",
			type: 5,
			imageUrl: 'https://bjetxgzv.cdn.bspapp.com/VKCEYUGU-uni-app-doc/962fc340-4f2c-11eb-bdc1-8bd33eb6adaa.png',
			title: '欢迎体验uniapp',
			miniProgram: {
				id: 'gh_abcdefg',
				path: 'pages/index/index',
				type: 0,
				webUrl: 'http://uniapp.dcloud.io'
			},
			success: ret => {
				console.log(JSON.stringify(ret));
			}
		});
	},
	onShow() {
		this.refreshAuthTag()
		this.identifyFailNoticeShowTimeout = false
		utils.refreshUserInfo()
		this.userInfo = store.state.vuex_user
		this.generateVerifyBrokenReason()
		let that = this
		setTimeout(function () {
			that.identifyFailNoticeShowTimeout = true
			console.log('[DEBUG] identifyFailNoticeShowTimeout')
		}, 8000)

		// this.toastVerifyBrokenIfNeed()
	},


	methods: {
		adminLogin() {
			console.log('[DEBUG] adminLogin button clicked')
			uni.navigateTo({ url: '/page_subject/pages/admin_login' })
		},

		async wxLogin() {
			console.log('[DEBUG] wx button clicked')
			let success = await utils.getToken()
			if (!success) {
				uni.$u.toast("登录失败")
				return;
			}

			uni.$u.toast("登录成功")
			uni.reLaunch({ url: '../../pages/mine/mine' })
		},

		joinCampusAndMajorInfo(campusName, majorName) {
			return campusName + " | " + majorName
		},

		toastVerifyBrokenIfNeed() {
			if (userInfo.role != 'VERIFY_BROKEN') { return }
			uni.showToast({
				title: this.identifyFailReason,
				icon: 'none',
				duration: 8000
			});
		},

		generateVerifyBrokenReason() {
			this.identifyFailReason = "身份审核失败: " + store.state.vuex_user.identify_fail_reason
		},

		userInfoCardOnClick() {
			uni.navigateTo({ url: '/page_subject/pages/set_userinfo' })
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
					uni.navigateTo({ url: '/page_subject/pages/auth' })
					break
				case 1:
					console.log("jumping to mygoods page")
					uni.navigateTo({ url: '/page_subject/pages/my_goods' })
					break
				case 2:
					console.log("jumping to contact-us page")
					uni.navigateTo({ url: '/page_subject/pages/contact_us' })
					break
				case 3:
					console.log("jumping to recommend page")
					uni.navigateTo({ url: '/page_subject/pages/recommend' })
					break
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
	// bottom: 3rpx;
	// left: 50%;
	top: 50%;
}
</style>
