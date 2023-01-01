<template>
	<view>
		<view class="centerAlign left-rigth-margin" style="margin-top: 30rpx;">
			<textarea maxlength="1024" class="input-textarea" v-model="articleContent" :placeholder="articleContentPlaceHolder"
				inputBorder="false" />
		</view>

		<view class="left-rigth-margin" style="margin-top: 30rpx;">
			<tui-upload :value="choosedImageURLs" limit="6" @complete="pickImageComplete" @remove="removeImage"
				sizeType="['compressed']" imageFormat="['jpg','png']" size="9" width="180" height="180">
			</tui-upload>
		</view>

		<view class="bottom-btn">
			<u-button shape="circle" type="primary" text="发布" size="normal" @click="confirmBtnOnClick" />
		</view>
	</view>
</template>

<script>

import { api } from '../../config/api.js';
import { utils } from '../../common/common.js';
import tuiUpload from "@/components/thorui/tui-upload/tui-upload.vue"

export default {
	components: {
		tuiUpload
	},
	data() {
		return {
			isModifyGoodsMode: false,

			articleContent: "",
			articleContentPlaceHolder: "分享校园新鲜事...",
			choosedImageURLs: [],
			MAX_IMAGE_SIZE_BYTE: (20 << 20),
		}
	},
	methods: {
		async onLoad(options) {

		},
		removeImage(e) {
			this.choosedImageURLs.splice(e.index, 1)
			console.log('[DEBUG] choosed image urls after remove: ', this.choosedImageURLs)
		},

		pickImageComplete(e) {
			if (e.status != 1) { return }
			console.log('[DEBUG] pick image event: ', e)
			console.log('[DEBUG] choosed image urls: ', this.choosedImageURLs)
			for (let i = 0; i < e.imgArr.length; i++) {
				if (this.choosedImageURLs.indexOf(e.imgArr[i]) != -1) { continue; }
				this.choosedImageURLs.push(e.imgArr[i])
			}
		},

		async confirmBtnOnClick() {
			if (!this.checkFormData()) { return }

			uni.showLoading({
				title: '发布中',
			});

			var imageURLs = ""
			if (this.choosedImageURLs.length > 0) {
				imageURLs = await this.uploadImages()
				console.log('uploaded image urls: ', imageURLs)
			}

			const resp = await api.postArticle(this.articleContent, imageURLs)
			if (resp.code != api.SUCCESS_CODE) { return; }

			uni.showToast({
				title: '',
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
			if (this.articleContent == "") {
				uni.$u.toast("说点什么吧?")
				return false
			}
			return true
		},

		isLocalImage(imageURL) {
			return (imageURL.indexOf("https://") == -1)
		},

		async uploadImages() {
			var imageURLs = ""
			var choosedImageURLs = this.choosedImageURLs
			for (var i = 0; i < choosedImageURLs.length; i++) {
				let imageURL = choosedImageURLs[i]
				if (!this.isLocalImage(imageURL)) {
					imageURLs += "," + imageURL
					continue
				}
				var resp = await api.uploadImage(0, imageURL)
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

.bottom-btn {
	position: fixed;
	bottom: 100rpx;
	width: 85%;
	margin-left: 50rpx;
	margin-right: 50rpx;
}

.price {
	font-size: 80rpx
}

.input-textarea {
	height: 200rpx;
	font-size: 28rpx;
	padding: 20rpx 30rpx;
	border-radius: 10rpx;
	width: calc(100% - 60rpx);
	background-color: #F9F9F9;
}
</style>
