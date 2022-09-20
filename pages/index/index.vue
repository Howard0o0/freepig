<template>
	<view>
		<view>index</view>
		<view>
			版本号为：{{vuex_version}}
		</view>
		<view>
			琵琶行的作者为{{vuex_user.name}}
		</view>
		<u-button @click="modifyVuex">修改变量</u-button>
	</view>
</template>

<script>
export default {
	data() {
		return {
			title: 'Hello',
		}
	},
	onLoad() {
		this.fn()
	},
	methods: {
		fn() {
			console.log("haha")
		},
		modifyVuex() {
			this.$u.vuex('vuex_version', '1.0.1');
			// 修改对象的形式，中间用"."分隔
			this.$u.vuex('vuex_user.name', '诗圣');
		}
	}
}
</script>

<style>
.content {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.logo {
	height: 200rpx;
	width: 200rpx;
	margin-top: 200rpx;
	margin-left: auto;
	margin-right: auto;
	margin-bottom: 50rpx;
}

.text-area {
	display: flex;
	justify-content: center;
}

.title {
	font-size: 36rpx;
	color: #8f8f94;
}
</style>
