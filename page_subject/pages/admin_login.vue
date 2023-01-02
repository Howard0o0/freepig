<template>
    <view class="left-right-margin">
        <u--form labelPosition="left" :model="formData">
            <u-form-item label="username" labelWidth="80" borderBottom>
                <u--input v-model="formData.username" placeholder="用户名" inputAlign="center" border="none">
                </u--input>
            </u-form-item>
            <u-form-item label="password" labelWidth="80" borderBottom>
                <u--input v-model="formData.password" placeholder="密码" inputAlign="center" border="none">
                </u--input>
            </u-form-item>
        </u--form>

        <button class="left-right-margin" @click="loginButtonOnClick">登录</button>
    </view>
</template>

<script>

import { api } from '../../config/api.js';
import { utils } from '@/common/common.js';

export default {
    data() {
        return {
            formData: {
                username: "",
                password: "",
            },
        }
    },

    onLoad(option) {
    },

    methods: {
        async loginButtonOnClick() {
            const resp = await api.adminLogin(this.formData.username, this.formData.password)
            if (resp.code != api.SUCCESS_CODE) {
                console.log('[ERROR] admin login fail. err msg: ', resp.msg)
                uni.showToast({
                    title: '登录失败',
                    icon: "error",
                    duration: 1000,
                })
                return;
            }
            uni.showToast({
                title: '登录成功',
                icon: "success",
                duration: 1500,
            })
            const token = resp.data.token
            console.log('[DEBUG] admin login success. token: ', token)
            this.$u.vuex('vuex_token', token);
            await utils.refreshUserInfo()
            setTimeout(function () {
                uni.reLaunch({ url: '../../pages/mine/mine' })
            }, 1500)
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
