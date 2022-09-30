<template>
	<view>
		<u--form labelPosition="top" :model="formData">
			<u-form-item label="学校邮箱" labelWidth="80" borderBottom>
				<u--input v-model="formData.realname" placeholder="只能用学校的edu邮箱噢" inputAlign="left" border="none">
				</u--input>
			</u-form-item>
			<u-form-item label="学校邮箱" labelWidth="80" borderBottom>
				<u-input placeholder="请输入邮箱验证码">
					<template slot="suffix">
						<u-code ref="uCode" @change="codeChange" seconds="20" changeText="X秒后重新获取"></u-code>
						<u-button @tap="getCode" :text="tips" type="success" size="mini"></u-button>
					</template>
				</u-input>
			</u-form-item>
		</u--form>
		<u-button type="primary" size="normal" text="OK" @click="submitBtnOnclick"></u-button>
	</view>
</template>

<script>
export default {
	data() {
		return {
			codeTxt: '获取验证码',
			codeFlag: true, // 控制按钮是否可点击
			tips: '',
			value: '',
			formData: {

			}
		}
	},

	onLoad(option) {
		console.log('params: ', option)	
	},

	methods: {
		submitBtnOnclick() {

		},

		codeChange(text) {
			this.tips = text;
		},

		getCode() {
			if (this.$refs.uCode.canGetCode) {
				// 模拟向后端请求验证码
				uni.showLoading({
					title: '正在获取验证码'
				})
				setTimeout(() => {
					uni.hideLoading();
					// 这里此提示会被this.start()方法中的提示覆盖
					uni.$u.toast('验证码已发送');
					// 通知验证码组件内部开始倒计时
					this.$refs.uCode.start();
				}, 2000);
			} else {
				uni.$u.toast('倒计时结束后再发送');
			}
		},
	}
}
</script>

<style>
.getCode {
	height: 60rpx;
	width: 180rpx;
	background: #f7f7f7;
	color: #666666;
	line-height: 60rpx;
	font-size: 24rpx;
	text-align: center;
}

.getCode.activeCode {
	background: #21bbef;
	color: #FFFFFF;
}
</style>
