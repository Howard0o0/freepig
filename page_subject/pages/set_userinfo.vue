<template>
	<view class="left-rigth-margin">
		<view class="centerAlign">
			<button class="avatar-wrapper" open-type="chooseAvatar" @chooseavatar="avatarOnClick">
				<image class="avatar" :src="formData.avatarImageFilePath" mode="aspectFit" />
			</button>
		</view>
		<u-form-item label="昵称" labelWidth="80" borderBottom>
			<input type="nickname" v-model="formData.nickname" :placeholder="userInfo.nickname" inputAlign="center" />
		</u-form-item>
		<u-form-item label="性别" labelWidth="80" borderBottom>
			<uni-data-checkbox mode="tag" v-model="formData.gender" :localdata="genderList"></uni-data-checkbox>
		</u-form-item>
		<u-button type="primary" text="提交" size="normal" @click="confirmBtnOnClick" />
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
	},

	methods: {
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

			let resp = await api.setUserInfo(avatar_url, this.formData.nickname, this.formData.gender)
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
</style>
