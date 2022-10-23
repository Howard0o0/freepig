<template>
	<view class="left-rigth-margin top-margin centerAlign">
		<text>恭喜以下幸运儿</text>
		<uni-list>
			<uni-list-chat v-for="(user,index) in prizeUserList" :key="index" :avatar-circle="false"
				:title="user.nickname" :avatar="user.avatar_url"
				:note="joinCampusAndMajorInfo(user.campus, user.major)">
				<view class="chat-custom-right">
					<text class="price">¥{{user.prize}}</text>
				</view>
			</uni-list-chat>
		</uni-list>
	</view>
</template>

<script>

import { api } from '../../config/api.js';
import { utils } from '../../common/common.js';

export default {
	data() {
		return {
			prizeUserList: [],
		}
	},

	onLoad(option) {

	},

	onShow() {
		this.refreshPrizeUserList()
	},

	methods: {

		toPrize(prize) {
			return "¥" + prize
		},

		joinCampusAndMajorInfo(campusName, majorName) {
			return campusName + " | " + majorName
		},

		async refreshPrizeUserList() {
			uni.showLoading({
				title: '',
			});
			const resp = await api.getPrizeUserList()
			console.log('[DEBUG] got prize user list: ', resp)
			if (resp.code != api.SUCCESS_CODE) { return }
			this.prizeUserList = resp.data
			uni.hideLoading();
		},


		parseUserRole(role) {
			switch (role) {
				case "STUDENT":
					return "已认证"
				case "VISITOR":
					return "未认证"
				case "PENDING":
					return "审核中"
				case "VERIFY_BROKEN":
					return "审核未通过"
			}
			return ""
		},
	}
}
</script>

<style lang="scss">
.scroll-Y {
	height: 700rpx;
	background: #eaeaea;
}

.fixed-top-right {
	position: fixed;
	top: 0rpx;
	right: 0rpx;
}

.prize-list {
	width: 98%;
}

.chat-custom-right {
	flex: 1;
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-direction: column;
	justify-content: space-between;
	align-items: flex-end;
}

.price {
	color: #e65339;
	font-size: 32upx;
	font-weight: 600;
}
</style>
