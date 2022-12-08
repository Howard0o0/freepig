<template>
	<view class="left-rigth-margin">
		<u-row justify="space-between" customStyle="margin-bottom: 10px">
			<u-col span="6">
				<u--image showLoading="false" src="/static/choose_image.png" width="300rpx" height="300rpx"
					@click="chooseCertificationImageBtnOnClick"></u--image>
			</u-col>
			<u-col span="6">
				<u--image showLoading="false" :src="formData.selectedImageFilePath" width="300rpx" height="300rpx"
					bgColor="#ffffff">
				</u--image>
			</u-col>
		</u-row>

		<u-button type="primary" size="normal" text="OK" @click="submitBtnOnclick"></u-button>
	</view>
</template>

<script>

import { api } from '../../config/api.js';
import { utils } from '../../common/common.js';

export default {
	data() {
		return {
			formData: {
				selectedImageFilePath: "",
				authInfo: null,
			},
			selectedImageFile: null,
			MAX_IMAGE_SIZE_BYTES: (20 << 20),
		}
	},

	onLoad(option) {
		console.log('params: ', option)
		this.formData.authInfo = option
	},

	methods: {
		async chooseCertificationImageBtnOnClick() {
			var res = await uni.chooseImage({
				count: 1,
				sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
				crop: {
					width: 500,
					height: 500,
				}
			});
			var selectedImageFile = res[1].tempFiles[0]
			console.log('[DEBUG] image choosed: ', selectedImageFile)
			this.formData.selectedImageFilePath = selectedImageFile.path
			console.log('[DEBUG] image choosed filepath: ', this.formData.selectedImageFilePath)
			this.selectedImageFile = selectedImageFile
		},

		async submitBtnOnclick() {

			if (this.selectedImageFile.size > this.MAX_IMAGE_SIZE_BYTES) {
				uni.showToast({
					title: '图片太大啦, 裁剪到' + (this.MAX_IMAGE_SIZE_BYTES>>20) + "MB以下吧^ ^",
					icon: 'none',
					duration: 2000
				});
				return
			}

			uni.showLoading({
				title: '提交中',
			});

			var resp = await api.identifyByCertification(
				this.formData.selectedImageFilePath,
				this.formData.authInfo.realname,
				this.formData.authInfo.campus_id,
				this.formData.authInfo.major_id,
				this.formData.authInfo.kickoff_year,
				this.formData.authInfo.degree,
				this.formData.authInfo.recommend_code
			)
			uni.showToast({
				title: '上传成功,审核结果将在10分钟内返回 23:00-08:00休息哈',
				icon: 'none',
				duration: 2000
			});
			utils.refreshUserInfo()
			setTimeout(function () {
				uni.reLaunch({ url: '../../pages/mine/mine' })
			}, 2000)
		}
	}
}
</script>

<style>
.ConfirmButton {
	margin-top: 100rpx;
}
</style>
