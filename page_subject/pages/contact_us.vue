<template>
	<view class="left-rigth-margin">
		<image src="/page_subject/static/about_us.jpeg" mode="aspectFit"></image>
		<view>{{aboutFreePig}}</view>
		<u-form-item leftIcon="email" >
			<view>howardzz@foxmail.com</view>
		</u-form-item>
	</view>
</template>

<script>

import { api } from '../../config/api.js';
import { utils } from '../../common/common.js';


export default {
	data() {
		return {
			aboutFreePig: "作为一名毕业已久的体验者，在试用这款产品的一周里，我始终没有产生交流欲望和依赖感。Summer对我没有足够的吸引力，而我实际上也并不在它的核心目标用户群之中。可能是我早已脱离了对校园的依赖，也可能移动互联网时代，我越来越习惯于虚拟人设间的自嗨，对现实反而失去了感觉。",
		}
	},

	onLoad(option) {
	},

	methods: {

	}
}
</script>

<style>

</style>
