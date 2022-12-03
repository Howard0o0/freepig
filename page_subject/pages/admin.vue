<template>
	<view class="left-rigth-margin">
		<button class="left-rigth-margin" @click="authManageOnClick">身份认证审核</button>
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
		}
	}
}
</script>

<style>
.ConfirmButton {
	margin-top: 100rpx;
}
</style>
