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
    components: {
        HmTalkCard,
    },

    data() {
        return {
            scrollTop: 0,

            currTabIndex: 0,
            tabNameList: [],

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

            goodsList: [],
            goodsParam: {
                currPageIndex: 0,
                currPageSize: 50,
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

            this.renderTabNameList()
            this.currTabIndex = 0
            this.resetGoodsParam()
            this.clearGoodsList()
            await this.refreshGoodsList()

            if (this.$store.state.vuex_user.role != "STUDENT") {
                uni.$u.toast("认证后可查看更多哦")
            }

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
            this.currTabIndex = 0
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
                        if (res.authSetting["scope.userLocation"] == undefined || !res.authSetting['scope.userLocation']) {
                            console.log(res)
                            uni.authorize({
                                scope: 'scope.userLocation',
                                success: () => { //1.1 允许授权
                                    console.log('[DEBUG] auth for userLocation ok')
                                    resolve()
                                },
                                fail: () => { //1.2 拒绝授权
                                    console.log('[DEBUG] auth for userLocation is denied')

                                    uni.showModal({
                                        title: '555 没有位置的话没法用哇 求位置权限',
                                        success(res) {
                                            if (res.confirm) {
                                                uni.openSetting({
                                                    success() {
                                                        console.log('[DEBUG] auth for userLocation is ok after denied')
                                                        resolve()
                                                    },
                                                    fail() {
                                                        console.log('二次开启位置权限失败');
                                                    }
                                                });
                                            } else if (res.cancel) {
                                                console.log('连续拒绝位置权限');
                                            }
                                        }
                                    });

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

.loading-text {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60upx;
    color: #979797;
    font-size: 24upx;
}

.goods-list {

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
                border-radius: 0 0 0 0;
            }

            .name {
                width: 92%;
                padding: 5rpx;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                text-align: left;
                overflow: hidden;
                font-size: 30upx;
                text-overflow: ellipsis;
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

.card-actions {
    display: flex;
    align-items: center;
    justify-content: space-around;
    // margin-top: 5rpx;
    // margin-bottom: 5rpx;
}

.card-actions {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    height: 45px;
    border-top: 1px #eee solid;
}
</style>