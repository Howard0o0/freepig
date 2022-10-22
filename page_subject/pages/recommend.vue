<template>
	<view class="left-rigth-margin centerAlign">
		<button open-type="share">生成内推链接</button>
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

	onShareAppMessage(res) {
		if (res.from === 'button') {// 来自页面内分享按钮
			console.log('share from button', res.target)
		}
		return {
			title: '欢迎加入多啦白小集市',
			path: '/page_subject/pages/auth?recommend-code=avc124'
		}
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
