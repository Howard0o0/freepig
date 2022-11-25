<template>
    <web-view :src="protoURL"></web-view>
</template>

<script>
    export default {
        data() {
            return {
                protoURL:"https://www.doraewhite.com/licence/user_protocol.html"
            }
        },
        onLoad: function(option) {
            this.protoURL = option.url;
        },
        methods: {
        }
    }
</script>

<style>

</style>