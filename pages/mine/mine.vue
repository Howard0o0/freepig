<template>
	<view>
		<uni-card :title="vuex_user.nickname" :sub-title="vuex_user.campus" :extra="authTag"
			:thumbnail="vuex_user.avatar_url" @click="userInfoCardOnClick"></uni-card>
		<uni-grid :column="4" :highlight="true" :showBorder="false" :square="false" @change="gridItemOnClick">
			<uni-grid-item v-for="(item, index) in grids" :index="index" :key="index">
				<view class="grid-item-box" style="background-color: #fff;">
					<u-icon size="40" name="/static/mine/grid-auth.png"></u-icon>
					<view>{{item.text}}</view>
				</view>
			</uni-grid-item>
		</uni-grid>
	</view>
</template>

<script>

import store from '@/store/index.js';
import { utils } from '../../common/common.js';

export default {
	data() {
		return {
			authTag: '未认证',
			grids: [{
				icon: "/static/mine/grid-auth.png",
				text: "身份认证",
			}]
		}
	},
	onLoad() {
		this.refreshAuthTag()
	},
	onShow() {
		utils.refreshUserInfo()
	},
	methods: {
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
			}
		},

		gridItemOnClick(e) {
			console.log("grid item clicked: ", e)
			switch (e.detail.index) {
				case 0:
					console.log("jumping to auth page")
					uni.navigateTo({ url: '../../page_subject/pages/auth' })
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
}
</style>
