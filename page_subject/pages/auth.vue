<template>
    <view>
        <u--form labelPosition="left" :model="formData" :rules="rules">
            <u-form-item label="真实姓名" labelWidth="80" prop="realname" borderBottom>
                <u--input v-model="formData.realname" inputAlign="center" border="none"></u--input>
            </u-form-item>
        </u--form>
    </view>
</template>

<script>
export default {
    data() {
        return {
            realname: '',
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
