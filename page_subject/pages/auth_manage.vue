<template>
	<view class="left-rigth-margin">

		<view class="back-top-box">
			<u-back-top :scroll-top="scrollTop"></u-back-top>
		</view>

		<view class="list">
			<view class="row" v-for="(row, index) in userList" :key="index">
				<image :src="row.credential_image_url" mode="aspectFit" @click="imagePreview(row.credential_image_url)">
				</image>
				<view>{{ "id: " + row.id + " 姓名: " + row.realname }}</view>
				<view>{{ row.campus + " " + row.kickoff_year + "级" + row.degree }}</view>
				<view>{{ row.major }}</view>
				<view class="btns">
					<block>
						<view :style="hasSubmitted(row.id) ? 'display:none;' : ''" class="onsale" @tap="passAuthRequest(row.id)">通过</view>
						<view :style="hasSubmitted(row.id) ? 'display:none;' : ''" class="outsale" @tap="rejectAuthRequest(row.id)">拒绝</view>
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

			userList: [],
			submittedUserIDList: [],
			userParam: {
				currPageIndex: 0,
				currPageSize: 50,
				role: "PENDING",
			},
		}
	},

	onPageScroll(e) {
		this.scrollTop = e.scrollTop;
	},

	onLoad(option) {
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
		await this.refreshUserList()
		uni.hideLoading();
	},

	methods: {

		async reload() {
			this.userList = []
			this.userParam.currPageIndex = 0
			await this.refreshUserList()
			console.debug('user list: ', this.userList)
		},

		async refreshUserList() {
			uni.showLoading({ title: '加载中' })
			const resp = await api.adminGetUserList(this.userParam.currPageIndex, this.userParam.currPageSize, this.userParam.role)
			const userList = resp.data
			for (var i in userList) {
				const user = userList[i]
				this.userList.push(user)
			}
			this.userParam.currPageIndex++
			uni.hideLoading();
		},

		hasSubmitted(userID) {
			return this.submittedUserIDList.includes(userID)
		},

		imagePreview(imageURL) {
			uni.previewImage({
				indicator: "number",
				loop: true,
				urls: [imageURL],
			})
		},

		async updateUserRole(userID, role, rejectReason = "") {
			uni.showLoading("更新中")
			const resp = await api.setUserRole(userID, role, rejectReason)
			if (resp.code == api.SUCCESS_CODE) {
				uni.showToast({
					title: 'OK',
					icon: 'success',
					duration: 2000
				});
			} else {
				uni.$u.toast("更新失败 " + resp.msg)
			}
			this.submittedUserIDList.push(userID)
			console.debug("submittedUserIDList: ", this.submittedUserIDList)
		},

		async passAuthRequest(userID) {
			this.updateUserRole(userID, api.USER_ROLE.STUDENT)
		},

		rejectAuthRequest(userID) {
			var that = this
			uni.showModal({
				title: '输入拒绝理由',
				editable: true,
				success: async function (res) {
					if (res.confirm) {
						let rejectReason = res.content
						that.updateUserRole(userID, api.USER_ROLE.VERIFY_BROKEN, rejectReason)
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
</style>
