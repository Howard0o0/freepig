<template>
    <view>
        <view class="multi-columns">
            <image class="avatar" :src="selectedGoodsToShowInDetail.user_avatar_url" mode="scaleToFill"></image>
            <view>
                <view class="nickname user-info">{{selectedGoodsToShowInDetail.user_nickname}}</view>
                <view class="campus-info user-info">武汉大学</view>
            </view>
            <u-icon name="chat" size="30" color="#2979ff" />
        </view>
        <view class="price">￥{{selectedGoodsToShowInDetail.goods_price}}</view>
    </view>
</template>

<script>

import { utils } from '../../common/common.js';

export default {
    data() {
        return {
            selectedGoodsToShowInDetail: null,
        }
    },
    onLoad(option) {
        console.log('[DBUEG] selectedGoodsToShowInDetail in detail: ', getApp().globalData.selectedGoodsToShowInDetail)
        this.selectedGoodsToShowInDetail = getApp().globalData.selectedGoodsToShowInDetail
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
</style>
