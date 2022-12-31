<template>
    <view class="left-rigth-margin">
        <view class="multi-columns">
            <image @tap="toUserHomePage(selectedGoodsToShowInDetail.user_id)" class="avatar"
                :src="selectedGoodsToShowInDetail.user_avatar_url" mode="aspectFit"></image>
            <view @tap="toUserHomePage(selectedGoodsToShowInDetail.user_id)">
                <view class="nickname user-info">{{ selectedGoodsToShowInDetail.user_nickname }}</view>
                <view class="campus-info user-info">{{ joinCampusAndMajorInfo(selectedGoodsToShowInDetail.campus,
        selectedGoodsToShowInDetail.major)
}}</view>
            </view>
            <u-icon v-if="!(selectedGoodsToShowInDetail.user_id == userInfo.id)" name="chat" size="30" color="#2979ff"
                @click="sendMessageBtnOnClick" />
        </view>
        <view class="price">￥{{ selectedGoodsToShowInDetail.goods_price }}</view>
        <textarea :value="selectedGoodsToShowInDetail.goods_description" disabled="true" auto-height="true"></textarea>
        <view class="swiper-box">
            <swiper indicator-dots="true" circular="true" autoplay="true">
                <swiper-item v-for="image in swipImages" :key="image">
                    <image :src="image" mode="aspectFit" @click="imagePreview(image)"></image>
                </swiper-item>
            </swiper>
        </view>
    </view>
</template>

<script>

import { utils } from '../../common/common.js';
import {
    mapState
} from "vuex";
import { api } from '../../config/api';

export default {
    data() {
        return {
            selectedGoodsToShowInDetail: {
                user_avatar_url: "",
                user_nickname: "加载中",
                campus: "加载中",
                major: "",
                user_id: 0,
                goods_price: "加载中",
                goods_description: "加载中",
            },
            swipImages: [],
            userInfo: null,
        }
    },
    onLoad(option) {
        this.userInfo = this.$store.state.vuex_user
        console.log('[DBUEG] selectedGoodsToShowInDetail in detail: ', getApp().globalData.selectedGoodsToShowInDetail)
        this.selectedGoodsToShowInDetail = getApp().globalData.selectedGoodsToShowInDetail
        this.swipImages = this.selectedGoodsToShowInDetail.goods_images.split(",")
    },
    onShow() {
    },
    methods: {
        async sendMessageBtnOnClick() {
            uni.showLoading({
                title: '建立会话',
            });
            console.log('[DEBUG] create conversation with user ', this.selectedGoodsToShowInDetail.user_id)
            const resp = await api.createConversation(this.selectedGoodsToShowInDetail.user_id)
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
                toUserId: this.selectedGoodsToShowInDetail.user_id.toString(),
            })
            uni.hideLoading();
            uni.navigateTo({
                url: '/pages/tim/room'
            })
        },

        imagePreview(imageURL) {
            uni.previewImage({
                indicator: "number",
                loop: true,
                urls: [imageURL],
            })
        },

        joinCampusAndMajorInfo(campusName, majorName) {
            return campusName + "·" + majorName
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
.multi-columns {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    width: 92%;
    // padding: 10rpx 4% 10rpx 8%;
}

.nickname {
    height: 50rpx;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis; //溢出用省略号显示
    white-space: nowrap; //溢出不换行
    font-size: 32rpx;
}

.user-info {
    width: 450rpx;
    height: 50rpx;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis; //溢出用省略号显示
    white-space: nowrap; //溢出不换行
    font-size: 30rpx;
    margin-left: 10rpx;
}

.avatar {
    width: 100rpx;
    height: 100rpx;
}

.campus-info {
    color: #8f8f94;
    font-size: 30rpx;
}

.price {
    color: #e65339;
    font-size: 50rpx;
    font-weight: 600;
    margin: 10rpx 4% 10rpx 0;
}

.left-rigth-margin {
    margin-left: 4%;
    margin-right: 4%;
}

.swiper-box {
    position: relative;
    width: 100%;
    height: 100vw;

    swiper {
        width: 100%;
        height: 100vw;

        swiper-item {
            image {
                width: 100%;
                height: 100vw;
            }
        }
    }

    .indicator {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 25upx;
        height: 40upx;
        border-radius: 40upx;
        font-size: 22upx;
        position: absolute;
        bottom: 20upx;
        right: 20upx;
        color: #fff;
        background-color: rgba(0, 0, 0, 0.2);
    }
}
</style>
