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

        <hb-comment ref="hbComment" @add="add" @del="del" @like="like" @focusOn="focusOn" :deleteTip="'确认删除？'"
            :cmData="commentData" v-if="commentData"></hb-comment>

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
                username: "ahahah",
                user_avatar: "https://ddp-freepig.oss-cn-beijing.aliyuncs.com/images/user-9-goods-1665913708184745118-1665913732809121787.jpeg",
                text: "哈哈哈哈哈",
                num: '10',
                commentNum: '67',
                stateimg: "https://ddp-freepig.oss-cn-beijing.aliyuncs.com/images/user-9-goods-1665913708184745118-1665913732809121787.jpeg",
            },
            commentData: {
                "readNumer": 0,
                "commentSize": 0,
                "comment": [],
            },

            commentsFromServer: {
                "readNumer": 193,
                "commentList": [{
                    "id": 1, // 唯一主键
                    "owner": false, // 是否是拥有者，为true则可以删除，管理员全部为true
                    "hasLike": false, // 是否点赞
                    "likeNum": 2, // 点赞数量
                    "avatarUrl": "https://inews.gtimg.com/newsapp_ls/0/13797755537/0", // 评论者头像地址
                    "nickName": "超长昵称超长...", // 评论者昵称，昵称过长请在后端截断
                    "content": "啦啦啦啦", // 评论内容
                    "parentId": null, // 所属评论的唯一主键
                    "createTime": "2021-07-02 16:32:07" // 创建时间
                },
                {
                    "id": 2,
                    "owner": false,
                    "hasLike": false,
                    "likeNum": 2,
                    "avatarUrl": "https://inews.gtimg.com/newsapp_ls/0/13797761970/0",
                    "nickName": "寂寞无敌",
                    "content": "我是评论的评论",
                    "parentId": 1,
                    "createTime": "2021-07-02 17:05:50"
                },
                {
                    "id": 4,
                    "owner": true,
                    "hasLike": true,
                    "likeNum": 1,
                    "avatarUrl": "https://inews.gtimg.com/newsapp_ls/0/13797763270/0",
                    "nickName": "name111",
                    "content": "评论啦啦啦啦啦啦啦啦啦啦",
                    "parentId": null,
                    "createTime": "2021-07-13 09:37:50"
                },
                {
                    "id": 5,
                    "owner": false,
                    "hasLike": false,
                    "likeNum": 0,
                    "avatarUrl": "https://inews.gtimg.com/newsapp_ls/0/13797755537/0",
                    "nickName": "超长昵称超长...",
                    "content": "超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论",
                    "parentId": null,
                    "createTime": "2021-07-13 16:04:35"
                },
                {
                    "id": 13,
                    "owner": false,
                    "hasLike": false,
                    "likeNum": 0,
                    "avatarUrl": "https://inews.gtimg.com/newsapp_ls/0/13797755537/0",
                    "nickName": "超长昵称超长...",
                    "content": "@寂寞无敌 你怕不是个大聪明",
                    "parentId": 1,
                    "createTime": "2021-07-14 11:01:23"
                }
                ]
            },
        }
    },

    onLoad(options) {
        this.article = JSON.parse(options.article);
        console.debug('article detail: ', this.article)
        this.swipImages = this.article.images.split(",")

        this.commentData = {
            "readNumer": this.article.read_num,
            "commentSize": this.commentsFromServer.commentList.length,
            "comment": this.getTree(this.commentsFromServer.commentList)
        }
    },

    methods: {
        imagePreview(imageURL) {
            uni.previewImage({
                indicator: "number",
                loop: true,
                urls: [imageURL],
            })
        },

        async likeBtnOnClick() {
            console.debug("likeBtnOnClick")
            if (this.hasLiked) { return; }
            const resp = await api.likeArticle(this.article.id)
            if (resp.code != api.SUCCESS_CODE) { return; }
            this.hasLiked = true
            this.likeBtnColor = "#ff0000"
            this.article.like_num += 1
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
