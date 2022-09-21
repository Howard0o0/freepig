<template>
	<view>
		<uni-card :title="vuex_user.nickname" :sub-title="vuex_user.campus" :extra="authTag"
			:thumbnail="vuex_user.avatar_url"></uni-card>
	</view>
</template>

<script>
import store from '@/store/index.js';
export default {
	data() {
		return {
			authTag: '未认证'
		}
	},
	onLoad() {
		this.refreshAuthTag()
	},
	methods: {
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
</style>
