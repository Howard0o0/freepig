<template>
	<view class="left-rigth-margin top-margin centerAlign">
		<view class="container">
			<image class="bg-img" :src="activityRuleBackgroundImageURL"></image>
			<view class="recommend-code-block centerAlign">
				<view style=" margin-top:30rpx"></view>
				<view style=" font-weight:700">专属邀请码</view>
				<view style=" margin-top:30rpx"></view>
				<text user-select="true" style="color: #fbb462; font-weight:700" @click="recommendCodeOnClick">{{
						recommendCode
				}}</text>
				<view style=" margin-top:30rpx"></view>
				<view class="invite-btn">
					<u-button shape="circle" color="#ffda45" type="primary" size="normal" text="邀请好友"
						openType="share"></u-button>
				</view>

				<view style=" margin-top:30rpx"></view>

				<view class="invite-btn">
					<u-button shape="circle" color="#ffda45" type="primary" size="normal" text="生成链接"
						@click="genShareLinkBtnOnclick"></u-button>
				</view>
				<view style=" margin-top:50rpx"></view>
			</view>
		</view>


		<view @click="drawBtnOnclick">
			<image class="draw_prize_btn" :src="drawPrizeBtnImageURL" />
		</view>

		<view style=" margin-top:30rpx">
			<text class="centerAlign" style=" font-weight:700">我的邀请</text>
			<view class="row" v-for="(user, index) in recommendUserList" :key="index">
				<uni-list-chat :avatar-circle="false" :title="user.nickname" :avatar="user.avatar_url"
					:note="joinCampusAndMajorInfo(user.campus, user.major)" :time="parseUserRole(user.role)">
				</uni-list-chat>
			</view>
		</view>

		<view class="loading-text">hoops 没有更多啦 ┑(￣▽ ￣)┍</view>

		<!-- <u--image src="/page_subject/static/recommend-draw-btn.png" shape="circle" width="300rpx" height="300rpx"
			@click="drawBtnOnclick"></u--image> -->

		<!-- 
		<view class="demo-uni-row">
			<uni-row width=730>
				<uni-col :span="11">
					<u-button color="#D082A2" type="primary" size="normal" text="  生成内推链接  "
						openType="share"></u-button>
				</uni-col>
				<uni-col :span="2">
					<view class="demo-uni-col"></view>
				</uni-col>
				<uni-col :span="11">
					<u-button color="#D082A2" type="primary" size="normal" text=" 上期幸运儿  "
						@click="showPrizeResultBtnOnClick" />
				</uni-col>
			</uni-row>
		</view>

		<scroll-view scroll-y="true" class="scroll-Y" scroll-top=0>
			<text class="centerAlign" style=" color:#D082A2">内推记录</text>
			<view class="row" v-for="(user, index) in recommendUserList" :key="index">
				<uni-list-chat :avatar-circle="false" :title="user.nickname" :avatar="user.avatar_url"
					:note="joinCampusAndMajorInfo(user.campus, user.major)" :time="parseUserRole(user.role)">
				</uni-list-chat>
			</view>
		</scroll-view> -->

		<!-- <modal v-if="showPop" :title="showPopTitle" content="收款人需与账号一致" confirm-text="冲鸭" cancel-text="再等等"
			@cancel="showPop = false" @confirm="confirmDrawPrize">
			<input type='text' placeholder="收款支付宝账号" v-model="bankAccount" />
			<input type='text' placeholder="支付宝收款人" v-model="payee" />
		</modal> -->

		<!-- <text>内推记录</text>
		<scroll-view scroll-y="true" class="scroll-Y" scroll-top=0>
			<view class="row" v-for="(user, index) in recommendUserList" :key="index">
				<uni-list-chat :avatar-circle="false" :title="user.nickname" :avatar="user.avatar_url"
					:note="joinCampusAndMajorInfo(user.campus, user.major)" :time="parseUserRole(user.role)">
				</uni-list-chat>
			</view>
		</scroll-view>

		<button open-type="share" type="primary" size="normal">生成内推链接</button>
		<u--image src="/page_subject/static/recommend-draw-btn.png" shape="circle" width="200rpx" height="200rpx"
			@click="drawBtnOnclick"></u--image>

		<uni-notice-bar text="点击查看幸运儿名单" @click="showPrizeResultBtnOnClick" />
		<uni-notice-bar v-if="recommendRule" @getmore="showRecommendRule" showGetMore moreText="点击查看内推规则"
			class="bottom-notice-bar" single text=" " />

		<modal v-if="showPop" title="参与抽奖后本轮内推会清空噢, 内推数越多中奖几率越大哈^ ^" confirm-text="冲鸭" cancel-text="再等等"
			@cancel="showPop = false" @confirm="confirmDrawPrize">
			<input type='text' placeholder="输入邮箱接收抽奖结果" v-model="payee" />
			<input type='text' placeholder="收款支付宝账号" v-model="bankAccount" />
		</modal> -->
	</view>
</template>

<script>

import uParse from '@/components/gaoyia-parse/parse.vue'
import { api } from '../../config/api.js';
import { utils } from '../../common/common.js';

export default {
	components: {
		uParse
	},

	options: { styleIsolation: 'shared' },

	data() {
		return {
			activityRuleBackgroundImageURL: "/page_subject/static/activity_bg_for_old_user.png",
			drawPrizeBtnImageURL: "/page_subject/static/draw_prize_btn.png",
			showPopTitle: "抽红包",

			recommendCode: this.$store.state.vuex_user.wx_open_id,
			showPop: false,
			recommendUserList: [],
			recommendRule: "内推活动规则",
			isAbleToDraw: false,
			minRecommendNum: 100,
			recommendRuleNode: {
				rule: `<text style=" color:#D00A07">活动规则: </text> <text style=" color:#FFFFFF"> 生成内推链接并邀请高校好友完成认证，邀请好友成功认证大于5人即可参与现金抽奖活动!!</text>`,
				prize: `<text style=" color:#D00A07">奖金范围: </text> <text style=" color:#FFFFFF"> 3~30元不等，成功邀请好友完成认证数越多，获奖几率越大哇</text>`,
				// date: `<text style=" color:#D00A07">活动时间: </text> 2022年12月8日 ~ 2022年12月30日`,
			},
			hasDrawedBefore: true,

			payee: "",
			bankAccount: "",
		}
	},

	onLoad(option) {

	},

	async onShow() {
		if (this.$store.state.vuex_user.draw_count <= 0) {
			this.hasDrawedBefore = false
			this.activityRuleBackgroundImageURL = "/page_subject/static/activity_bg_for_new_user.png"
			this.drawPrizeBtnImageURL = "/page_subject/static/cash_prize_btn.png"
			this.showPopTitle = "领取红包"
		}
		console.debug("是否已经参与过抽奖: ", this.hasDrawedBefore)
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
			title: '高校出闲置 上兜兜 新人领红包',
			path: '/pages/index/index?recommend-code=' + this.$store.state.vuex_user.wx_open_id,
			imageUrl: '/page_subject/static/activity_bg_for_new_user.png',
		}
	},

	methods: {
		recommendCodeOnClick() {
			var that = this
			uni.setClipboardData({
				data: that.recommendCode,
				success: () => {
					uni.showToast({//提示
						title: '内推码已复制',
						icon: 'success',
						duration: 2000
					})
				},
				fail: () => {
					console.error("复制内推码失败")
				}
			});
		},

		generateShareLink() {
			if (!this.$store.state.vuex_user.wx_open_id || this.$store.state.vuex_user.wx_open_id == "") {
				console.error("wx_open_id empty while generating sharelink")
				return ""
			}
			return "https://www.doraewhite.com/api/v1/activity/recommend/share-link?recommend-code=" + this.$store.state.vuex_user.wx_open_id
		},

		async genShareLinkBtnOnclick() {
			const resp = await api.getShareLink()
			if (resp.code != api.SUCCESS_CODE) {
				uni.$u.toast("生成链接失败 请使用邀请好友")
				return;
			}
			let shareLink = resp.data
			shareLink = "[兜兜] " + shareLink + " 「邀好友 领红包」高校专属闲置发布平台 点击链接直接打开 邀请两个好友完成认证 最高抽百元红包"
			if (shareLink == "") {
				console.error("generateShareLink fail")
				uni.$u.toast("生成链接失败 请使用邀请好友")
				return
			}
			uni.setClipboardData({
				data: shareLink,
				success: () => {
					uni.showToast({//提示
						title: '内推链接已复制',
						icon: 'success',
						duration: 2000
					})
				},
				fail: () => {
					console.error("复制分享链接到剪切板失败")
					uni.$u.toast("生成链接失败 请使用邀请好友")
				}
			});
		},

		showRecommendRule() {
			var that = this
			uni.showModal({
				title: "内推活动规则",
				content: that.recommendRule,
				showCancel: false,
			})
		},

		async confirmDrawPrize() {
			await utils.promiseRequestSubscribeMessage(['2GB_iOtnLNNKOpivNlBNhnZRo4AbZaAYDwetzVsvqcY'])

			console.debug('开始提交抽奖');
			uni.showLoading({
				title: '提交中',
			});
			const resp = await api.drawPrize("", this.$store.state.vuex_user.wallet_code)
			uni.hideLoading()
			if (resp.code != api.SUCCESS_CODE) { this.showPop = false; return; }

			if (this.$store.state.vuex_user.draw_count <= 0) {
				// new user, return cash
				uni.$u.toast("领取成功 将会在一日内到账")
			} else {
				uni.$u.toast("感谢参与 结果片刻即出")
			}

			setTimeout(() => {
				this.refreshRecommendUserList()
				this.isAbleToDraw = false
			}, 2000)

		},

		drawBtnOnclick() {
			console.log("[DEBUG] clicked draw btn")
			if (!this.isAbleToDraw) {
				uni.$u.toast("内推数不足 >_<|||")
				return
			}


			if (this.$store.state.vuex_user.wallet_code.length <= 0) {
				uni.$u.toast("请先绑定微信收款码")
				setTimeout(() => {
					uni.navigateTo({ url: '/page_subject/pages/set_userinfo' })
				}, 1500)
			} else {
				this.confirmDrawPrize()
			}
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
	height: 500rpx;
	background: #EEECF5;
	margin-top: 10rpx;
	border-radius: 30rpx;
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

.demo-uni-row {
	margin-top: 20rpx;
	display: block;
}

.demo-uni-col {
	height: 36px;
	border-radius: 4px;
}

.activity-rule {
	background: #ffffff;
	border-radius: 30rpx;
	width: 90%;
	margin-top: 90rpx;
}

.bg-img {
	position: fixed;
	width: 100%;
	height: 695rpx;
	top: 0;
	left: 0;
	z-index: -1;
}

.draw_prize_btn {
	width: 700rpx;
	height: 159rpx;
	margin-top: 50rpx;
	left: 0;
	z-index: -1;
}

.recommend-code-block {
	border-radius: 30rpx;
	width: 600rpx;
	margin-top: 120rpx;
	background: #ffffff;
}

/deep/ .invite-btn {
	width: 200rpx;
}

.loading-text {
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	height: 60upx;
	color: #979797;
	font-size: 24upx;
}
</style>

