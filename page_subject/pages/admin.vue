<template>
	<view class="left-right-margin">
		<button class="left-right-margin" @click="authManageOnClick">身份认证审核</button>
		<button class="left-right-margin" @click="newUserPrizeManageOnClick">新人红包处理</button>
		<button class="left-right-margin" @click="oldUserPrizeManageOnClick">老人抽奖处理</button>
	</view>
</template>

<script>

import { api } from '../../config/api.js';
import { utils } from '../../common/common.js';

export default {
	data() {
		return {
		}
	},

	onLoad(option) {
	},

	methods: {
		authManageOnClick() {
			uni.navigateTo({ url: '/page_subject/pages/auth_manage' })
		},
		newUserPrizeManageOnClick() {
			uni.navigateTo({ url: '/page_subject/pages/prize_manage?user_type=new' })
		},
		oldUserPrizeManageOnClick() {
			uni.navigateTo({ url: '/page_subject/pages/prize_manage?user_type=old' })
		}
	}
}
</script>

<style>
.ConfirmButton {
	margin-top: 100rpx;
}
</style>
