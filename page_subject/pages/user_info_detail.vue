<template>
	<view v-if="userInfo != null">
		<view class="header">
			<view class="uesr">
				<image class="bg-img" src="/page_subject/static/userinfo_background.png"></image>
				<view class="flex-row top-xh" style="justify-content: space-between;">
					<view class="h2">
						个人主页
					</view>
					<view class="top-button-row" v-if="!isOwner">
						<view style="width: 90rpx; height: 12rpx;">
							<u-button type="primary" shape="circle" size="small" :plain="true" text="举报"
								@click="reportOffenseOnClick(userInfo.id)" color="#ff6633" />
						</view>
						<view style="margin-left: 20rpx; padding-left: 20rpx;">
							<!-- <image src="/page_subject/static/msg.png" style="width: 40rpx;margin-left: 10rpx;"
								mode="widthFix" @click="sendMessageBtnOnClick(userInfo.id)"></image> -->
							<u-icon name="chat" size="30" color="#2979ff" @click="sendMessageBtnOnClick(userInfo.id)" />
						</view>
					</view>
				</view>
				<view class="fot-xh">
					<view class="pic">
						<image :src="userInfo.avatar_url" style="width: 130rpx;" mode="widthFix" />
					</view>
					<view class="txt">
						<view class="name">
							<view class=".flex-row">
								<view class="h3">
									{{ userInfo.nickname }}
								</view>
								<u-icon v-if="userInfo.gender == 'MALE'" name="man" size="18" color="#0099FF" />
								<u-icon v-else name="woman" size="18" color="#FF66CC" />
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

		<view class="left-right-margin centerAlign" style="margin-bottom: 20rpx;">
			<v-tabs fontSize="22rpx" v-model="currTabIndex" :tabs="tabNameList" @change="tabOnChange" />
		</view>

		<view v-if="currTabIndex == ARTICLE_TAB_INDEX">
			<view v-for="(article) in articleList" :key="article.id" @tap="articleOnClick(article)">
				<uni-card :title="article.username" :sub-title="generateArticleDesc(article)" extra=" "
					:thumbnail="article.user_avatar" @click="articleOnClick(article)">
					<u--text :lines="4" class="uni-body" :text="article.text" />
					<view v-if="getFirstImage(article.images).length > 0">
						<telPic :imageArr="article.images.split(',')" :lineNum="6" :spacingNumber="5"></telPic>
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
			<view v-for="(goods) in goodsList" :key="goods.id">
				<hm-goods-card :options="goods" @offSaleOnClick="offSaleOnClick" @onSaleOnClick="onSaleOnClick"
					@goodsOnClick="goodsOnClick" />
			</view>
		</view>

		<view v-if="currTabIndex == COMMENT_TAB_INDEX">
			<view v-for="(comment) in commentList" :key="comment.id">
				<div class="box" style="margin-right: 3rpx;">
					<div class="comment" @click="commentOnClick(comment)">
						<u-avatar :src="userInfo.avatar_url" shape="circle" />
						<view class="comment-center-block">
							<view class="flex-row">
								<text style="font-weight: bold;">{{ userInfo.nickname }}</text>
								<text>·{{ generateReadableCommentTime(comment) }}</text>
							</view>
							<text>{{ comment.content }}</text>
						</view>
						<div class="comment-right-block"> <u--text :lines="3" color="#707980"
								:text="comment.article_content" size="10" /> </div>
					</div>
				</div>
			</view>
		</view>

		<view v-if="currTabIndex == LIKE_TAB_INDEX">
			<view v-for="(like) in articleLikeList" :key="like.id">
				<div class="box" style="margin-right: 3rpx;">
					<div class="comment" @click="articleLikeOnClick(like)">
						<u-avatar :src="userInfo.avatar_url" shape="circle" />
						<view class="comment-center-block">
							<view class="flex-row">
								<text style="font-weight: bold;">{{ userInfo.nickname }}</text>
								<text>·{{ generateReadableCommentTime(like) }}</text>
							</view>
							<text>赞了这个帖子</text>
						</view>
						<div class="comment-right-block"> <u--text :lines="3" color="#707980"
								:text="like.article_content" size="10" /> </div>
					</div>
				</div>
			</view>
		</view>
		<view v-if="currTabIndex == LIKE_TAB_INDEX">
			<view v-for="(like) in commentLikeList" :key="like.id">
				<div class="box" style="margin-right: 3rpx;">
					<div class="comment" @click="commentLikeOnClick(like)">
						<u-avatar :src="userInfo.avatar_url" shape="circle" />
						<view class="comment-center-block">
							<view class="flex-row">
								<text style="font-weight: bold;">{{ userInfo.nickname }}</text>
								<text>·{{ generateReadableCommentTime(like) }}</text>
							</view>
							<text>赞了这个评论</text>
						</view>
						<div class="comment-right-block"> <u--text :lines="3" color="#707980"
								:text="like.comment_content" size="10" /> </div>
					</div>
				</div>
			</view>
		</view>

		<view class="loading-text">{{ loadingText }}</view>
		<view>.</view>
	</view>
</template>

<script>

import { utils } from '../../common/common.js';
import { api } from '../../config/api.js';
import HmGoodsCard from '@/components/hm-goods-card/index.vue'
import { telPic } from "@/components/tel-pic/tel-pic.vue"
import store from '@/store/index.js';
import {
	mapState
} from "vuex";

export default {
	components: {
		HmGoodsCard,
		telPic,
	},
	data() {
		return {
			isOwner: false,

			userID: 0,
			userInfo: null,
			ARTICLE_TAB_INDEX: 0,
			GOODS_TAB_INDEX: 1,
			COMMENT_TAB_INDEX: 2,
			LIKE_TAB_INDEX: 3,
			tabNameList: ['Ta的新鲜事', 'Ta的宝贝', 'Ta的评论', 'Ta的点赞'],
			currTabIndex: 0,

			MAX_LOAD_ARTICLE_LEN: 100,
			MAX_LOAD_GOODS_LEN: 100,
			currPageIndex: 0,
			PAGE_SIZE: 5,

			articleList: [],
			goodsList: [],
			commentList: [],
			articleLikeList: [],
			commentLikeList: [],

			TEXT_NO_MORE: "hoops 木有更多啦",
			TEXT_LOADING: "正在加载...",
			loadingText: "",
			noMoreGoods: false,
		}
	},
	async onLoad(options) {
		console.debug("user_id: ", options.user_id)
		this.userID = options.user_id
		if (this.userID == store.state.vuex_user.id) {
			for (let i in this.tabNameList) {
				this.tabNameList[i] = this.tabNameList[i].replace("Ta", "我")
			}
			this.isOwner = true
		}
		this.reload()
	},
	onShow() {
	},

	//下拉刷新，需要自己在page.json文件中配置开启页面下拉刷新 "enablePullDownRefresh": true
	onPullDownRefresh() {
		setTimeout(() => {
			this.reload()
			uni.stopPullDownRefresh();
		}, 1000);
	},

	//上拉加载，需要自己在page.json文件中配置"onReachBottomDistance"
	async onReachBottom() {
		console.debug("onReachBottom")
		uni.showToast({
			title: '刷新中..',
			icon: 'loading'
		});
		this.reloadList(this.currTabIndex)
		if (this.noMoreGoods) {
			this.loadingText = this.TEXT_NO_MORE;
			return false;
		} else {
			this.loadingText = this.TEXT_LOADING;
		}
	},

	methods: {
		async reportOffenseOnClick(toUserID) {
			console.debug("reportOffenseOnClick, toUserID: ", + toUserID)
			uni.navigateTo({
				url: '/page_subject/pages/report_offense?to_user_id=' + toUserID
			});
		},

		async articleLikeOnClick(like) {
			console.debug("articleLikeOnClick: ", like)
			uni.showLoading({})
			const resp = await api.getArticle(like.article_id)
			uni.hideLoading()
			if (resp.code != api.SUCCESS_CODE) { return; }

			let article = resp.data
			this.articleOnClick(article)
		},

		async commentLikeOnClick(like) {
			console.debug("commentLikeOnClick: ", like)
			uni.showLoading({})
			const resp = await api.getArticle(like.article_id)
			uni.hideLoading()
			if (resp.code != api.SUCCESS_CODE) { return; }

			let article = resp.data
			article.scrollToCommentID = like.comment_id
			this.articleOnClick(article)
		},

		async commentOnClick(comment) {
			console.debug("commentOnClick: ", comment)
			uni.showLoading({})
			const resp = await api.getArticle(comment.article_id)
			uni.hideLoading()
			if (resp.code != api.SUCCESS_CODE) { return; }

			let article = resp.data
			article.scrollToCommentID = comment.id
			this.articleOnClick(article)
		},

		async reload() {
			this.loadingText = this.TEXT_LOADING
			uni.showLoading({})
			const resp = await api.getUserInfoFromServer({ user_id: this.userID })
			if (resp.code != api.SUCCESS_CODE) { return; }
			uni.hideLoading()
			this.userInfo = resp.data
			this.tabOnChange(this.currTabIndex)
		},

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
				goods_id: goods.id,
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

		generateReadableCommentTime(comment) {
			return utils.timeFormatToNAgo(comment.created_at)
		},

		reloadList(tabIndex) {
			switch (tabIndex) {
				case this.ARTICLE_TAB_INDEX:
					this.reloadUserArticle()
					break;

				case this.GOODS_TAB_INDEX:
					this.reloadUserGoods()
					break;

				case this.COMMENT_TAB_INDEX:
					this.reloadUserArticleComment()
					break;

				case this.LIKE_TAB_INDEX:
					this.reloadUserLike()
					break;


				default:
					break;
			}
		},

		tabOnChange(index) {
			this.currPageIndex = 0
			this.articleList = []
			this.goodsList = []
			this.articleLikeList = []
			this.commentLikeList = []
			this.reloadList(index)
		},

		async reloadUserArticle() {
			uni.showLoading({})
			const resp = await api.getArticleList(0, 0, this.currPageIndex, this.PAGE_SIZE, this.userInfo.id)
			uni.hideLoading()
			if (resp.code != api.SUCCESS_CODE) { return; }
			let fetchedArticleList = resp.data
			console.debug("fetched userArticleList: ", fetchedArticleList)
			if (fetchedArticleList.length < this.PAGE_SIZE) {
				this.loadingText = this.TEXT_NO_MORE
			}
			this.articleList.push(...fetchedArticleList)
			console.debug("userArticleList: ", this.articleList)
			this.currPageIndex++
		},

		setGoodsStatus(goodsID, isOnSale) {
			for (var i in this.goodsList) {
				if (this.goodsList[i].id == goodsID) {
					this.goodsList[i].isOnSale = isOnSale
					break;
				}
			}
		},

		async offSaleOnClick(goodsId) {
			console.debug("offSaleOnClick, goodsID: ", goodsId)
			uni.showLoading({ title: "更新中" })
			const resp = await api.setGoodsStatus(goodsId, "CLOSE")
			if (resp.code != api.SUCCESS_CODE) { return }
			uni.$u.toast("宝贝下架成功")
			this.setGoodsStatus(goodsId, false)
		},

		async onSaleOnClick(goodsId) {
			console.debug("onSaleOnClick, goodsID: ", goodsId)
			uni.showLoading({ title: "更新中" })
			const resp = await api.setGoodsStatus(goodsId, "OPEN")
			if (resp.code != api.SUCCESS_CODE) { return }
			uni.$u.toast("宝贝上架成功")
			this.setGoodsStatus(goodsId, true)
		},

		async reloadUserLike() {
			uni.showLoading({})
			const resp1 = await api.getArticleLikeListByUser(this.userInfo.id, this.currPageIndex, this.PAGE_SIZE)
			uni.hideLoading()
			if (resp1.code != api.SUCCESS_CODE) { return; }

			let articleLikeList = resp1.data
			console.debug("fetched articleLikeList: ", articleLikeList)
			this.articleLikeList.push(...articleLikeList)
			console.debug("articleLikeList: ", this.articleLikeList)

			uni.showLoading({})
			const resp2 = await api.getCommentLikeListByUser(this.userInfo.id, this.currPageIndex, this.PAGE_SIZE)
			uni.hideLoading()
			if (resp2.code != api.SUCCESS_CODE) { return; }

			let commentLikeList = resp2.data
			console.debug("fetched commentLikeList: ", commentLikeList)
			this.commentLikeList.push(...commentLikeList)
			console.debug("commentLikeList: ", this.commentLikeList)

			if (articleLikeList.length < this.PAGE_SIZE && commentLikeList.length < this.PAGE_SIZE) {
				this.loadingText = this.TEXT_NO_MORE
			}
			this.currPageIndex++
		},

		async reloadUserArticleComment() {
			uni.showLoading({})
			const resp = await api.getArticleCommentListByUser(this.userInfo.id, this.currPageIndex, this.PAGE_SIZE)
			uni.hideLoading()
			if (resp.code != api.SUCCESS_CODE) { return; }

			let commentList = resp.data
			if (commentList.length < this.PAGE_SIZE) {
				this.loadingText = this.TEXT_NO_MORE
			}

			console.debug("fetched commentList: ", commentList)
			this.commentList.push(...commentList)
			console.debug("commentList: ", this.commentList)
			this.currPageIndex++
		},

		async reloadUserGoods() {
			uni.showLoading({})
			const resp = await api.getUserGoodsList(this.userInfo.id, this.currPageIndex, this.PAGE_SIZE)
			uni.hideLoading()
			if (resp.code != api.SUCCESS_CODE) { return; }

			const goodsList = resp.data
			if (goodsList.length < this.PAGE_SIZE) {
				this.loadingText = this.TEXT_NO_MORE
			}
			for (var i = 0; i < goodsList.length; i++) {
				let goods = goodsList[i]
				goods.tradeName = "¥" + goods.price
				goods.describe = goods.description
				goods.commodity = goods.status == 'OPEN' ? '售卖中' : '已售出'
				goods.pic = this.getFirstImage(goods.images)
				goods.isOnSale = goods.status == 'OPEN' ? true : false
				goods.isOwner = (goods.user_id == this.$store.state.vuex_user.id) ? true : false;
				goodsList[i] = goods
			}

			console.debug("fetched fetchedGoodsList: ", goodsList)
			this.goodsList.push(...goodsList)
			console.debug("userGoodsList: ", this.goodsList)
			this.currPageIndex++
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

.flex-row {
	display: flex;
	justify-content: left;
}

.gender-icon {
	width: 35rpx;
	height: 35rpx;
}

.box {
	width: 98%;
	height: 200rpx;
	display: flex;
	justify-content: space-between;

	align-items: flex-start;
	margin-left: 15rpx;
	margin-right: 15rpx;
	border-radius: 38.96rpx;
	box-shadow: 0px 10px 30px rgba(209, 213, 223, 0.5);
	background-color: #ffffff;
}

.comment-center-block {
	display: flex;
	align-items: flex-start;
	flex-direction: column;
	width: 450rpx;
	height: 180rpx;
	padding: 0;

	color: #141821;
	font-family: MicrosoftYaHei, Microsoft YaHei;
	font-size: 26rpx;
	font-weight: normal;
}

.comment-right-block {
	width: 150rpx;
	height: 100%;
}

.comment {
	display: flex;
	position: relative;
	align-items: flex-start;
	flex-direction: row;
	margin-top: 62.34rpx;
	margin-left: 30rpx;
	margin-right: 30rpx;
	height: 194.81rpx;
	justify-content: space-between;
}

.top-button-row {
	float: right;
	display: flex;
	justify-content: right;
	width: 200rpx;
	padding-right: 2rpx;
}
</style>
