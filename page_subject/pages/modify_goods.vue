<template>
	<view class="centerAlign left-rigth-margin">
		<uni-easyinput type="textarea" autoHeight="true" v-model="goodsDesc" :placeholder="goodsDescPlaceHolder"
			inputBorder="false" />
		<u-album :urls="choosedImageURLs"></u-album>
		<u--image showLoading="false" src="/page_subject/static/add_pic_btn.png" width="200rpx" height="200rpx"
			@click="addPictureBtnOnClick"></u--image>

		<view class="uni-px-5">
			<uni-data-checkbox mode="tag" v-model="selectedTag" :localdata="tagList"></uni-data-checkbox>
		</view>

		<u--form labelPosition="left">
			<u-form-item leftIcon="rmb-circle-fill" label="价格" labelWidth="80">
				<u--input type="digit" v-model="price" placeholder="0.00" inputAlign="right" border="none" />
			</u-form-item>
		</u--form>

		<u-button type="primary" text="OK" size="normal" @click="confirmBtnOnClick" />
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
			choosedImageURLs: [""],
			imageURLsUpdated: false,
			tagList: [
				{
					text: '加载中',
					value: 1,
				}, {
					text: '加载中',
					value: 2,
				}
			],
			selectedTag: "",
			price: 0.00,
			goodsID: "",
			MAX_IMAGE_SIZE_BYTE: (20 << 20),

			goodsToModify: null,
		}
	},
	methods: {
		async onLoad() {
			this.goodsToModify = getApp().globalData.selectedGoodsToModify
			console.log("[DBBUG] goodsToModify: ", this.goodsToModify)

			this.goodsDesc = this.goodsToModify.description
			this.goodsID = this.goodsToModify.id
			this.choosedImageURLs = this.goodsToModify.images.split(',');
			this.price = this.goodsToModify.price
			this.selectedTag = this.goodsToModify.tag_id

			// get tag list from server
			var tagList = []
			var resp = await api.getTagList()
			for (var i = 0; i < resp.data.length; i++) {
				var tag = resp.data[i]
				if (tag.name == '全部') { continue }
				tagList.push({
					text: tag.name,
					value: tag.id,
				})
			}
			this.tagList = tagList
		},

		async confirmBtnOnClick() {
			if (!this.checkFormData()) { return }

			uni.showToast({
				title: '更新中',
				icon: 'loading',
				duration: 2000
			});

			imageURLs = ""
			if (this.imageURLsUpdated) {
				var imageURLs = await this.uploadImages()
				console.log('uploaded image urls: ', imageURLs)
				if (imageURLs == "") { return }
			} else {
				imageURLs = this.choosedImageURLs.join(',')
			}

			var resp = await api.updateGoods(this.goodsID, this.goodsDesc, this.selectedTag, this.price, imageURLs)
			if (resp.code != api.SUCCESS_CODE) { return }

			uni.showToast({
				title: 'OK',
				icon: 'success',
				duration: 2000
			});

			setTimeout(function () {
				uni.navigateBack({
					delta: 1
				});
			}, 2000)
		},

		checkFormData() {
			if (this.goodsDesc == "") {
				uni.showToast({
					title: '要描述下宝贝呀',
					icon: 'none',
					duration: 1000
				});
				return false
			}
			var choosedImageURLs = this.choosedImageURLs
			if (choosedImageURLs.length == 0 || choosedImageURLs[0] == "") {
				uni.showToast({
					title: '上传下宝贝相关的图片吧',
					icon: 'none',
					duration: 1000
				});
				return false
			}
			if (this.selectedTag == "") {
				uni.showToast({
					title: '要选下标签呀',
					icon: 'none',
					duration: 1000
				});
				return false
			}
			if (this.price == 0) {
				uni.showToast({
					title: '哈 价格都没填呢',
					icon: 'error',
					duration: 1000
				});
				return false
			}
			if (this.goodsID == "") {
				uni.showToast({
					title: '重新进入下该页面吧, 网络不佳',
					icon: 'none',
					duration: 1000
				});
				return false
			}
			return true
		},

		async uploadImages() {
			var imageURLs = ""
			var choosedImageURLs = this.choosedImageURLs
			for (var i = 0; i < choosedImageURLs.length; i++) {
				if (choosedImageURLs[i] == "") { continue }
				var resp = await api.uploadImage(this.goodsID, choosedImageURLs[i])
				if (resp.code != api.SUCCESS_CODE) { return "" }
				imageURLs += "," + resp.data.image_urls
			}
			return imageURLs.substring(1)
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
				if (selectedImageFiles[i].size > this.MAX_IMAGE_SIZE_BYTE) {
					uni.showToast({
						title: '第' + (i + 1) + '张图太大啦, 单图大小限制' + (this.MAX_IMAGE_SIZE_BYTE >> 20) + 'MB呀',
						icon: 'none',
						duration: 2000
					});
					this.choosedImageURLs = []
					return
				}
				choosedImageURLs.push(selectedImageFiles[i].path)
			}
			this.choosedImageURLs = choosedImageURLs
			this.imageURLsUpdated = true
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

.uni-px-5 {
	padding-left: 10px;
	padding-right: 10px;
}

/* .margin-left-right-side {
	margin-left: 10px;
	margin-right: 10px;
} */
</style>
