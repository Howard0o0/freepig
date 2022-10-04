<template>
	<view>
		<!-- 商品标签 -->
		<v-tabs pills="true" activeColor="#fff" fontSize="40rpx" v-model="currTabIndex" :tabs="tabNameList"
			@change="tabOnChange"></v-tabs>

		<!-- 商品列表 -->
		<view class="goods-list">
			<view class="product-list">
				<view class="product" v-for="(goods) in goodsList" :key="goods.goods_id" @tap="toGoods(goods)">
					<image mode="widthFix" :src="getGoodsFirstImage(goods.goods_images)"></image>
					<view class="name">{{goods.goods_description}}</view>
					<view class="info">
						<view class="price">{{goods.goods_price}}</view>
						<!-- <u-icon :name="goods.user_gender == 'MALE' ? man : woman" size="28"></u-icon> -->
						<u-icon :name="toGenderIconStr(goods.user_gender)" size="20" color="#2979ff"></u-icon>
					</view>
				</view>
			</view>
			<view class="loading-text">{{loadingText}}</view>
		</view>


		<uni-fab ref="fab" horizontal="right" vertical="bottom" @fabClick="createGoodsBtnOnClick" />
	</view>
</template>

<script>

import { api } from '../../config/api.js';
import { utils } from '../../common/common.js';

export default {
	data() {
		return {
			currTabIndex: 0,
			tabNameList: ['军事', '国内', '新闻', '军事', '国内', '新闻', '军事', '国内', '新闻'],
			tagList: [],

			goodsList: [
				// { goods_id: 0, img: '/static/choose_image.png', name: '商品名称商品名称商品名称商品名称商品名称', price: '￥168', slogan: '1235人付款' },
				// { goods_id: 1, img: '/static/choose_image.png', name: '商品名称商品名称商品名称商品名称商品名称', price: '￥168', slogan: '1235人付款' },
				// { goods_id: 2, img: '/static/choose_image.png', name: '商品名称商品名称商品名称商品名称商品名称', price: '￥168', slogan: '1235人付款' },
				// { goods_id: 3, img: '/static/choose_image.png', name: '商品名称商品名称商品名称商品名称商品名称', price: '￥168', slogan: '1235人付款' },
				// { goods_id: 4, img: '/static/choose_image.png', name: '商品名称商品名称商品名称商品名称商品名称', price: '￥168', slogan: '1235人付款' },
				// { goods_id: 5, img: '/static/choose_image.png', name: '商品名称商品名称商品名称商品名称商品名称', price: '￥168', slogan: '1235人付款' },
				// { goods_id: 6, img: '/static/choose_image.png', name: '商品名称商品名称商品名称商品名称商品名称', price: '￥168', slogan: '1235人付款' },
				// { goods_id: 7, img: '/static/choose_image.png', name: '商品名称商品名称商品名称商品名称商品名称', price: '￥168', slogan: '1235人付款' },
				// { goods_id: 8, img: '/static/choose_image.png', name: '商品名称商品名称商品名称商品名称商品名称', price: '￥168', slogan: '1235人付款' },
				// { goods_id: 9, img: '/static/choose_image.png', name: '商品名称商品名称商品名称商品名称商品名称', price: '￥168', slogan: '1235人付款' }
			],
			goodsParam: {
				currPageIndex: 0,
				currPageSize: 30,
				keyword: "",
				tagID: 0,
			},
			loadingText: "正在加载...",

			currLocation: {
				longitude: 0,
				latitude: 0,
			}
		}
	},

	async onLoad() {
		await this.getCurrentCoordinate()
		this.renderTabNameList()

		this.resetGoodsParam()
		this.clearGoodsList()
		await this.refreshGoodsList()

		console.log('[DEBUG] goods list: ', this.goodsList)
		console.log('[DEBUG] page index loaded')
	},

	//下拉刷新，需要自己在page.json文件中配置开启页面下拉刷新 "enablePullDownRefresh": true
	onPullDownRefresh() {
		setTimeout(() => {
			this.reload();
			uni.stopPullDownRefresh();
		}, 1000);
	},
	//上拉加载，需要自己在page.json文件中配置"onReachBottomDistance"
	onReachBottom() {
		uni.showToast({ title: '触发上拉加载' });
		let len = this.goodsList.length;
		if (len >= 40) {
			this.loadingText = "到底了";
			return false;
		} else {
			this.loadingText = "正在加载...";
		}
		// TODO: append some goods into goodsList
		// let end_goods_id = this.goodsList[len - 1].goods_id;
		// for (let i = 1; i <= 10; i++) {
		// 	let goods_id = end_goods_id + i;
		// 	let p = { goods_id: goods_id, img: '/static/img/goods/p' + (goods_id % 10 == 0 ? 10 : goods_id % 10) + '.jpg', name: '商品名称商品名称商品名称商品名称商品名称', price: '￥168', slogan: '1235人付款' };
		// 	this.goodsList.push(p);
		// }
	},

	methods: {

		toGenderIconStr(gender) {
			return gender == 'MALE' ? 'man' : 'woman'
		},

		//商品跳转
		toGoods(e) {
			uni.showToast({ title: '商品' + e.goods_id, icon: "none" });
			// uni.navigateTo({
			// 	url: '../goods'
			// });
		},

		getGoodsFirstImage(imageURLs) {
			const tokens = imageURLs.split(',');
			if (tokens.length == 0) { return "" }
			return tokens[1]
		},

		async renderTabNameList() {
			var resp = await api.getTagList()
			if (resp.code != api.SUCCESS_CODE) { return false }
			this.tagList = resp.data

			var tabNameList = []
			for (var i = 0; i < resp.data.length; i++) {
				var tag = resp.data[i]
				tabNameList.push(tag.name)
			}
			this.tabNameList = tabNameList

			return true
		},

		getTagIDByTabIndex(tabIndex) {
			return this.tagList[tabIndex].id
		},

		tabOnChange(index) {
			this.resetGoodsParam()
			this.goodsParam.tagID = this.getTagIDByTabIndex(index)
			console.log('[DEBUG] selected tag id: ' + this.goodsParam.tagID)
			this.clearGoodsList()
			this.refreshGoodsList()
		},

		clearGoodsList() {
			this.goodsList = []
		},

		resetGoodsParam() {
			this.goodsParam = {
				currPageIndex: 0,
				currPageSize: 30,
				keyword: "",
				tagID: 0,
			}
		},

		createGoodsBtnOnClick() {
			console.log('createGoodsBtnOnClick')
			uni.navigateTo({ url: '../../page_subject/pages/publish_goods' })
		},

		async refreshGoodsList() {
			uni.showToast({ title: '正在加载', duration: 1000 })
			const resp = await api.getGoodsList(this.currLocation.longitude, this.currLocation.latitude, this.goodsParam.tagID, this.goodsParam.keyword, this.goodsParam.currPageIndex, this.goodsParam.currPageSize)
			const goodsList = resp.data
			for (var i in goodsList) {
				const goods = goodsList[i]
				this.goodsList.push(goods)
			}
			this.goodsParam.currPageIndex++
		},

		async getCurrentCoordinate() {
			try {
				await uni.authorize({
					scope: 'scope.userLocation',
				})
			} catch (error) {
				console.log("[ERROR] authorize fail: " + err)
			}

			var res = await this.promiseGetLocation()
			this.currLocation.Longitude = res.longitude
			this.currLocation.Latitude = res.latitude
			console.log('[DEBUG] 当前位置: ' + this.currLocation.Longitude + "," + this.currLocation.Latitude);
		},
		promiseGetLocation: () => {
			return new Promise((resolve, reject) => {
				uni.getLocation({
					type: 'gcj02',
					success: function (res) {
						resolve(res)
					},
					fail: function (err) {
						console.log('[ERROR] get location fail: ', err)
						reject(err)
					}
				});
			})
		}

	}
}
</script>


<style lang="scss">
.content {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.logo {
	height: 200rpx;
	width: 200rpx;
	margin-top: 200rpx;
	margin-left: auto;
	margin-right: auto;
	margin-bottom: 50rpx;
}

.text-area {
	display: flex;
	justify-content: center;
}

.title {
	font-size: 36rpx;
	color: #8f8f94;
}

.icon {
	font-size: 26upx;
}

.header {
	width: 92%;
	padding: 0 4%;
	height: 79upx;
	display: flex;
	justify-content: space-around;
	align-items: flex-end;
	position: fixed;
	top: 0;
	z-index: 10;
	background-color: #fff;
	border-bottom: solid 1upx #eee;

	.target {
		width: 20%;
		height: 60upx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 28upx;
		margin-bottom: -2upx;
		color: #aaa;

		&.on {
			color: #555;
			border-bottom: 4upx solid #f06c7a;
			font-weight: 600;
			font-size: 30upx;
		}


	}
}

.place {

	background-color: #ffffff;
	height: 100upx;

}

.goods-list {
	.loading-text {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 60upx;
		color: #979797;
		font-size: 24upx;
	}

	.product-list {
		width: 92%;
		padding: 0 4% 3vw 4%;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;

		.product {
			width: 48%;
			border-radius: 20upx;
			background-color: #fff;
			margin: 0 0 15upx 0;
			box-shadow: 0upx 5upx 25upx rgba(0, 0, 0, 0.1);

			image {
				width: 100%;
				border-radius: 20upx 20upx 0 0;
			}

			.name {
				width: 92%;
				padding: 10upx 4%;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				text-align: justify;
				overflow: hidden;
				font-size: 30upx;
			}

			.info {
				display: flex;
				justify-content: space-between;
				align-items: flex-end;
				width: 92%;
				padding: 10upx 4% 10upx 4%;

				.price {
					color: #e65339;
					font-size: 30upx;
					font-weight: 600;
				}

				.slogan {
					color: #807c87;
					font-size: 24upx;
				}
			}
		}

	}
}
</style>