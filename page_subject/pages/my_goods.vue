<template>
	<view>
		<view class="order-list">
			<view class="list">
				<view class="row" v-for="(row,index) in myGoodsList" :key="index">

					<view class="order-info">
						<view class="left">
							<image :src="getGoodsFirstImage(row.images)"></image>
						</view>
						<view class="right">
							<view class="name">
								{{row.description}}
							</view>
							<view class="price-number">
								￥<view class="price">{{row.price}}</view>
							</view>
						</view>
					</view>

					<view class="btns">
						<block>
							<view v-if="row.status=='OPEN'" class="default"
								@tap="updateGoodsStatusBtnOnClick(row, 'CLOSE')">下架
							</view>
							<view v-if="row.status=='CLOSE'" class="pay"
								@tap="updateGoodsStatusBtnOnClick(row, 'OPEN')">上架</view>
						</block>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>

import { api } from '../../config/api.js';
import { utils } from '../../common/common.js';

export default {
	data() {
		return {
			myGoodsList: [
				{
					"id": 1997,
					"user_id": 1,
					"title": "iPhone6s plus  64GB  金色",
					"description": "iphone6s plus，64g，金色，指纹用不了了，使用痕迹如图，送一个h2work的手机壳，当时手机壳花了300多港币，屏幕一直贴的钢化膜，揭掉膜屏幕无伤无痕，拍后发前可拍照片，售出后不退不换 ",
					"price": 380,
					"cost": 5000,
					"status": "OPEN",
					"tag_id": 0,
					"images": "https://127.0.0.1:8080/api/v1/static/image/316,https://127.0.0.1:8080/api/v1/static/image/317"
				},
				{
					"id": 1998,
					"user_id": 1,
					"title": "iPhone6s plus  64GB  金色",
					"description": "iphone6s plus，64g，金色，指纹用不了了，使用痕迹如图，送一个h2work的手机壳，当时手机壳花了300多港币，屏幕一直贴的钢化膜，揭掉膜屏幕无伤无痕，拍后发前可拍照片，售出后不退不换 ",
					"price": 380,
					"cost": 5000,
					"status": "OPEN",
					"tag_id": 0,
					"images": "https://127.0.0.1:8080/api/v1/static/image/316,https://127.0.0.1:8080/api/v1/static/image/317"
				},
				{
					"id": 1999,
					"user_id": 1,
					"title": "iPhone6s plus  64GB  金色",
					"description": "iphone6s plus，64g，金色，指纹用不了了，使用痕迹如图，送一个h2work的手机壳，当时手机壳花了300多港币，屏幕一直贴的钢化膜，揭掉膜屏幕无伤无痕，拍后发前可拍照片，售出后不退不换 ",
					"price": 380,
					"cost": 5000,
					"status": "CLOSE",
					"tag_id": 0,
					"images": "https://127.0.0.1:8080/api/v1/static/image/316,https://127.0.0.1:8080/api/v1/static/image/317"
				},
			],
		}
	},

	onLoad(option) {
		this.refreshMyGoodsList()
	},

	methods: {
		getGoodsFirstImage(imageURLs) {
			const tokens = imageURLs.split(',');
			if (tokens.length == 0) { return "" }
			return tokens[1]
		},

		async updateGoodsStatusBtnOnClick(goods, newStatus) {
			uni.showToast({
				title: '更新中',
				icon: 'loading',
				duration: 2000
			});

			const resp = await api.setGoodsStatus(goods.id, newStatus)
			if (resp.code != api.SUCCESS_CODE) { return }
			uni.showToast({
				title: 'OK',
				icon: 'success',
				duration: 1000
			});
			this.refreshMyGoodsList()
		},

		async refreshMyGoodsList() {
			const resp = await api.getMyGoodsList()
			if (resp.code != api.SUCCESS_CODE) { return }
			this.myGoodsList = resp.data
		},
	}
}
</script>

<style lang="scss">
page {
	background-color: #f3f3f3;
}

.topTabBar {
	width: 100%;
	position: fixed;
	top: 0;
	z-index: 10;
	background-color: #f8f8f8;
	height: 80upx;
	display: flex;
	justify-content: space-around;

	.grid {
		width: 20%;
		height: 80upx;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #444;
		font-size: 28upx;

		.text {
			height: 76upx;
			display: flex;
			align-items: center;

			&.on {
				color: #f06c7a;
				border-bottom: solid 4upx #f06c7a;
			}
		}

	}
}

.order-list {
	margin-top: 10upx;
	padding-top: 20upx;
	width: 100%;

	.list {
		width: 94%;
		margin: 0 auto;

		.onorder {
			width: 100%;
			height: 50vw;
			display: flex;
			justify-content: center;
			align-content: center;
			flex-wrap: wrap;

			image {
				width: 20vw;
				height: 20vw;
				border-radius: 100%;
			}

			.text {
				width: 100%;
				height: 60upx;
				font-size: 28upx;
				color: #444;
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}

		.row {
			width: calc(100% - 40upx);
			padding: 10upx 20upx;
			border-radius: 10upx;
			background-color: #fff;
			margin-bottom: 20upx;

			.type {
				font-size: 26upx;
				color: #ec652f;
				height: 50upx;
				display: flex;
				align-items: center;
			}

			.order-info {
				width: 100%;
				display: flex;

				.left {
					flex-shrink: 0;
					width: 25vw;
					height: 25vw;

					image {
						width: 25vw;
						height: 25vw;
						border-radius: 10upx;
					}
				}

				.right {
					width: 100%;
					margin-left: 10upx;
					position: relative;

					.name {
						width: 100%;
						font-size: 28upx;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						overflow: hidden;
					}

					.spec {
						color: #a7a7a7;
						font-size: 22upx;

					}

					.price-number {
						position: absolute;
						bottom: 0;
						width: 100%;
						display: flex;
						justify-content: flex-end;
						font-size: 22upx;
						color: #333;
						display: flex;
						align-items: flex-end;

						.price {
							font-size: 24upx;
							margin-right: 5upx;
						}

					}
				}
			}

			.detail {
				display: flex;
				justify-content: flex-end;
				align-items: flex-end;
				height: 60upx;
				font-size: 26upx;

				.sum {
					padding: 0 8upx;
					display: flex;
					align-items: flex-end;

					.price {
						font-size: 30upx;
					}
				}

			}

			.btns {
				height: 80upx;
				display: flex;
				align-items: center;
				justify-content: flex-end;

				view {
					min-width: 120upx;
					height: 50upx;
					padding: 0 20upx;
					border-radius: 50upx;
					display: flex;
					justify-content: center;
					align-items: center;
					font-size: 28upx;
					margin-left: 20upx;
				}

				.default {
					border: solid 1upx #ccc;
					color: #666;
				}

				.pay {
					border: solid 1upx #ec652f;
					color: #ec652f;
				}
			}
		}
	}
}
</style>
