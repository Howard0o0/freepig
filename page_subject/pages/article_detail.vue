<template>
    <view>
        <uni-card :title="article.username" :sub-title="generatePostDesc(article)" extra=" "
            :thumbnail="article.user_avatar" @click="toUserHomePage(article.user_id)">
            <text class="uni-body">{{ article.text }}</text>
            <view v-if="getFirstImage(article.images).length > 0">
                <swiper indicator-dots="true" circular="true" autoplay="true">
                    <swiper-item v-for="image in swipImages" :key="image">
                        <image :src="image" mode="aspectFit" @click="imagePreview(image)"></image>
                    </swiper-item>
                </swiper>
            </view>
            <view slot="actions" class="card-actions">
                <view class="card-actions-item" @tap.stop="shareBtnOnClick">
                    <uni-icons type="redo" size="18" color="#999"></uni-icons>
                    <text class="card-actions-item-text">{{ article.like_num }}</text>
                </view>
                <view class="card-actions-item" @tap.stop="likeBtnOnClick">
                    <uni-icons type="heart" size="18" :color="likeBtnColor"></uni-icons>
                    <text class="card-actions-item-text">{{ article.like_num }}</text>
                </view>
                <view class="card-actions-item" @tap.stop="commentBtnOnClick">
                    <uni-icons type="chatbubble" size="18" color="#999"></uni-icons>
                    <text class="card-actions-item-text">{{ article.comment_num }}</text>
                </view>
            </view>
        </uni-card>

        <hb-comment ref="hbComment" @add="publishComment" @del="del" @like="likeCommentOnClick" @focusOn="focusOn"
            :deleteTip="'确认删除？'" :cmData="commentData" v-if="commentData"></hb-comment>

        <l-painter ref="painter" custom-style="position: fixed; left: 200%" />

    </view>
</template>

<script>

import { api } from '../../config/api.js';
import { utils } from '../../common/common.js';

import {
    mapMutations
} from 'vuex';

export default {
    data() {
        return {
            likeBtnColor: "#999",
            hasLiked: false,
            swipImages: [],

            article: {
                id: 123,
                username: " ",
                user_avatar: "https://ddp-freepig.oss-cn-beijing.aliyuncs.com/images/user-9-goods-1665913708184745118-1665913732809121787.jpeg",
                text: " ",
                num: '0',
                commentNum: '0',
                stateimg: "https://ddp-freepig.oss-cn-beijing.aliyuncs.com/images/user-9-goods-1665913708184745118-1665913732809121787.jpeg",
            },
            commentData: {
                "readNumer": 0,
                "commentSize": 0,
                "comment": [],
            },

            commentsFromServer: {
                "readNumber": 0,
                "commentList": []
            },
        }
    },

    async onLoad(options) {

        this.article = JSON.parse(options.article);
        console.debug('article detail: ', this.article)

        uni.showLoading({})
        const resp = await api.getArticle(this.article.id)
        uni.hideLoading()
        if (resp.code != api.SUCCESS_CODE) { return; }
        this.article = resp.data
        console.debug('reload article detail: ', this.article)
        this.swipImages = this.article.images.split(",")
        if (this.article.has_like) {
            this.likeBtnColor = "#ff0000"
        } else {
            this.likeBtnColor = "#999"
        }

        this.commentData.readNumer = this.article.read_num
        api.readArticle(parseInt(this.article.id))
        this.reloadComment()
    },

    methods: {
        focusOn() {

        },

        toUserHomePage(userID) {
            uni.navigateTo({
                url: '/page_subject/pages/user_info_detail?user_id=' + userID
            });
        },

        async reloadComment() {
            const resp = await api.getArticleCommentList(parseInt(this.article.id))
            if (resp.code != api.SUCCESS_CODE) { return; }
            console.debug("article comment list: ", resp.data)
            this.commentsFromServer = {
                commentList: resp.data,
                readNumber: this.article.read_num,
            }
            for (let i = 0; i < this.commentsFromServer.commentList.length; i++) {
                this.commentsFromServer.commentList[i].createTime = utils.timeFormatToNAgo(this.commentsFromServer.commentList[i].createTime)
            }
            this.commentData.commentSize = this.commentsFromServer.commentList.length
            this.commentData.comment = this.getTree(this.commentsFromServer.commentList)

        },

        async publishComment(e) {
            console.debug("publishComment on click: ", e)
            let content = e.content
            let commentID = e.pId
            if (commentID) { commentID = parseInt(commentID) }
            console.debug("content: " + content + ", parent comment_id: ", + commentID)
            uni.showLoading({ title: '发布中' })
            let resp = await api.postArticleComment(parseInt(this.article.id), content, commentID)
            uni.hideLoading()
            if (resp.code != api.SUCCESS_CODE) { return; }
            uni.$u.toast("发表评论成功")
            this.$refs.hbComment.addComplete()
            this.reloadComment()
        },

        imagePreview(imageURL) {
            uni.previewImage({
                indicator: "number",
                loop: true,
                urls: [imageURL],
            })
        },

        async commentBtnOnClick() {
            console.debug("commentBtnOnClick")
        },

        async shareBtnOnClick() {
            console.debug("shareBtnOnClick")

            let images = []
            if (this.article.images.length > 0) {
                let tokens = this.article.images.split(',');
                console.debug("image arr: ", tokens)
                for (var i = 0; i < tokens.length; i++) {
                    let imageURL = tokens[i]
                    images.push({
                        src: imageURL,
                        type: "image",
                        css: {
                            objectFit: "cover",
                            width: "128rpx",
                            height: "128rpx",
                            paddingLeft: "10rpx"
                        },
                    })
                }
            }
            console.debug("images: ", images)

            let jsonSchema = {
                css: {
                    width: "750rpx",
                    paddingBottom: "40rpx",
                    background: "linear-gradient(,#000 0%, #ff5000 100%)"
                },
                views: [
                    {
                        src: this.article.user_avatar,
                        type: "image",
                        css: {
                            background: "#fff",
                            objectFit: "cover",
                            marginLeft: "40rpx",
                            marginTop: "40rpx",
                            width: "84rpx",
                            border: "2rpx solid #fff",
                            boxSizing: "border-box",
                            height: "84rpx",
                            borderRadius: "50%"
                        }
                    },
                    {
                        type: "view",
                        css: {
                            marginTop: "40rpx",
                            paddingLeft: "20rpx",
                            display: "inline-block"
                        },
                        views: [
                            {
                                text: this.article.username,
                                type: "text",
                                css: {
                                    display: "block",
                                    paddingBottom: "10rpx",
                                    color: "#fff",
                                    fontSize: "32rpx",
                                    fontWeight: "bold"
                                }
                            },
                            {
                                text: this.article.user_campus + "·" + this.article.user_major,
                                type: "text",
                                css: {
                                    color: "rgba(255,255,255,.7)",
                                    fontSize: "24rpx"
                                },
                            }
                        ],
                    },
                    {
                        css: {
                            marginLeft: "40rpx",
                            marginTop: "30rpx",
                            padding: "32rpx",
                            boxSizing: "border-box",
                            background: "#fff",
                            borderRadius: "16rpx",
                            width: "670rpx",
                            boxShadow: "0 20rpx 58rpx rgba(0,0,0,.15)"
                        },
                        views: [
                            {
                                text: this.article.text,
                                type: "text",
                                css: {
                                    paddingRight: "1rpx",
                                    boxSizing: "border-box",
                                    lineClamp: 10,
                                    color: "#333333",
                                    lineHeight: "1.8em",
                                    fontSize: "36rpx",
                                    width: "100%"
                                },
                            }, {
                                views: images
                            }, {
                                css: {
                                    marginTop: "30rpx"
                                },
                                views: [
                                    {
                                        src: "/page_subject/static/QR.jpeg",
                                        type: "image",
                                        css: {
                                            width: "128rpx",
                                            height: "128rpx",
                                        },

                                    }, {
                                        text: "微信识别二维码 更多校园有趣新鲜事等你来看",
                                        type: "text",
                                        css: {
                                            paddingTop: "40rpx",
                                            paddingLeft: "32rpx",
                                            boxSizing: "border-box",
                                            lineClamp: 2,
                                            color: "#333333",
                                            lineHeight: "1.8em",
                                            fontSize: "18rpx",
                                            width: "478rpx"
                                        },
                                    }],
                                type: "view"
                            }],
                        type: "view"
                    }, {
                        type: "view",
                        css: {
                            marginTop: "40rpx",
                            paddingLeft: "150rpx",
                            display: "inline-block",
                        },
                        views: [{
                            text: "兜兜 | 看校园新鲜事·扩列新同学",
                            type: "text",
                            css: {
                                display: "block",
                                paddingBottom: "10rpx",
                                color: "#fff",
                                fontSize: "32rpx",
                                fontWeight: "bold"
                            }
                        }]
                    }
                ]
            }

            // 渲染
            this.$refs.painter.render(jsonSchema);
            // 生成图片
            this.$refs.painter.canvasToTempFilePathSync({
                fileType: "jpg",
                // 如果返回的是base64是无法使用 saveImageToPhotosAlbum，需要设置 pathType为url
                pathType: 'url',
                quality: 1,
                success: (res) => {
                    console.log(res.tempFilePath);
                    // 非H5 保存到相册
                    uni.saveImageToPhotosAlbum({
                        filePath: res.tempFilePath,
                        success: function () {
                            console.log('save success');
                        }
                    });
                },
            });
        },

        async likeBtnOnClick() {
            console.debug("likeBtnOnClick")
            if (this.article.has_like) { return; }
            const resp = await api.likeArticle(this.article.id)
            if (resp.code != api.SUCCESS_CODE) { return; }
            this.hasLiked = true
            this.likeBtnColor = "#ff0000"
            this.article.like_num += 1
            this.article.has_like = true
        },

        async likeCommentOnClick(comment) {
            console.debug("likeCommentOnClick: ", comment)
            if (comment.hasLike) { return; }
            const resp = await api.likeComment(parseInt(comment.id))
            if (resp.code != api.SUCCESS_CODE) { return; }
            this.$refs.hbComment.likeComplete(comment.id)
            comment.hasLike = true
        },

        getFirstImage(imageURLs) {
            if (!imageURLs) { return ""; }
            const tokens = imageURLs.split(',');
            if (tokens.length == 0) { return "" }
            return tokens[0]
        },

        getTree(data) {
            let result = [];
            let map = {};
            data.forEach(item => {
                map[item.id] = item;
            });
            data.forEach(item => {
                let parent = map[item.parentId];
                if (parent) {
                    (parent.children || (parent.children = [])).push(item);
                } else {
                    result.push(item);
                }
            });
            return result;
        },

        generatePostDesc(article) {
            let timeStr = utils.timeFormatToNAgo(article.created_at)
            return timeStr + "·" + article.user_campus + "·" + article.user_degree
        },
    }
}
</script>

<style>
.demo-uni-row {
    margin-top: 20rpx;
    display: block;
}

.demo-uni-col {
    height: 36px;
    border-radius: 4px;
}
</style>
