<template>
	<view v-if="userInfo != null">
		<uni-card :title="userInfo.nickname" :sub-title="joinCampusAndMajorInfo(userInfo.campus, userInfo.major)"
			:extra="generateUserDescription(userInfo)" :thumbnail="userInfo.avatar_url"></uni-card>
	</view>
</template>

<script>

import store from '@/store/index.js';
import { utils } from '../../common/common.js';

export default {
	data() {
		return {
			userInfo: null,
		}
	},
	onLoad(options) {
		this.userInfo = JSON.parse(options.userInfo);
		console.log('[DEBUG] user info detail: ', this.userInfo)
	},
	onShow() {
	},

	methods: {
		generateUserDescription(userInfo) {
			const kickoffYear = userInfo.kickoff_year
			const degree = userInfo.degree
			const gender = userInfo.gender

			let kickoffYearDesc = ""
			let degreeDesc = ""
			let genderDesc = ""

			if (kickoffYear > 2000 && kickoffYear < 2050) {
				kickoffYearDesc = (kickoffYear - 2000) + "级"
			}
			if (degree in ["专科", "本科", "硕士研究生", "博士研究生"]) {
				degreeDesc = degree.slice(0, 2)
			}
			if (gender == "MALE") {
				genderDesc = "靓仔"
			} else if (gender == "FEMALE") {
				genderDesc = "靓女"
			}

			return kickoffYearDesc + degreeDesc + genderDesc;
		},

		joinCampusAndMajorInfo(campusName, majorName) {
			return campusName + " | " + majorName
		},
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
