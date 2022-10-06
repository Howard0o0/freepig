<template>
	<view>
		<image class="avatar" :src="formData.avatarImageFilePath" mode="scaleToFill" @click="avatarOnClick"></image>
		<u-form-item label="昵称" labelWidth="80" borderBottom>
			<u--input v-model="formData.nickname" :placeholder="userInfo.nickname" inputAlign="center"
				border="surround" />
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
		confirmBtnOnClick() {
			if (!this.checkFormData()) {
				return false
			}
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

		async avatarOnClick() {
			console.log('[DEBUG] avatarOnClick')
			let res = await uni.chooseImage({
				count: 1,
				sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
			});
			let selectedImageFile = res[1].tempFiles[0]
			console.log('[DEBUG] avatar image choosed: ', selectedImageFile)
			this.formData.avatarImageFilePath = selectedImageFile.path
			console.log('[DEBUG] avatar image choosed filepath: ', this.formData.avatarImageFilePath)
		}
	}
}
</script>

<style>
.avatar {
	text-align: left;
	width: 100rpx;
	height: 100rpx;
}
</style>
