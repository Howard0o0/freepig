<template>
    <view>
        <view class="back-top-box">
            <u-back-top :scroll-top="scrollTop"></u-back-top>
        </view>


        <view v-for="(article) in articleList" :key="article.id">
            <uni-card :title="article.username" :sub-title="generatePostDesc(article)" extra=" "
                :thumbnail="article.user_avatar" @click="toUserHomePage(article.user_id)">
                <u--text :lines="4" class="uni-body" @click.stop="articleOnClick(article)" :text="article.text" />
                <view v-if="getFirstImage(article.images).length > 0" @click.stop="articleOnClick(article)">
                    <telPic :imageArr="article.images.split(',')" :lineNum="6" :spacingNumber="5"></telPic>
                </view>
                <view slot="actions" class="card-actions" @click.stop="articleOnClick(article)">
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
        <view class="loading-text">{{ loadingText }}</view>


        <uni-fab ref="fab" horizontal="right" vertical="bottom" @fabClick="createArticleBtnOnClick" />
    </view>
</template>

<script>

import { api } from '@/config/api.js';
import { utils } from '@/common/common.js';
import { telPic } from "@/components/tel-pic/tel-pic.vue"

export default {
    components: {
        telPic
    },
    data() {
        return {
            scrollTop: 0,

            articleList: [],

            formData: {
                currPageIndex: 0,
                currPageSize: 50,
            },
            loadingText: "正在加载...",
            noMoreArticle: false,

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
        await this.refreshArticleList()
        if (this.noMoreArticle) {
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
        createArticleBtnOnClick() {
            uni.navigateTo({
                url: '/page_subject/pages/publish_article'
            });
        },

        articleOnClick(article) {
            let articleJSON = JSON.stringify(article);
            uni.navigateTo({
                url: '/page_subject/pages/article_detail?article=' + articleJSON
            });
        },

        generatePostDesc(article) {
            let timeStr = utils.timeFormatToNAgo(article.created_at)
            return timeStr + "·" + article.user_campus + "·" + article.user_degree
        },

        getFirstImage(imageURLs) {
            if (!imageURLs) { return ""; }
            const tokens = imageURLs.split(',');
            if (tokens.length == 0) { return "" }
            return tokens[0]
        },

        async reload() {
            await this.updateLocation()
            this.resetFormData()
            this.articleList = []
            await this.refreshArticleList()

            if (this.$store.state.vuex_user.role != "STUDENT") {
                uni.$u.toast("认证后可查看更多本校新鲜事～")
            }
        },


        resetFormData() {
            this.noMoreArticle = false
            this.formData = {
                currPageIndex: 0,
                currPageSize: this.formData.currPageSize,
            }
        },

        async refreshArticleList() {
            uni.showLoading({ title: '加载中' })
            const resp = await api.getArticleList(this.currLocation.longitude, this.currLocation.latitude, this.formData.currPageIndex, this.formData.currPageSize)
            uni.hideLoading()
            if (resp.code != api.SUCCESS_CODE) { return; }
            const articleList = resp.data
            console.debug("articleList: ", articleList)
            if (!articleList || articleList.length == 0) {
                this.noMoreArticle = true
                return
            }
            for (var i in articleList) {
                let article = articleList[i]
                this.articleList.push(article)
            }
            this.formData.currPageIndex++
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
        },

        toUserHomePage(userID) {
            uni.navigateTo({
                url: '/page_subject/pages/user_info_detail?user_id=' + userID
            });
        },

    }
}
</script>


<style lang="scss">
.loading-text {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60upx;
    color: #979797;
    font-size: 24upx;
}
</style>