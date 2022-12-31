<template>
	<view v-if="userInfo != null">
		<view class="header">
			<view class="uesr">
				<image class="bg-img" src="/page_subject/static/userinfo_background.png"></image>
				<view class="top-xh">
					<view class="h2">
						个人主页
					</view>
					<view class="pic">
						<image src="/page_subject/static/msg.png" style="width: 40rpx;" mode="widthFix"
							@click="sendMessageBtnOnClick(userInfo.id)"></image>
					</view>
				</view>
				<view class="fot-xh">
					<view class="pic">
						<image :src="userInfo.avatar_url" style="width: 130rpx;" mode="widthFix" />
					</view>
					<view class="txt">
						<view class="name">
							<view class="h3">
								{{ userInfo.nickname }}
							</view>
							<view class="phone">
								{{ joinUserEnrollYearAndDegree(userInfo) }}
							</view>
							<view class="phone">
								{{ joinUserCampusAndMajor(userInfo) }}
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="left-rigth-margin centerAlign">
			<v-tabs fontSize="22rpx" v-model="currTabIndex" :tabs="tabNameList" @change="tabOnChange" />
		</view>

		<view v-if="currTabIndex == ARTICLE_TAB_INDEX">
			<view v-for="(article) in articleList" :key="article.id" @tap="articleOnClick(article)">
				<uni-card :title="article.username" :sub-title="generateArticleDesc(article)" extra=" "
					:thumbnail="article.user_avatar" @click="articleOnClick(article)">
					<text class="uni-body">{{ article.text }}</text>
					<view v-if="getFirstImage(article.images).length > 0">
						<image style="width: 100%;" :src="getFirstImage(article.images)"></image>
					</view>
					<view slot="actions" class="card-actions">
						<view class="card-actions-item">
							<uni-icons v-if="article.has_like" type="heart" size="18" color="#ff0000"></uni-icons>
							<uni-icons v-else type="heart" size="18" color="#999"></uni-icons>
							<text class="card-actions-item-text">{{ article.like_num }}</text>
						</view>
						<view class="card-actions-item">
							<uni-icons type="chatbubble" size="18" color="#999"></uni-icons>
							<text class="card-actions-item-text">{{ article.comment_num }}</text>
						</view>
					</view>
				</uni-card>
			</view>
		</view>

		<view v-if="currTabIndex == GOODS_TAB_INDEX">
			<view v-for="(goods) in goodsList" :key="goods.id" @tap="goodsOnClick(goods)">
				<hm-goods-card :options="goods"></hm-goods-card>
			</view>
		</view>

	</view>
</template>

<script>

import store from '@/store/index.js';
import { utils } from '../../common/common.js';
import { api } from '../../config/api.js';
import HmGoodsCard from '@/components/hm-goods-card/index.vue'

export default {
	components: {
		HmGoodsCard
	},
	data() {
		return {
			userInfo: null,
			ARTICLE_TAB_INDEX: 0,
			GOODS_TAB_INDEX: 1,
			tabNameList: ['Ta的新鲜事', 'Ta的宝贝'],
			currTabIndex: 0,

			MAX_LOAD_ARTICLE_LEN: 100,
			MAX_LOAD_GOODS_LEN: 100,

			articleList: [],
			goodsList: [],
		}
	},
	async onLoad(options) {
		console.debug("user_id: ", options.user_id)
		uni.showLoading({})
		const resp = await api.getUserInfoFromServer({ user_id: options.user_id })
		if (resp.code != api.SUCCESS_CODE) { return; }
		uni.hideLoading()
		this.userInfo = resp.data
		this.tabOnChange(this.currTabIndex)
	},
	onShow() {
	},

	methods: {
		async sendMessageBtnOnClick(toUserID) {
			console.debug("sendMessageBtnOnClick: ", toUserID)
			uni.showLoading({
				title: '建立会话',
			});
			console.log('[DEBUG] create conversation with user ', toUserID)
			const resp = await api.createConversation(toUserID)
			if (resp.code != api.SUCCESS_CODE) {
				uni.showToast({
					title: '网络好像不太好',
					icon: "fail",
					duration: 1000,
				})
				return
			}
			const conversationID = resp.data.conversation_id
			console.log('[DEBUG] conversation id created: ', conversationID)
			this.$store.commit('createConversationActive', {
				conversationID: conversationID,
				toUserId: toUserID.toString(),
			})
			uni.hideLoading();
			uni.navigateTo({
				url: '/pages/tim/room'
			})
		},

		getFirstImage(imageURLs) {
			if (!imageURLs) { return ""; }
			const tokens = imageURLs.split(',');
			if (tokens.length == 0) { return "" }
			return tokens[0]
		},

		goodsOnClick(goods) {
			console.debug("goodsOnClick: ", goods)
			getApp().globalData.selectedGoodsToShowInDetail = {
				user_avatar_url: this.userInfo.avatar_url,
				user_nickname: this.userInfo.nickname,
				user_id: this.userInfo.id,
				goods_price: goods.price,
				goods_description: goods.description,
				goods_images: goods.images,
				campus: this.userInfo.campus,
				major: this.userInfo.major,
			}
			uni.navigateTo({
				url: '/page_subject/pages/goods_detail'
			});
		},

		articleOnClick(article) {
			let articleJSON = JSON.stringify(article);
			uni.navigateTo({
				url: '/page_subject/pages/article_detail?article=' + articleJSON
			});
		},

		generateArticleDesc(article) {
			return utils.timeFormatToNAgo(article.created_at)
		},

		tabOnChange(index) {
			switch (index) {
				case this.ARTICLE_TAB_INDEX:
					this.reloadUserArticle()
					break;
				case this.GOODS_TAB_INDEX:
					this.reloadUserGoods()
					break;
				default:
					break;
			}
		},

		async reloadUserArticle() {
			uni.showLoading({})
			const resp = await api.getArticleList(0, 0, 0, this.MAX_LOAD_ARTICLE_LEN, this.userInfo.id)
			uni.hideLoading()
			if (resp.code != api.SUCCESS_CODE) { return; }
			this.articleList = resp.data
			console.debug("userArticleList: ", this.articleList)
		},

		async reloadUserGoods() {
			uni.showLoading({})
			const resp = await api.getUserGoodsList(this.userInfo.id)
			uni.hideLoading()
			if (resp.code != api.SUCCESS_CODE) { return; }
			this.goodsList = resp.data
			console.debug("userGoodsList: ", this.goodsList)

			const goodsList = resp.data
			for (var i = 0; i < goodsList.length; i++) {
				let goods = goodsList[i]
				goods.tradeName = "¥" + goods.price
				goods.describe = goods.description
				goods.commodity = goods.status == 'OPEN' ? '售卖中' : '已售出'
				goods.pic = this.getFirstImage(goods.images)
				goodsList[i] = goods
			}
			this.goodsList = goodsList
		},

		joinUserEnrollYearAndDegree(userInfo) {
			return userInfo.kickoff_year + "级" + userInfo.degree
		},
		joinUserCampusAndMajor(userInfo) {
			return userInfo.campus + "·" + userInfo.major
		},

		generateGenderStr(gender) {
			if (gender.toUpperCase() == "MALE") {
				return "靓仔"
			}
			return "靓女"
		},

		joinCampusAndMajorInfo(id, campusName, majorName) {
			if (id <= 100) { return "-" }
			return campusName + " | " + majorName
		},
	}
}
</script>

<style lang="scss">
.wrap {
	padding: 12px;
}

.demo-layout {
	height: 25px;
	border-radius: 4px;
}

.bg-blue {
	background: #2979ff;
}

.grid-item-box {
	flex: 1;
	// position: relative;
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 15px 0;
	font-size: 30rpx;
}

.bottom-notice-bar {
	position: fixed;
	// bottom: 3rpx;
	// left: 50%;
	top: 50%;
}

.user-description {
	color: #979797;
	font-size: 24upx;
}


.top-xh {
	padding-top: 40rpx;
	overflow: hidden;
	margin-bottom: 60rpx;

}

.top-xh .h2 {
	float: left;
	font-size: 32rpx;
	font-weight: bold;
}

.top-xh .pic {
	float: right;
}

.uesr {
	overflow: hidden;
	padding: 0 30rpx;
	// background: url(/page_subject/static/userinfo_background.png) no-repeat 0 center;

	height: 345rpx;
}

.fot-xh .pic {
	float: left;
	margin-right: 30rpx;
}

.fot-xh .txt {
	padding: 20rpx 0;
	overflow: hidden;
}

.fot-xh .txt .name {
	position: relative;
	display: block;
}

.fot-xh .txt .name .h3 {
	font-size: 24rpx;
	margin-bottom: 5rpx;
	font-weight: bold;
}

.fot-xh .txt .name .phone {
	height: 40rpx;
	line-height: 40rpx;
	font-size: 20rpx;
	width: 330rpx;
	// background: url(/page_subject/static/userinfo_background.png) no-repeat right center;
	background-size: 100rpx;
	color: rgb(68, 68, 68);
}

.fot-xh .name::after {
	content: '';
	position: absolute;
	border-top: 4rpx solid rgb(179, 179, 179);
	border-left: 4rpx solid rgb(179, 179, 179);
	width: 14rpx;
	height: 14rpx;
	right: 5rpx;
	top: 30%;
	transform: rotate(135deg);
}

.m-a1 {
	overflow: hidden;
	padding: 20rpx;
	background-color: #fff;
	margin: 0 60rpx;
	box-shadow: 0rpx 5rpx 16rpx 0rpx rgb(226, 236, 255);
	margin-top: -40rpx;
	border-radius: 40rpx;

}

.m-a1 .txt {
	overflow: hidden;
}

.m-a1 .pic {
	float: left;
	margin-right: 20rpx;
}

.m-a1 text {
	display: block;
	font-size: 24rpx;
	color: rgb(179, 179, 179);
}

.m-a1 .txt .s1 {
	font-size: 24rpx;
	margin-bottom: 10rpx;
	color: rgb(0, 0, 0);
	font-weight: bold;
}

.ul-list1-xh {
	overflow: hidden;
	padding: 0 30rpx;
	padding-top: 30rpx;
	padding-bottom: 300rpx;
}

.ul-list1-xh .li {
	padding: 20rpx 0;
	overflow: hidden;
	position: relative;

}

.ul-list1-xh .li .pic {
	float: left;
	margin-right: 20rpx;

}

.ul-list1-xh .li .txt {
	overflow: hidden;
	font-size: 24rpx;
	padding-bottom: 20rpx;
	border-bottom: 1px solid rgb(242, 242, 242);
}

.ul-list1-xh .li::after {
	content: '';
	position: absolute;
	border-top: 3rpx solid rgb(179, 179, 179);
	border-left: 3rpx solid rgb(179, 179, 179);
	width: 12rpx;
	height: 12rpx;
	right: 5rpx;
	top: 30%;
	transform: rotate(135deg);
}

.bg-img {
	position: fixed;
	width: 100%;
	height: 695rpx;
	top: 0;
	left: 0;
	z-index: -1;
}
</style>
