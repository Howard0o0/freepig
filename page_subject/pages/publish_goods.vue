<template>
	<view class="centerAlign">
		<uni-easyinput type="textarea" autoHeight="true" v-model="goodsDesc" :placeholder="goodsDescPlaceHolder"
			inputBorder="false" />
		<u-album :urls="choosedImageURLs"></u-album>
		<u--image showLoading="false" src="/page_subject/static/add_pic_btn.png" width="200rpx" height="200rpx"
			@click="addPictureBtnOnClick"></u--image>
	</view>
</template>

<script>

import { api } from '../../config/api.js';
import { utils } from '../../common/common.js';

export default {
	data() {
		return {
			goodsDesc: "",
			goodsDescPlaceHolder: "在这里描述下宝贝的转手原因、入手渠道、规格以及新旧程度和使用感受吧, 会有助于更快的转手喔~ ^o^",
			choosedImageURLs: ["", "", "", "", "", ""]
		}
	},
	methods: {
		confirmBtnOnClick() {

		},

		async addPictureBtnOnClick() {
			var res = await uni.chooseImage({
				count: 6,
				sizeType: ['compressed'],
			});
			var selectedImageFiles = res[1].tempFiles
			console.log('[DEBUG] selected images: ', selectedImageFiles)
			var choosedImageURLs = []
			for (let i = 0; i < selectedImageFiles.length; i++) {
				choosedImageURLs.push(selectedImageFiles[i].path)
			}
			this.choosedImageURLs = choosedImageURLs
		}
	}
}
</script>

<style>
.centerAlign {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}
</style>
