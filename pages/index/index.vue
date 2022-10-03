<template>
	<view>
		<v-tabs pills="true" activeColor="#fff" fontSize="40rpx" v-model="currTabIndex" :tabs="tabNameList" @change="tabOnChange"></v-tabs>
		<u-divider text="为你推荐"></u-divider>

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
		}
	},

	onLoad() {
		this.renderTabNameList()
	},

	methods: {
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

		modifyVuex() {
			this.$u.vuex('vuex_version', '1.0.1');
			// 修改对象的形式，中间用"."分隔
			this.$u.vuex('vuex_user.name', '诗圣');
		},

		tabOnChange(index) {
			console.log('[DEBUG] selected tag id: ' + this.getTagIDByTabIndex(index))
		},

		createGoodsBtnOnClick() {
			console.log('createGoodsBtnOnClick')
			uni.navigateTo({ url: '../../page_subject/pages/publish_goods' })
		}
	}
}
</script>

<style>
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
</style>
