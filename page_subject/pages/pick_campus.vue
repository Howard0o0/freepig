<template>
    <view>
        <uni-list>
            <uni-list-item v-for="(item,index) in campusList" :key="index" :title="item.name" clickable
                @click="campusItemOnClick(item.id)"></uni-list-item>
        </uni-list>
    </view>
</template>

<script>
export default {
    data() {
        return {
            campusList:
                [
                    {
                        id: 1,
                        name: "清华大学"
                    },
                    {
                        id: 2,
                        name: "武汉大学"
                    },
                    {
                        id: 3,
                        name: "武汉理工大学"
                    }
                ]
        }
    },
    onLoad() {

    },
    methods: {
        campusItemOnClick(campusID) {
            console.log('clicked campus item: ', campusID)
        }
    }
}
</script>

<style>

</style>
