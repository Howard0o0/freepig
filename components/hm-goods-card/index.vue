<template>
  <div class="hm-goods-card">
    <div class="box">
      <!-- <div class="titleClass">
        <text class="title">{{ options.title }}</text>
        <image class="titleimg" :src="options.titleimg" />
      </div> -->
      <div class="goods" @click="goodsOnClick(options)">
        <div class="wrap">
          <image class="pic" :src="options.pic" />
        </div>
        <div class="block">
          <text class="tradeName">{{ options.tradeName }}</text>
          <text class="describe">{{ options.describe }}</text>
          <view class="sale-buttons">
            <u-tag v-if="options.isOnSale == true" text="售卖中" color="#c85661" borderColor="#c85661" plain />
            <u-tag v-else text="已下架" color="#b8bcc0" borderColor="#b8bcc0" plain />
            <!-- <text class="commodity">{{ options.commodity }}</text> -->

            <view v-if="options.isOwner" style="padding-left: 80rpx">
              <view style="width:150rpx; height = 30rpx;" v-if="options.isOnSale == true">
                <u-button type="primary" shape="circle" size="small" :plain="true" text="下架"
                  @click.native.stop="offSaleOnClick(options.id)" />
              </view>
              <view style="width:150rpx; height = 30rpx;" v-else>
                <u-button type="primary" shape="circle" size="small" :plain="true" text="上架"
                  @click.native.stop="onSaleOnClick(options.id)" />
              </view>
            </view>

          </view>
        </div>
      </div>
      <!-- <div class="row" />
      <div class="row2">
        <div class="group"><image class="img" :src="options.img" /></div>
        <div class="container">
          <text class="secondName">{{ options.secondName }}</text>
          <text class="secondDescribe">{{ options.secondDescribe }}</text>
          <text class="secondcommodity">{{ options.secondcommodity }}</text>
        </div>
      </div>
      <div class="submain" />
      <div class="main">
        <div class="outer">
          <image class="smallItem" :src="options.smallItem" />
        </div>
        <div class="wrap_2">
          <text class="thirdName">{{ options.thirdName }}</text>
          <text class="thirdDescribe">{{ options.thirdDescribe }}</text>
          <text class="thirdcommodity">{{ options.thirdcommodity }}</text>
        </div>
      </div> -->
    </div>
  </div>
</template>
<script>
export default {
  name: 'HmGoodsCard',
  props: {
    dataId: {
      type: String,
      default: 'hm-goods-card'
    },
    options: {
      type: Object,
      default: function () {
        return {
          title: '热门产品',
          titleimg:
            './images/img_25335_0_0.png',
          pic:
            './images/img_25335_0_1.png',
          tradeName: '圆形户外搁脚凳',
          describe: '搁脚凳',
          commodity: '凳子',
          img:
            './images/img_25335_0_2.png',
          secondName: '深灰色翼背',
          secondDescribe: '椅子第1版',
          secondcommodity: '椅子',
          smallItem:
            './images/img_25335_0_3.png',
          thirdName: '简易木端',
          thirdDescribe: '小号桌',
          thirdcommodity: '桌子',

          isOwner: false,
          isOnSale: true,
        };
      }
    }
  },
  data() {
    return {};
  },
  methods: {
    onSaleOnClick(goodsID) {
      this.$emit('onSaleOnClick', goodsID);
    },
    offSaleOnClick(goodsID) {
      this.$emit('offSaleOnClick', goodsID);
    },
    goodsOnClick(goods) {
      this.$emit('goodsOnClick', goods);
    },
  }
};
</script>
<style>
@import './index.response.css';

.sale-buttons {
  display: flex;
  width: 100%;
  justify-content: space-between;
  padding-top: 10rpx;
}
</style>
