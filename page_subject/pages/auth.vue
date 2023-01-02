<template>
    <view class="left-right-margin">
        <lyg-popup @popupState="popupState" title="服务协议"
            protocolPath='/page_subject/pages/webview?can_share=false&url=https://www.doraewhite.com/licence/user_protocol.html'
            policyPath='/page_subject/pages/webview?can_share=false&url=https://www.doraewhite.com/licence/privacy_policy.html'
            policyStorageKey="has_read_privacy">
        </lyg-popup>

        <u--form labelPosition="left" :model="formData">
            <u-form-item label="真实姓名" labelWidth="80" borderBottom>
                <u--input v-model="formData.realname" placeholder="仅用于身份认证" inputAlign="center" border="none">
                </u--input>
            </u-form-item>
            <u-form-item label="学校" labelWidth="80" borderBottom>
                <u--text :text="formData.selectedCampus.name" align="center" @click="pickCampusOnClick"></u--text>
            </u-form-item>
            <u-form-item label="专业" labelWidth="80" borderBottom>
                <u--text :text="formData.selectedMajor.name" align="center" @click="pickMajorOnClick"></u--text>
            </u-form-item>
            <u-form-item label="学历" labelWidth="80" borderBottom>
                <uni-data-select v-model="formData.selectedDegree" :localdata="degreeList"></uni-data-select>
            </u-form-item>
            <u-form-item label="入学年份" labelWidth="80" borderBottom>
                <uni-data-select v-model="formData.selectedKickoffYear" :localdata="kickoffYearList"></uni-data-select>
            </u-form-item>
            <u-form-item label="内推码" labelWidth="80" borderBottom>
                <u--input v-model="formData.recommendCode" placeholder="没有则留空噢" inputAlign="center" border="none">
                </u--input>
            </u-form-item>
        </u--form>

        <view class="demo-uni-row">
            <uni-row width=730>
                <uni-col :span="2">
                    <view class="demo-uni-col"></view>
                </uni-col>
                <uni-col :span="9">
                    <u-button type="primary" size="normal" text="学校邮箱认证" @click="authByEmailBtnOnClick"></u-button>
                </uni-col>
                <uni-col :span="2">
                    <view class="demo-uni-col"></view>
                </uni-col>
                <uni-col :span="9">
                    <u-button type="primary" size="normal" text="学生证认证" @click="authByCertificationBtnOnClick">
                    </u-button>
                </uni-col>
                <uni-col :span="2">
                    <view class="demo-uni-col"></view>
                </uni-col>
            </uni-row>
        </view>

        <uni-notice-bar class="bottom-notice-bar" text="认证成功后, 每年仅有一次机会重新认证, 请谨慎操作呀" />
    </view>
</template>

<script>

import { api } from '../../config/api.js';
import { utils } from '../../common/common.js';
import lyg_popup from '@/components/lyg-popup/lyg-popup.vue';

import {
    mapMutations
} from 'vuex';

export default {
    components: {
        lyg_popup
    },
    data() {
        return {
            formData: {
                realname: "",
                selectedCampus: {
                    id: 0,
                    name: "请选择学校"
                },
                selectedMajor: {
                    id: 0,
                    name: "请选择专业"
                },
                selectedDegree: "",
                selectedKickoffYear: 0,
                recommendCode: "",
            },
            majorList: [
                { value: 1, text: "计算机" },
                { value: 2, text: "数学" },
            ],
            degreeList: [
                { value: "专科僧", text: "专科僧" },
                { value: "本科僧", text: "本科僧" },
                { value: "硕士僧", text: "硕士僧" },
                { value: "博士僧", text: "博士僧" },
            ],
            kickoffYearList: [
                { value: 2015, text: "2015" },
            ],

            userAgree: false,
        }
    },

    onLoad(option) {
        this.refreshKickoffYealList()
        if (option["recommend-code"] && option["recommend-code"] != "") {
            getApp().globalData.recommendCode = option["recommend-code"]
        }
        this.formData.recommendCode = getApp().globalData.recommendCode

        var userAgree = wx.getStorageSync('userAgree') || false
        this.userAgree = userAgree
    },

    methods: {
        popupState(state) {
            console.debug("confirm protocol: ", state);
            if (!state) {
                uni.navigateBack();
            }
        },

        pickCampusOnClick() {
            uni.navigateTo({ url: '/page_subject/pages/pick_campus' })
        },

        pickMajorOnClick() {
            if (this.formData.selectedCampus.id == 0) {
                uni.showToast({
                    title: '哈.. 还没选学校咧',
                    icon: "none",
                    duration: 1000,
                })
                return;
            }
            let item = JSON.stringify(this.majorList);
            uni.navigateTo({ url: '/page_subject/pages/pick_major?major_list=' + item })
        },

        setSelectedCampus(campus) {
            this.formData.selectedCampus = campus
            console.log('[DEBUG] selected campus: ', this.formData.selectedCampus)
            // refresh majorList
            this.refreshMajorList(this.formData.selectedCampus.id)
        },

        setSelectedMajor(major) {
            this.formData.selectedMajor = major
            console.log('[DEBUG] selected major: ', this.formData.selectedMajor)
        },

        async authByCertificationBtnOnClick() {
            console.log('[DEBUG] formData: ', this.formData)
            const formDataCheckPass = await this.checkFormData()
            if (!formDataCheckPass) {
                return
            }

            await utils.promiseRequestSubscribeMessage(['FeXIK4bri75nNxiqFUi1eAB-4kGpKzbLAmmtsvMtCUE'])

            uni.navigateTo({
                url: '/page_subject/pages/auth_by_certification?realname=' + this.formData.realname
                    + '&campus_id=' + this.formData.selectedCampus.id
                    + '&major_id=' + this.formData.selectedMajor.id
                    + '&degree=' + this.formData.selectedDegree
                    + '&kickoff_year=' + this.formData.selectedKickoffYear
                    + '&recommend_code=' + this.formData.recommendCode
            })
        },

        async authByEmailBtnOnClick() {
            console.log('[DEBUG] formData: ', this.formData)
            const formDataCheckPass = await this.checkFormData()
            if (!formDataCheckPass) {
                return
            }
            uni.navigateTo({
                url: '/page_subject/pages/auth_by_email?realname=' + this.formData.realname
                    + '&campus_id=' + this.formData.selectedCampus.id
                    + '&major_id=' + this.formData.selectedMajor.id
                    + '&degree=' + this.formData.selectedDegree
                    + '&kickoff_year=' + this.formData.selectedKickoffYear
                    + '&recommend_code=' + this.formData.recommendCode
            })
        },

        async checkFormData() {
            if (this.$store.state.vuex_user.role == "STUDENT") {
                uni.showToast({
                    title: '已经认证过啦',
                    icon: 'none',
                    duration: 1000
                });
                return false;
            }

            if (this.formData.recommendCode && this.formData.recommendCode.length > 0) {
                const resp = await api.verifyRecommendCode(this.formData.recommendCode)
                if (resp.code != api.SUCCESS_CODE) {
                    uni.showToast({
                        title: '无效内推码',
                        icon: 'error',
                        duration: 1000
                    });
                    return false
                }
            }

            if (this.formData.realname == "") {
                uni.showToast({
                    title: '真实姓名要填呀',
                    icon: 'error',
                    duration: 1000
                });
                return false
            }
            if (this.formData.selectedCampus.id == 0) {
                uni.showToast({
                    title: '要选学校呀',
                    icon: 'error',
                    duration: 1000
                });
                return false
            }
            if (this.formData.selectedMajor.id == 0) {
                uni.showToast({
                    title: '要选专业呀',
                    icon: 'error',
                    duration: 1000
                });
                return false
            }
            if (this.formData.selectedDegree == "") {
                uni.showToast({
                    title: '要选学历呀',
                    icon: 'error',
                    duration: 1000
                });
                return false
            }
            if (this.formData.selectedKickoffYear == 0) {
                uni.showToast({
                    title: '要选入学年份呀',
                    icon: 'error',
                    duration: 1000
                });
                return false
            }
            return true
        },

        refreshKickoffYealList() {
            var kickoffYearList = []
            var date = new Date();
            var currYear = date.getFullYear();
            var startYear = 2010
            for (var i = startYear; i <= currYear; i++) {
                kickoffYearList.push({ value: i, text: i })
            }
            this.kickoffYearList = kickoffYearList
        },

        async refreshMajorList(campusID) {
            var resp = await api.getMajorList(campusID)
            var majorList = resp.data
            this.majorList = []

            var i
            for (i in majorList) {
                var major = majorList[i]
                this.majorList.push({
                    id: major.id,
                    name: major.name,
                })
            }
        }
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
