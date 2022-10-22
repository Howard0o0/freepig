<template>
	<view class="left-rigth-margin centerAlign">
		<scroll-view scroll-y="true" class="scroll-Y">
			<view class="row" v-for="(user,index) in authUserList" :key="index">
				<uni-list-chat :avatar-circle="false" :title="user.wx_nickname" :avatar="user.wx_avatar_url"
					:note="joinCampusAndMajorInfo(user.campus_name, user.major_name)" :time="parseUserRole(user.role)" ></uni-list-chat>
			</view>
		</scroll-view>
		<button open-type="share" type="primary">生成内推链接</button>
	</view>
</template>

<script>

import { api } from '../../config/api.js';
import { utils } from '../../common/common.js';

export default {
	data() {
		return {
			authUserList: [
				{
					wx_nickname: "wx_nickname",
					wx_avatar_url: "https://ddp-freepig.oss-cn-beijing.aliyuncs.com/images/default-avatar.png",
					gender: "MALE",
					campus_name: "武汉大学",
					major_name: "计算机",
					role: "PENDING"
				}
			],
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
		joinCampusAndMajorInfo(campusName, majorName) {
			return campusName + " | " + majorName
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

<style>
.scroll-Y {
	height: 300rpx;
}
</style>
