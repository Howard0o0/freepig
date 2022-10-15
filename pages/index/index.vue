<template>
	<view>
		<!-- 搜索栏 -->
		<uni-search-bar @confirm="SearchBtnOnClick" v-model="goodsParam.keyword" />

		<!-- 商品标签 -->
		<v-tabs class="left-rigth-margin"  fontSize="35rpx" v-model="currTabIndex"
			:tabs="tabNameList" @change="tabOnChange">
		</v-tabs>

		<!-- 商品列表 -->
		<view class="goods-list">
			<view class="product-list">
				<view class="product" v-for="(goods) in goodsList" :key="goods.goods_id" @tap="toGoods(goods)">
					<image :src="getGoodsFirstImage(goods.goods_images)" mode="aspectFit"></image>
					<view class="name">{{goods.goods_description}}</view>
					<view class="info">
						<view class="price">￥{{goods.goods_price}}</view>
						<u-icon :name="toGenderIconStr(goods.user_gender)" size="20" color="#2979ff"></u-icon>
					</view>
					<view class="campus-info">
						<view class="nickname">{{goods.campus}}</view>
						<view class="nickname">{{goods.major}}</view>
					</view>
					<view class="info">
						<image class="avatar" :src="goods.user_avatar_url" mode="aspectFit"></image>
						<view class="nickname">{{goods.user_nickname}}</view>
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
			tabNameList: [],
			tagList: [],

			goodsList: [],
			goodsParam: {
				currPageIndex: 0,
				currPageSize: 5,
				keyword: "",
				tagID: 0,
			},
			loadingText: "正在加载...",
			noMoreGoods: false,

			currLocation: {
				longitude: 0,
				latitude: 0,
			}
		}
	},

	async onLoad() {
		await this.reload()
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
		uni.showToast({
			title: '刷新中..',
			icon: 'loading'
		});
		await this.refreshGoodsList()
		if (this.noMoreGoods) {
			this.loadingText = "hoops 木有更多啦";
			return false;
		} else {
			this.loadingText = "正在加载...";
		}
	},

	methods: {
		async reload() {
			await this.updateLocation()

			this.renderTabNameList()

			this.resetGoodsParam()
			this.clearGoodsList()
			await this.refreshGoodsList()

			console.log('[DEBUG] goods list: ', this.goodsList)
			console.log('[DEBUG] page index loaded')
		},

		toGenderIconStr(gender) {
			return gender == 'MALE' ? 'man' : 'woman'
		},

		//商品跳转
		toGoods(e) {
			getApp().globalData.selectedGoodsToShowInDetail = e
			uni.navigateTo({
				url: '/page_subject/pages/goods_detail'
			});

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
			this.noMoreGoods = false
			this.goodsParam = {
				currPageIndex: 0,
				currPageSize: this.goodsParam.currPageSize,
				keyword: "",
				tagID: 0,
			}
		},

		createGoodsBtnOnClick() {
			console.log('createGoodsBtnOnClick')
			uni.navigateTo({ url: '/page_subject/pages/publish_goods' })
		},

		async refreshGoodsList() {
			uni.showToast({ title: '加载中...', duration: 1000, icon: 'loading' })
			const resp = await api.getGoodsList(this.currLocation.longitude, this.currLocation.latitude, this.goodsParam.tagID, this.goodsParam.keyword, this.goodsParam.currPageIndex, this.goodsParam.currPageSize)
			const goodsList = resp.data
			if (goodsList == null || goodsList.length == 0) {
				this.noMoreGoods = true
				return
			}
			for (var i in goodsList) {
				const goods = goodsList[i]
				this.goodsList.push(goods)
			}
			this.goodsParam.currPageIndex++
		},

		SearchBtnOnClick(searchInput) {
			console.log('[DEBUG] SearchBtnOnClick')
			this.resetGoodsParam()
			this.clearGoodsList()
			this.goodsParam.keyword = searchInput.value
			this.refreshGoodsList()
		},

		__updateLocation() {
			var that = this
			return new Promise((resolve, reject) => {
				uni.getLocation({
					type: 'gcj02',
					success: function (res) {
						that.currLocation.longitude = res.longitude
						that.currLocation.latitude = res.latitude
						console.log('[DEBUG] 当前位置: ' + that.currLocation.longitude + "," + that.currLocation.latitude);
						resolve(res)
					},
					fail: function (err) {
						console.log('[ERROR] get location fail: ', err)
						uni.showToast({
							title: '获取位置失败 ', err,
							icon: 'none',
							duration: 2000,
						});
						reject(err)
					}
				});
			});
		},

		requestLocationAuth() {
			return new Promise((resolve, reject) => {
				uni.getSetting({
					success: (res) => {
						if (!res.authSetting['scope.userLocation']) {
							console.log(res)
							uni.authorize({
								scope: 'scope.userLocation',
								success: () => { //1.1 允许授权
									console.log('[DEBUG] auth for userLocation ok')
									resolve()
								},
								fail: () => { //1.2 拒绝授权
									console.log('[DEBUG] auth for userLocation is denied')
									reject()
								}
							})
						} else {
							console.log('[DEBUG] already has auth for userLocation')
							resolve()
						}
					},
					fail: () => {
						console.log('[DEBUG] 获取授权信息失败')
					}
				})
			});
		},

		async updateLocation() {
			await this.requestLocationAuth()
			await this.__updateLocation()
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

			.nickname {
				width: 70%;
				height: 50rpx;
				text-align: left;
				overflow: hidden;
				text-overflow: ellipsis; //溢出用省略号显示
				white-space: nowrap; //溢出不换行
				font-size: 30upx;
			}

			.campus-info {
				color: #8f8f94;
				width: 92%;
				padding: 10upx 4% 10upx 4%;
			}

			.avatar {
				width: 50rpx;
				height: 50rpx;
			}

			.info {
				display: flex;
				justify-content: space-between;
				align-items: flex-end;
				width: 92%;
				padding: 10upx 4% 10upx 4%;

				.price {
					color: #e65339;
					font-size: 32upx;
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

.left-rigth-margin {
	margin-left: 4%;
	margin-right: 4%;
}
</style>