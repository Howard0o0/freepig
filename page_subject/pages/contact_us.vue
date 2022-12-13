<template>
	<view class="left-rigth-margin centerAlign">
		<image class="logo" src="/page_subject/static/logo.png" mode="aspectFit"></image>
		<view>{{aboutFreePigParagraph0}}</view>
		<view>{{aboutFreePigParagraph1}}</view>
		<u-form-item leftIcon="email" >
			<text user-select="true">support@doraewhite.com</text>
		</u-form-item>
	</view>
</template>

<script>

import { api } from '../../config/api.js';
import { utils } from '../../common/common.js';


export default {
	data() {
		return {
			aboutFreePigParagraph0: "兜兜是由清华-武大的创业团队联合开发的校园便捷宝贝发布平台, 致力于为童鞋们打造一个可靠方便的跳蚤市场",
			aboutFreePigParagraph1: "如果你对产品的使用有疑惑或不满, 以及相关的改进意见都欢迎骚扰呀, 嘿嘿",
		}
	},

	onLoad(option) {
	},

	methods: {

	}
}
</script>

<style>

.logo {
	width: 200rpx;
	height: 200rpx;
}

</style>
