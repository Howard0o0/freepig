<template>
    <view>
        <uni-card :title="article.username" :sub-title="generatePostDesc(article)" extra=" "
            :thumbnail="article.user_avatar">
            <text class="uni-body">{{ article.text }}</text>
            <view v-if="getFirstImage(article.images).length > 0">
                <swiper indicator-dots="true" circular="true" autoplay="true">
                    <swiper-item v-for="image in swipImages" :key="image">
                        <image :src="image" mode="aspectFit" @click="imagePreview(image)"></image>
                    </swiper-item>
                </swiper>
            </view>
            <view slot="actions" class="card-actions">
                <view class="card-actions-item" @click="likeBtnOnClick">
                    <uni-icons type="heart" size="18" :color="likeBtnColor"></uni-icons>
                    <text class="card-actions-item-text">{{ article.like_num }}</text>
                </view>
                <view class="card-actions-item">
                    <uni-icons type="chatbubble" size="18" color="#999"></uni-icons>
                    <text class="card-actions-item-text">{{ article.comment_num }}</text>
                </view>
            </view>
        </uni-card>

        <hb-comment ref="hbComment" @add="publishComment" @del="del" @like="likeCommentOnClick" @focusOn="focusOn"
            :deleteTip="'确认删除？'" :cmData="commentData" v-if="commentData"></hb-comment>

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
