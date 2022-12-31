<template>
	<view v-if="userInfo != null">
		<uni-card :title="userInfo.nickname" :sub-title="joinUserEnrollYearAndDegree(userInfo)"
			:extra="generateGenderStr(userInfo.gender)" :thumbnail="userInfo.avatar_url">
			<text class="user-description">{{ joinUserCampusAndMajor(userInfo) }}</text>
		</uni-card>

		<v-tabs class="left-rigth-margin centerAlign" fontSize="18rpx" v-model="currTabIndex" :tabs="tabNameList"
			@change="tabOnChange">
		</v-tabs>

		<view v-if="currTabIndex == ARTICLE_TAB_INDEX">
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
	data() {
		return {
			userInfo: null,
			ARTICLE_TAB_INDEX: 0,
			GOODS_TAB_INDEX: 1,
			tabNameList: ['TA的新鲜事', 'TA的宝贝'],
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
