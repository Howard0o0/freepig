<template>
	<view class="left-rigth-margin top-margin centerAlign">
		<text>内推记录</text>
		<scroll-view scroll-y="true" class="scroll-Y" scroll-top=0>
			<view class="row" v-for="(user,index) in recommendUserList" :key="index">
				<uni-list-chat :avatar-circle="false" :title="user.nickname" :avatar="user.avatar_url"
					:note="joinCampusAndMajorInfo(user.campus, user.major)" :time="parseUserRole(user.role)">
				</uni-list-chat>
			</view>
		</scroll-view>

		<button open-type="share" type="primary" size="normal">生成内推链接</button>
		<u--image src="/page_subject/static/recommend-draw-btn.png" shape="circle" width="200rpx" height="200rpx"
			@click="drawBtnOnclick"></u--image>

		<uni-notice-bar text="点击查看幸运儿名单" @click="showPrizeResultBtnOnClick" />
		<uni-notice-bar v-if="recommendRule" class="bottom-notice-bar" :text="recommendRule" />

		<modal v-if="showPop" title="参与抽奖后本轮内推会清空噢, 内推数越多中奖几率越大哈^ ^" confirm-text="冲鸭" cancel-text="再等等"
			@cancel="showPop=false" @confirm="confirmDrawPrize">
			<input type='text' placeholder="输入邮箱接收抽奖结果" v-model="email" />
			<input type='text' placeholder="收款支付宝账号" v-model="bankAccount" />
		</modal>
	</view>
</template>

<script>

import { api } from '../../config/api.js';
import { utils } from '../../common/common.js';

export default {
	data() {
		return {
			showPop: false,
			recommendUserList: [],
			recommendRule: "内推活动规则",
			isAbleToDraw: false,
			minRecommendNum: 100,

			email: "",
			bankAccount: "",
		}
	},

	onLoad(option) {

	},

	async onShow() {
		await this.refreshRecommendUserList()
		await this.getRecommendRule()

		let validRecommendCnt = 0
		for (let i = 0; i < this.recommendUserList.length; i++) {
			if (this.recommendUserList[i].role != "STUDENT") { continue }
			validRecommendCnt++
		}
		this.isAbleToDraw = validRecommendCnt >= this.minRecommendNum
		console.log("[DEBUG] valid recommend cnt: ", validRecommendCnt, ", min recommend cnt: ", this.minRecommendNum)
	},

	onShareAppMessage(res) {
		if (res.from === 'button') {// 来自页面内分享按钮
			console.log('share from button', res.target)
		}
		return {
			title: '欢迎加入蹲蹲蹲小集市',
			path: '/page_subject/pages/auth?recommend-code=' + this.$store.state.vuex_user.wx_open_id,
			imageUrl: '/page_subject/static/logo.png',
		}
	},

	methods: {
		async confirmDrawPrize() {
			if (this.email == "") {
				uni.showToast({
					title: '邮箱没填呀',
					icon: 'none',
					duration: 1500,
				})
				return
			}

			if (this.bankAccount == "") {
				uni.showToast({
					title: '支付宝账号咧',
					icon: 'none',
					duration: 1500,
				})
				return
			}

			console.log('[DEBUG] 开始提交抽奖');
			uni.showLoading({
				title: '提交中',
			});
			const resp = await api.drawPrize(this.email, this.bankAccount)
			if (resp.code != api.SUCCESS_CODE) { this.showPop = false; return; }
			uni.showToast({
				title: 'OK',
				icon: 'success',
				duration: 1000
			});
			this.showPop = false
			this.refreshRecommendUserList()
			this.isAbleToDraw = false
		},

		drawBtnOnclick() {
			console.log("[DEBUG] clicked draw btn")
			if (!this.isAbleToDraw) {
				uni.showToast({
					title: '有效内推数需大于' + this.minRecommendNum + '才行哇',
					icon: 'none',
					duration: 1500,
				})
				return
			}

			this.showPop = true
		},

		showPrizeResultBtnOnClick() {
			console.log("[DEBUG] clicked showPrizeResult btn")
			uni.navigateTo({ url: '/page_subject/pages/show_prize_list' })
		},

		joinCampusAndMajorInfo(campusName, majorName) {
			return campusName + " | " + majorName
		},

		async refreshRecommendUserList() {
			uni.showLoading({
				title: '',
			});
			const resp = await api.getRecommendUserList()
			console.log('[DEBUG] got recommend user list: ', resp)
			if (resp.code != api.SUCCESS_CODE) { return }
			this.recommendUserList = resp.data
			uni.hideLoading();
		},

		async getRecommendRule() {
			uni.showLoading({
				title: '',
			});
			const resp = await api.getRecommendRule()
			console.log('[DEBUG] got recommend rule: ', resp)
			if (resp.code != api.SUCCESS_CODE) { return }
			this.recommendRule = resp.data.rule
			this.minRecommendNum = resp.data.min_recommend_num
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

// 滚动条样式
/deep/ ::-webkit-scrollbar {
	/*滚动条整体样式*/
	width: 4px !important;
	height: 1px !important;
	overflow: auto !important;
	background: #ccc !important;
	-webkit-appearance: auto !important;
	display: block;
}

/deep/ ::-webkit-scrollbar-thumb {
	/*滚动条里面小方块*/
	border-radius: 10px !important;
	box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2) !important;
	background: #7b7979 !important;
}

/deep/ ::-webkit-scrollbar-track {
	/*滚动条里面轨道*/
	// box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2) !important;
	// border-radius: 10px !important;
	background: #989797 !important;
}
</style>
