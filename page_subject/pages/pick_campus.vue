<template>
    <view>
        <u-search placeholder="可输入学校关键字" @change="onSearchContentChange" :showAction="false"></u-search>
        <uni-list>
            <uni-list-item v-for="(item,index) in campusListToShow" :key="index" :title="item.name" clickable
                @click="campusItemOnClick(item.id)"></uni-list-item>
        </uni-list>
    </view>
</template>

<script>

export default {
    data() {
        return {
            campusListToShow: [
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
            ],
            campusFullListkey: [
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
            ],
        }
    },
    onLoad() {
        // fill the campusFullListkey if empty
        // then fill the campusListToShow using ycampusFullListkey 
    },
    methods: {
        campusItemOnClick(campusID) {
            console.log('choosed campusID: ', campusID)
        },

        onSearchContentChangeImpl(content) {
            console.log('search content: ', content)
            this.refreshCampusListToShow(content)
        },

        onSearchContentChange(content) {
            this.$u.debounce(() => this.onSearchContentChangeImpl(content))
        },

        refreshCampusListToShow(keyword) {
            var campusListToShow = []
            var i
            for (i in this.campusFullListkey) {
                var campus = this.campusFullListkey[i]
                if (campus.name.indexOf(keyword) == -1) {
                    continue
                }
                campusListToShow.push(campus)
            }
            this.campusListToShow = campusListToShow
        }
    }
}
</script>

<style>

</style>
