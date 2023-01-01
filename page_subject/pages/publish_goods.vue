<template>
	<view>
		<view class="centerAlign left-rigth-margin" style="margin-top: 30rpx;">
			<textarea class="textarea" v-model="goodsDesc" :placeholder="goodsDescPlaceHolder" inputBorder="false" />
		</view>

		<view class="left-rigth-margin" style="margin-top: 30rpx;">
			<tui-upload :value="choosedImageURLs" limit="6" @complete="pickImageComplete" @remove="removeImage"
				sizeType="['compressed']" imageFormat="['jpg','png']" size="9" width="180" height="180">
			</tui-upload>
		</view>

		<view class="centerAlign left-rigth-margin">
			<v-tabs fontSize="35rpx" v-model="currTagIndex" :tabs="tabNameList" @change="tabOnChange">
			</v-tabs>

			<u--form labelPosition="left" class="price">
				<u-form-item leftIcon="rmb-circle-fill" label="价格" labelWidth="140">
					<u--input type="digit" v-model="price" placeholder="0.00" inputAlign="right" border="none"
						@change="priceInputChange" />
				</u-form-item>
			</u--form>

			<view class="bottom-btn">
				<u-button shape="circle" type="primary" text="发布" size="normal" @click="confirmBtnOnClick" />
			</view>
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

			currTagIndex: -1,
			tabNameList: [],

			goodsDesc: "",
			goodsDescPlaceHolder: "在这里描述下宝贝的转手原因、入手渠道、规格以及新旧程度和使用感受吧, 会有助于更快的转手喔~ ^o^",
			choosedImageURLs: [],
			tagList: [],
			selectedTagID: -1,
			price: "",
			goodsID: "",
			MAX_IMAGE_SIZE_BYTE: (20 << 20),
		}
	},
	methods: {
		async onLoad(options) {
			// get tag list from server
			await this.renderTabNameList()

			// TODO: 如果传进来一个goods对象，就是updateGoodsMode
			if (options.goods) {
				this.isModifyGoodsMode = true;
				let goodsToModify = JSON.parse(options.goods);
				console.log('[DEBUG] modify goods: ', goodsToModify)

				this.goodsDesc = goodsToModify.description
				this.goodsID = goodsToModify.id
				this.choosedImageURLs = goodsToModify.images.split(',');
				this.price = goodsToModify.price
				this.selectedTagID = goodsToModify.tag_id
				this.currTagIndex = this.getTagIndexByTagID(this.selectedTagID)
			} else {
				this.isModifyGoodsMode = false;
				console.log('[DEBUG] publish goods')

				// get uuid from server and set it as goods_id
				var resp = await api.getUUID()
				this.goodsID = resp.data
				console.log("[DEBUG] goodsID: ", this.goodsID)
			}

		},
		tabOnChange(index) {
			this.selectedTagID = this.getTagIDByTabIndex(index)
			console.log('[DEBUG] select tag_id: ', this.selectedTagID)
		},

		getTagIDByTabIndex(tabIndex) {
			return this.tagList[tabIndex].id
		},

		getTagIndexByTagID(tagID) {
			for (let i = 0; i < this.tagList.length; i++) {
				if (this.tagList[i].id == tagID) { return i; }
			}
			return -1;
		},

		priceInputChange(e) {
			this.$nextTick(() => {
				let val = e.toString();
				if (val == "0") { this.price = ""; return; }
				val = val.replace(/[^\d.]/g, ""); //清除"数字"和"."以外的字符
				val = val.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
				val = val.replace(/^0+\./g, '0.');
				val = val.match(/^0+[1-9]+/) ? val = val.replace(/^0+/g, '') : val
				val = (val.match(/^\d*(\.?\d{0,2})/g)[0]) || ''

				if (val.includes(".")) {
					let numDian = val.toString().split(".")[1].length;
					if (numDian === 2) {
						this.price = val.length;
					}
				} else {
					// this.moneyMaxLeng = 8;
				}
				this.price = val;
			});
		},

		async renderTabNameList() {
			var resp = await api.getTagList()
			if (resp.code != api.SUCCESS_CODE) { return false }

			var tabNameList = []
			for (var i = 0; i < resp.data.length; i++) {
				var tag = resp.data[i]
				if (tag.id == 0) { continue }
				tabNameList.push(tag.name)
				this.tagList.push(tag)
			}
			this.tabNameList = tabNameList

			return true
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

			var imageURLs = await this.uploadImages()
			console.log('uploaded image urls: ', imageURLs)
			if (imageURLs == "") { return }

			let goodsApi = api.publishGoods
			if (this.isModifyGoodsMode) { goodsApi = api.updateGoods; }
			var resp = await goodsApi(this.goodsID, this.goodsDesc, this.selectedTagID, this.price, imageURLs)
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
			if (this.selectedTagID < 0) {
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
				var resp = await api.uploadImage(this.goodsID, imageURL)
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

.textarea {
	height: 200rpx;
	font-size: 28rpx;
	padding: 20rpx 30rpx;
	border-radius: 10rpx;
	width: calc(100% - 60rpx);
	background-color: #F9F9F9;
}

.price {
	font-size: 80rpx
}

/* .margin-left-right-side {
	margin-left: 10px;
	margin-right: 10px;
} */
</style>
