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
                <uni-data-select v-model="formData.selectedDegreeid" :localdata="degreeList"></uni-data-select>
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
                <u-button type="primary" size="normal" text="学校邮箱认证"></u-button>
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
                { value: 1, text: "专科" },
                { value: 2, text: "本科" },
            ],
            kickoffYearList: [
                { value: 1, text: "2015" },
                { value: 2, text: "2016" },
            ],
        }
    },
    onLoad() {
    },
    methods: {
        pickCampusOnClick() {
            uni.navigateTo({ url: 'pick_campus' })
            console.log('haha')
        },
        setSelectedCampusID(campusID) {
            this.formData.selectedCampus.id = campusID
            console.log('[DEBUG] selected campusID: ', this.formData.selectedCampus.id)
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
