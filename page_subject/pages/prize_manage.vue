<template>
	<view class="left-rigth-margin">

		<view class="back-top-box">
			<u-back-top :scroll-top="scrollTop"></u-back-top>
		</view>

		<view class="list">
			<view v-for="(prizeItem, index) in prizeItemList" :key="index">
				<view class="flex-row">
					<u--image shape="circle" width="150rpx" height="150rpx" :src="prizeItem.bank_account"
						mode="aspectFit" @click="imagePreview(prizeItem.bank_account)" />
					<view>
						<view>{{ "id: " + prizeItem.id + " user_id: " + prizeItem.user_id }}</view>
						<view>{{ "realname: " + prizeItem.payee_realname }}</view>
						<view>{{ "prize: " + prizeItem.prize + " handled: " + prizeItem.handled }}</view>
					</view>
				</view>
				<view class="btns">
					<block>
						<view :style="hasSubmitted(prizeItem.id) ? 'display:none;' : ''" class="onsale"
							@tap="passPrizeItem(prizeItem.id)">通过</view>
						<view :style="hasSubmitted(prizeItem.id) ? 'display:none;' : ''" class="outsale"
							@tap="rejectPrizeItem(prizeItem.id)">拒绝</view>
					</block>
				</view>
			</view>
		</view>
	</view>
</template>

<script>

import { api } from '../../config/api.js';
import { utils } from '../../common/common.js';

export default {
	data() {
		return {
			scrollTop: 0,

			prizeItemList: [],
			handledPrizeIDList: [],
			userParam: {
				currPageIndex: 0,
				currPageSize: 50,
				role: "PENDING",
			},

			userType: "new",
		}
	},

	onPageScroll(e) {
		this.scrollTop = e.scrollTop;
	},

	onLoad(option) {
		this.userType = option["user_type"]
		this.reload()
	},

	//下拉刷新，需要自己在page.json文件中配置开启页面下拉刷新 "enablePullDownRefresh": true
	onPullDownRefresh() {
		setTimeout(() => {
			this.reload();
			uni.stopPullDownRefresh();
		}, 1000);
	},
	//上拉加载，需要自己在page.json文件中配置"onReachBottomDistance"
	async onReachBottom() {
		uni.showLoading({
			title: '加载中',
			mask: false
		});
		await this.refreshPrizeItemList()
		uni.hideLoading();
	},

	methods: {

		async reload() {
			this.prizeItemList = []
			await this.refreshPrizeItemList()
			console.debug('prize item list: ', this.prizeItemList)
		},

		async refreshPrizeItemList() {
			uni.showLoading({ title: '加载中' })
			if (this.userType == "new") {
				const resp = await api.adminGetNewUserPrizeList()
				this.prizeItemList = resp.data
			} else {
				const resp = await api.adminGetOldUserPrizeList()
				this.prizeItemList = resp.data
			}
			uni.hideLoading();
		},

		hasSubmitted(prizeItemID) {
			return this.handledPrizeIDList.includes(prizeItemID)
		},

		imagePreview(imageURL) {
			uni.previewImage({
				indicator: "number",
				loop: true,
				urls: [imageURL],
			})
		},

		async adminHandleUserPrize(prizeItemID, prize, failMsg = "") {
			uni.showLoading("更新中")
			const resp = await api.adminHandleUserPrize(prizeItemID, prize, failMsg)
			if (resp.code == api.SUCCESS_CODE) {
				uni.showToast({
					title: 'OK',
					icon: 'success',
					duration: 2000
				});
			} else {
				uni.$u.toast("更新失败 " + resp.msg)
			}
			this.handledPrizeIDList.push(prizeItemID)
			console.debug("handledPrizeIDList: ", this.handledPrizeIDList)
		},

		async passPrizeItem(prizeItemID) {
			var that = this
			uni.showModal({
				title: '输入金额 0-20',
				editable: true,
				success: async function (res) {
					if (res.confirm) {
						that.adminHandleUserPrize(prizeItemID, res.content)
					} else if (res.cancel) {
						console.debug('reject auth cancel');
					}
				}
			});
		},

		rejectPrizeItem(prizeItemID) {
			var that = this
			uni.showModal({
				title: '输入失败信息',
				editable: true,
				success: async function (res) {
					if (res.confirm) {
						that.adminHandleUserPrize(prizeItemID, 0, res.content)
					} else if (res.cancel) {
						console.debug('reject auth cancel');
					}
				}
			});
		}
	}
}
</script>

<style lang="scss">
.ConfirmButton {
	margin-top: 100rpx;
}

credential-image {
	width: 100rpx;
	height: 100rpx;
	border-radius: 100%;
}

.btns {
	height: 80upx;
	display: flex;
	align-items: center;
	justify-content: flex-end;

	view {
		min-width: 120upx;
		height: 50upx;
		padding: 0 20upx;
		border-radius: 50upx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 28upx;
		margin-left: 20upx;
	}

	.onsale {
		border: solid 1upx rgb(0, 115, 247);
		color: rgb(0, 115, 247);
	}

	.outsale {
		border: solid 1upx #ec652f;
		color: #ec652f;
	}
}

.flex-row {
	display: flex;
	margin-top: 20rpx;
	margin-bottom: 20rpx;
}
</style>
