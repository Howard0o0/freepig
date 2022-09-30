<template>
    <view>
        <u-search placeholder="可输入学校关键字" @change="onSearchContentChange" :showAction="false"></u-search>
        <uni-list>
            <uni-list-item v-for="(item,index) in campusListToShow" :key="index" :title="item.name" clickable
                @click="campusItemOnClick(item)"></uni-list-item>
        </uni-list>
    </view>
</template>

<script>

import { api } from '../../config/api.js';

export default {
    data() {
        return {
            campusListToShow: []
        }
    },
    async onLoad() {
    },
    methods: {
        campusItemOnClick(campus) {
            console.log('[DEBUG] choosed campus: ', campus)
            var pages = getCurrentPages();
            var prevPage = pages[pages.length - 2];
            prevPage.$vm.setSelectedCampus(campus);
            uni.navigateBack();
        },

        onSearchContentChangeImpl(content) {
            console.log('search content: ', content)
            this.refreshCampusListToShow(content)
        },

        onSearchContentChange(content) {
            if (content == "") {
                return
            }
            this.$u.debounce(() => this.onSearchContentChangeImpl(content))
        },

        async refreshCampusListToShow(keyword) {
            var campusFullList = await api.getCampusList(keyword)
            this.campusListToShow = this.clipCampusList(campusFullList)
        },

        clipCampusList(campusList) {
            var clippedCampusList = []
            var i
            for (i in campusList) {
                var campus = campusList[i]
                clippedCampusList.push({ id: campus.id, name: campus.name })
            }
            return clippedCampusList
        }
    }
}
</script>

<style>

</style>
