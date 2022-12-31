<template>
	<view v-if="userInfo != null">
		<uni-card :title="userInfo.nickname" :sub-title="joinUserEnrollYearAndDegree(userInfo)"
			:extra="generateGenderStr(userInfo.gender)" :thumbnail="userInfo.avatar_url">
			<text class="user-description">{{ joinUserCampusAndMajor(userInfo) }}</text>
		</uni-card>

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
		</view>

	</view>
</template>

<script>

import store from '@/store/index.js';
import { utils } from '../../common/common.js';
import { api } from '../../config/api.js';

export default {
	components: {
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
		getFirstImage(imageURLs) {
			if (!imageURLs) { return ""; }
			const tokens = imageURLs.split(',');
			if (tokens.length == 0) { return "" }
			return tokens[0]
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
</style>
