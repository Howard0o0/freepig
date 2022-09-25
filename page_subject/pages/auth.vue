<template>
    <view>
        <uni-forms :modelValue="formData" label-position="left" label-width="100" label-align="center">
            <uni-forms-item label="真实姓名" name="name">
                <u-input type="text" v-model="realname" placeholder="仅用于身份审核" inputAlign="center" border="none" />
            </uni-forms-item>
        </uni-forms>
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
