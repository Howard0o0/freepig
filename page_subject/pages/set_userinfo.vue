<template>
	<view class="left-right-margin">
		<view class="centerAlign">
			<button class="avatar-wrapper" open-type="chooseAvatar" @chooseavatar="avatarOnClick">
				<image class="avatar" :src="formData.avatarImageFilePath" mode="aspectFit" />
			</button>
		</view>

		<view class='flex-row'>
			<view>昵称</view>
			<u--input type="nickname" v-model="formData.nickname" :placeholder="userInfo.nickname" inputAlign="right"
				border="none" />
		</view>
		<u-divider></u-divider>

		<view class='flex-row'>
			<view>性别</view>
			<uni-data-checkbox mode="tag" v-model="formData.gender" :localdata="genderList"></uni-data-checkbox>
		</view>
		<u-divider></u-divider>

		<view class='flex-row'>
			<view>收款码</view>
			<view style="display: flex;">
				<view align="center" style="padding-right: 50rpx;" @click="uploadWalletCodeOnClick">上传微信收款码</view>
				<u--image v-if="formData.walletCodeURL.length > 0" shape="circle" width="40rpx" height="40rpx"
					:src="formData.walletCodeURL" mode="aspectFit" @click="imagePreview(formData.walletCodeURL)" />
			</view>
		</view>

		<view class="ok-btn">
			<u-button type="primary" text="提交" size="normal" @click="confirmBtnOnClick" />
		</view>
	</view>
</template>

<script>

import { api } from '../../config/api.js';
import { utils } from '../../common/common.js';

const NICKNAME_MAX_LENGH = 17

export default {
	data() {
		return {
			userInfo: null,
			formData: {
				nickname: "",
				gender: "",
				avatarImageFilePath: "",
				walletCodeURL: "",
			},
			genderList: [
				{
					text: '猛男',
					value: 'MALE',
				}, {
					text: '靓女',
					value: 'FEMALE',
				}
			],
		}
	},

	onLoad(option) {
		this.userInfo = this.$store.state.vuex_user
		this.formData.nickname = this.userInfo.nickname
		this.formData.gender = this.userInfo.gender
		this.formData.avatarImageFilePath = this.userInfo.avatar_url
		this.formData.walletCodeURL = this.userInfo.wallet_code
	},

	methods: {
		imagePreview(imageURL) {
			uni.previewImage({
				indicator: "number",
				loop: true,
				urls: [imageURL],
			})
		},

		async uploadWalletCodeOnClick() {
			var res = await uni.chooseImage({
				count: 1,
				sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
				crop: {
					width: 500,
					height: 500,
				}
			});
			console.debug('res: ', res)
			var selectedImageFile = res[1].tempFiles[0]
			console.debug('image choosed: ', selectedImageFile)
			const localImageFilepath = selectedImageFile.path

			uni.showLoading({
				title: '',
			})
			var resp = await api.uploadImage(0, localImageFilepath)
			uni.hideLoading()
			if (resp.code != api.SUCCESS_CODE) { return "" }
			let imageURL = resp.data.image_urls
			this.formData.walletCodeURL = imageURL
		},

		async confirmBtnOnClick() {
			if (!this.checkFormData()) {
				return false
			}

			uni.showLoading({
				title: '更新中',
			});
			let avatar_url = this.formData.avatarImageFilePath
			if (this.formData.avatarImageFilePath.indexOf("https://") == -1 && this.formData.avatarImageFilePath != this.userInfo.avatar_url) {
				// if the user choose a new avatar image, use the new one
				let resp = await api.uploadImage(0, this.formData.avatarImageFilePath)
				if (resp.code != api.SUCCESS_CODE) { return }
				avatar_url = resp.data.image_urls
			}

			let resp = await api.setUserInfo(avatar_url, this.formData.nickname, this.formData.gender, this.formData.walletCodeURL)
			uni.hideLoading()
			if (resp.code != api.SUCCESS_CODE) { return }

			uni.showToast({
				title: 'OK',
				icon: 'success',
				duration: 2000
			});
			utils.refreshUserInfo()

			setTimeout(function () {
				uni.reLaunch({ url: '../../pages/mine/mine' })
			}, 2000)
		},

		checkFormData() {
			if (this.formData.nickname == "") {
				uni.showToast({
					title: '昵称不可为空呀',
					icon: 'none',
					duration: 1000
				});
				return false
			}
			if (this.formData.nickname.length > NICKNAME_MAX_LENGH) {
				uni.showToast({
					title: '昵称最长' + NICKNAME_MAX_LENGH + '个字哟',
					icon: 'none',
					duration: 1000
				});
				return false
			}
			if (this.formData.gender == "") {
				uni.showToast({
					title: '性别咧',
					icon: 'none',
					duration: 1000
				});
				return false
			}
			if (this.formData.avatarImageFilePath == "") {
				uni.showToast({
					title: '头像不可为空呀',
					icon: 'none',
					duration: 1000
				});
				return false
			}
			return true
		},

		async avatarOnClick(e) {
			console.log('[DEBUG] avatarOnClick, e: ', e)
			let selectedImageFile = e.detail.avatarUrl
			console.log('[DEBUG] avatar image choosed: ', selectedImageFile)
			this.formData.avatarImageFilePath = selectedImageFile
			console.log('[DEBUG] avatar image choosed filepath: ', this.formData.avatarImageFilePath)
		}
	}
}
</script>

<style>
.avatar {
	/* text-align: left;
	width: 200rpx;
	height: 200rpx;
	flex-shrink: 0;
	border: solid 1rpx #000; */

	display: block;
	width: 200rpx;
	height: 200rpx;
}

.avatar-wrapper {
	padding: 0;
	width: 200rpx !important;
	border-radius: 8px;
	margin-top: 40px;
	margin-bottom: 40px;
}

.centerAlign {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.flex-row {
	display: flex;
	margin-top: 20rpx;
	margin-bottom: 20rpx;
	justify-content: space-between;
}

.wallet-code-thumbnail {
	width: 40rpx;
}

.ok-btn {
	position: fixed;
	bottom: 100rpx;
	width: 85%;
	margin-left: 20rpx;
	margin-right: 20rpx;
}
</style>
