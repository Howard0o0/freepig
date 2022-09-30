<template>
    <view>
        <u--form labelPosition="left" :model="formData">
            <u-form-item label="真实姓名" labelWidth="80" borderBottom>
                <u--input v-model="formData.realname" placeholder="仅用于身份认证" inputAlign="center" border="none">
                </u--input>
            </u-form-item>
            <u-form-item label="学校" labelWidth="80" borderBottom>
                <u--text :text="formData.selectedCampus.name" align="center" @click="pickCampusOnClick"></u--text>
            </u-form-item>
            <u-form-item label="专业" labelWidth="80" borderBottom>
                <uni-data-select v-model="formData.selectedMajor.id" :localdata="majorList"></uni-data-select>
            </u-form-item>
            <u-form-item label="学历" labelWidth="80" borderBottom>
                <uni-data-select v-model="formData.selectedDegree" :localdata="degreeList"></uni-data-select>
            </u-form-item>
            <u-form-item label="入学年份" labelWidth="80" borderBottom>
                <uni-data-select v-model="formData.selectedKickoffYear" :localdata="kickoffYearList"></uni-data-select>
            </u-form-item>
        </u--form>

        <uni-row class="demo-uni-row " :width=730>
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
                <u-button type="primary" size="normal" text="学生证认证"></u-button>
            </uni-col>
            <uni-col :span="2">
                <view class="demo-uni-col"></view>
            </uni-col>
        </uni-row>
    </view>
</template>

<script>

import { api } from '../../config/api.js';

export default {
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
                    name: ""
                },
                selectedDegree: "本科",
                selectedKickoffYear: 2015,
            },
            majorList: [
                { value: 1, text: "计算机" },
                { value: 2, text: "数学" },
            ],
            degreeList: [
                { value: "专科", text: "专科" },
                { value: "本科", text: "本科" },
                { value: "硕士研究生", text: "硕士研究生" },
                { value: "博士研究生", text: "博士研究生" },
            ],
            kickoffYearList: [
                { value: 2015, text: "2015" },
            ],
        }
    },

    onLoad() {
        this.refreshKickoffYealList()
    },

    methods: {
        pickCampusOnClick() {
            uni.navigateTo({ url: 'pick_campus' })
        },

        setSelectedCampus(campus) {
            this.formData.selectedCampus = campus
            console.log('[DEBUG] selected campus: ', this.formData.selectedCampus)
            // refresh majorList
            this.refreshMajorList(this.formData.selectedCampus.id)
        },

        authByEmailBtnOnClick() {
            console.log('[DEBUG] formData: ', this.formData)
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
            var majorList = await api.getMajorList(campusID)
            this.majorList = []

            var i
            for (i in majorList) {
                var major = majorList[i]
                this.majorList.push({
                    value: major.id,
                    text: major.name,
                })
            }
        }
    }
}
</script>

<style>
.demo-uni-row {
    margin-bottom: 10px;
    /* QQ、字节小程序文档写有 :host，但实测不生效 */
    /* 百度小程序没有 :host，需要设置block */
    /* #ifdef MP-TOUTIAO || MP-QQ || MP-BAIDU */
    display: block;
    /* #endif */
}

.demo-uni-col {
    height: 36px;
    border-radius: 4px;
}
</style>
