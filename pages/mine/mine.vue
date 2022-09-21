<template>
	<view>
		<uni-card title="基础卡片" sub-title="副标题" extra="额外信息" :thumbnail="vuex_user.avatar_url"></uni-card>
	</view>
</template>

<script>
export default {
	data() {
		return {

		}
	},
	methods: {

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
</style>
