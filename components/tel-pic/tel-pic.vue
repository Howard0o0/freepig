<template>
	<view class="pic-container" :style="{
	paddingLeft: spacingNumber + 'px',
	paddingRight: spacingNumber + 'px'
}">
		<view class="tel-pic-show">
			<view class="pic-box">
				<block v-for="(item, i) in imageArr" :key="i">
					<view class="img" @click="prevsImages(imageArr, i)" :style="{
	backgroundImage: 'url(' + item + ')',
	width: imgW + 'px',
	height: imgH + 'px',
	marginBottom: spacingNumber + 'px',
	marginRight: spacingNumber + 'px'
}">
					</view>
				</block>
			</view>
		</view>
	</view>
</template>
<script>
export default {
	props: ['imageArr', 'lineNum', 'spacingNumber'],
	data() {
		return {
			imgW: '', //图片宽
			imgH: '', //图片高
			screenWidth: 0, //屏幕宽度
		};
	},
	mounted() {
		const self = this;
		uni.createSelectorQuery().in(this).select('.tel-pic-show').boundingClientRect(data => {
			self.screenWidth = data.width;
			self.imgW = (self.screenWidth - (self.lineNum - 1) * self.spacingNumber) / self.lineNum;
			self.imgH = self.imgW;
		}).exec();
	},
	methods: {
		prevsImages(arr, i) {
			uni.previewImage({
				urls: arr,
				current: i
			});
		}
	}
};
</script>
<style lang="scss">
.pic-container {
	width: 100%;
	box-sizing: border-box;
}

.tel-pic-show {
	width: 100%;

	.pic-box {
		width: 100%;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		flex-wrap: wrap;

		.img {
			overflow: hidden;
			background-position: center center;
			background-size: cover;
			background-repeat: no-repeat;
			display: inline-block;
			border-radius: 16rpx;
		}

		// 3来源于 ：行数 字段：lineNum
		.img:nth-child(6n + 6) {
			margin-right: 0px !important;
		}
	}
}
</style>
