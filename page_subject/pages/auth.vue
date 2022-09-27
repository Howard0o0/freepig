<template>
    <view>
        <u--form labelPosition="left" :model="formData">
            <u-form-item label="真实姓名" labelWidth="80" borderBottom>
                <u--input v-model="formData.realname" placeholder="仅用于身份认证" inputAlign="center" border="none">
                </u--input>
            </u-form-item>
            <u-form-item label="学校" labelWidth="80" borderBottom>
                <u--text :text="formData.selectedCampus.name" align="center"></u--text>
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
    }
}
</script>

<style>

</style>
