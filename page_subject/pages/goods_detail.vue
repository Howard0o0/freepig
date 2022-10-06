<template>
    <view class=".left-rigth-margin">
        <view class="multi-columns">
            <image class="avatar" :src="selectedGoodsToShowInDetail.user_avatar_url" mode="scaleToFill"></image>
            <view>
                <view class="nickname user-info">{{selectedGoodsToShowInDetail.user_nickname}}</view>
                <view class="campus-info user-info">武汉大学</view>
            </view>
            <u-icon name="chat" size="30" color="#2979ff" />
        </view>
        <view class="price">￥{{selectedGoodsToShowInDetail.goods_price}}</view>
        <textarea :value="selectedGoodsToShowInDetail.goods_description" disabled="true" auto-height="true"></textarea>
        <view class="swiper-box">
            <swiper indicator-dots="true" circular="true" autoplay="true">
                <swiper-item v-for="image in swipImages" :key="image">
                    <image :src="image"></image>
                </swiper-item>
            </swiper>
        </view>
    </view>
</template>

<script>

import { utils } from '../../common/common.js';

export default {
    data() {
        return {
            selectedGoodsToShowInDetail: null,
            swipImages: [],
        }
    },
    onLoad(option) {
        console.log('[DBUEG] selectedGoodsToShowInDetail in detail: ', getApp().globalData.selectedGoodsToShowInDetail)
        this.selectedGoodsToShowInDetail = getApp().globalData.selectedGoodsToShowInDetail
        this.swipImages = this.selectedGoodsToShowInDetail.goods_images.split(",")
    },
    onShow() {
    },
    methods: {
    }
}
</script>

<style lang="scss">
.multi-columns {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    width: 92%;
    padding: 10rpx 4% 10rpx 4%;
}

.nickname {
    width: 70%;
    height: 50rpx;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis; //溢出用省略号显示
    white-space: nowrap; //溢出不换行
    font-size: 35rpx;
}

.user-info {
    width: 70%;
    height: 50rpx;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis; //溢出用省略号显示
    white-space: nowrap; //溢出不换行
    font-size: 30rpx;
}

.avatar {
    text-align: left;
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
    margin: 10rpx 4% 10rpx 4%;
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
