<template>
    <view>
        <u-search placeholder="可输入学校关键字" @change="onSearchContentChange" :showAction="false"></u-search>
        <uni-list>
            <uni-list-item v-for="(item,index) in majorListToShow" :key="index" :title="item.name" clickable
                @click="majorItemOnClick(item)"></uni-list-item>
        </uni-list>
    </view>
</template>

<script>

import { api } from '../../config/api.js';

export default {
    data() {
        return {
            majorListToShow: [],
            fullMajorList: [],
        }
    },

    async onLoad(options) {
        this.fullMajorList = JSON.parse(options.major_list);
        this.majorListToShow = this.fullMajorList
        console.log('[DEBUG] major_list: ', this.majorListToShow)
    },

    methods: {
        majorItemOnClick(major) {
            console.log('[DEBUG] choosed major: ', major)
            var pages = getCurrentPages();
            var prevPage = pages[pages.length - 2];
            prevPage.$vm.setSelectedMajor(major);
            uni.navigateBack();
        },

        onSearchContentChangeImpl(content) {
            console.log('search content: ', content)
            this.refreshMajorListToShow(content)
        },

        onSearchContentChange(content) {
            this.$u.debounce(() => this.onSearchContentChangeImpl(content), 500, false)
        },

        refreshMajorListToShow(keyword) {
            this.majorListToShow = this.clipMajorList(this.fullMajorList, keyword)
        },

        clipMajorList(majorList, keyword) {
            var clippedMajorList = []
            var i
            for (i in majorList) {
                var major = majorList[i]
                if (major.name.indexOf(keyword) == -1) { continue; }
                clippedMajorList.push({ id: major.id, name: major.name })
            }
            return clippedMajorList
        }
    }
}
</script>

<style>

</style>
