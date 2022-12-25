<template>
    <view>
        <view class="back-top-box">
            <u-back-top :scroll-top="scrollTop"></u-back-top>
        </view>


        <view v-for="(post) in posts" :key="post.id" @tap="toPostDetail(post)">
            <uni-card :title="post.username" :sub-title="generatePostDesc(post)" extra=" " :thumbnail="post.user_avatar"
                @click="toPostDetail(post)">
                <text class="uni-body">这是一个带头像和双标题的基础卡片，此示例展示了一个完整的卡片。</text>
                <image style="width: 100%;" :src="getFirstImage(post.images)"></image>
                <view slot="actions" class="card-actions">
                    <view class="card-actions-item" @click="actionsClick('分享')">
                        <uni-icons type="redo" size="18" color="#999"></uni-icons>
                        <text class="card-actions-item-text">分享</text>
                    </view>
                    <view class="card-actions-item" @click="actionsClick('点赞')">
                        <uni-icons type="heart" size="18" color="#999"></uni-icons>
                        <text class="card-actions-item-text">点赞</text>
                    </view>
                    <view class="card-actions-item" @click="actionsClick('评论')">
                        <uni-icons type="chatbubble" size="18" color="#999"></uni-icons>
                        <text class="card-actions-item-text">评论</text>
                    </view>
                </view>
            </uni-card>
        </view>
        <view class="loading-text">{{ loadingText }}</view>


        <uni-fab ref="fab" horizontal="right" vertical="bottom" @fabClick="createGoodsBtnOnClick" />
    </view>
</template>

<script>

import { api } from '@/config/api.js';
import { utils } from '@/common/common.js';

export default {

    data() {
        return {
            scrollTop: 0,

            posts: [
                {
                    id: 123,
                    username: "ahahah",
                    user_avatar: "https://ddp-freepig.oss-cn-beijing.aliyuncs.com/images/user-9-goods-1665913708184745118-1665913732809121787.jpeg",
                    text: "哈哈哈哈哈",
                    num: '10',
                    commentNum: '67',
                    stateimg: "https://ddp-freepig.oss-cn-beijing.aliyuncs.com/images/user-9-goods-1665913708184745118-1665913732809121787.jpeg",
                },
                {
                    id: 123,
                    username: "ahahah",
                    user_avatar: "https://ddp-freepig.oss-cn-beijing.aliyuncs.com/images/user-9-goods-1665913708184745118-1665913732809121787.jpeg",
                    text: "哈哈哈哈哈",
                    num: '10',
                    commentNum: '67',
                    stateimg: "https://ddp-freepig.oss-cn-beijing.aliyuncs.com/images/user-9-goods-1665913708184745118-1665913732809121787.jpeg",
                },
                {
                    id: 123,
                    username: "ahahah",
                    user_avatar: "https://ddp-freepig.oss-cn-beijing.aliyuncs.com/images/user-9-goods-1665913708184745118-1665913732809121787.jpeg",
                    text: "哈哈哈哈哈",
                    num: '10',
                    commentNum: '67',
                    stateimg: "https://ddp-freepig.oss-cn-beijing.aliyuncs.com/images/user-9-goods-1665913708184745118-1665913732809121787.jpeg",
                },
            ],

            goodsParam: {
                currPageIndex: 0,
                currPageSize: 50,
                keyword: "",
                tagID: 0,
            },
            loadingText: "正在加载...",
            noMoreGoods: false,

        }
    },

    onPageScroll(e) {
        this.scrollTop = e.scrollTop;
    },

    onLoad(option) {
        if (option["recommend-code"] && option["recommend-code"] != "") {
            getApp().globalData.recommendCode = option["recommend-code"]
        }
        this.reload()
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

    onShareAppMessage(res) {
        if (res.from === 'button') {// 来自页面内分享按钮
            console.log('share from button', res.target)
        }
        return {
            title: '兜兜小集市',
            path: '/pages/index/index',
            imageUrl: '/page_subject/static/logo.png',
        }
    },

    methods: {
        toPostDetail(post) {
            uni.navigateTo({
                url: '/page_subject/pages/news_detail'
            });
        },

        generatePostDesc(post) {
            return "1小时前·北京大学"
        },

        getFirstImage(imageURLs) {
            if (!imageURLs) { return ""; }
            const tokens = imageURLs.split(',');
            if (tokens.length == 0) { return "" }
            return tokens[0]
        },

        async reload() {

            this.resetGoodsParam()
            this.clearGoodsList()
            // refresh list

            if (this.$store.state.vuex_user.role != "STUDENT") {
                uni.$u.toast("认证后可查看更多哦")
            }

            console.log('[DEBUG] goods list: ', this.goodsList)
            console.log('[DEBUG] page index loaded')
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

    }
}
</script>


<style lang="scss">


</style>