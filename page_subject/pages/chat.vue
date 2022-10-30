<template>
    <view>
        <view class="tips color_fff size_12 align_c" :class="{ 'show': ajax.loading }" @tap="getHistoryMsg">
            {{ ajax.loadText }}</view>
        <view class="box-1" id="list-box">
            <view class="talk-list">
                <scroll-view scroll-y="true" :scroll-with-animation="true"
                    :style="[{ height: style.contentViewHeight + 'px', bottom: scrollViewBottom + 'px' }]">
                    <view v-for="(item, index) in talkList" :key="index" :id="`msg-${item.id}`">
                        <view class="item flex_col" :class="item.type == 1 ? 'push' : 'pull'">
                            <image :src="item.pic" mode="aspectFill" class="pic"></image>
                            <view class="content">{{ item.content }}</view>
                        </view>
                    </view>
                </scroll-view>
            </view>
        </view>

        <view class="popup-layer" :class="popupLayerClass" @touchmove.stop.prevent="discard">
            <!-- 表情 -->
            <swiper class="emoji-swiper" :class="{ hidden: hideEmoji }" indicator-dots="true" duration="150">
                <swiper-item v-for="(page, pid) in emojiList" :key="pid">
                    <view v-for="(em, eid) in page" :key="eid" @tap="addEmoji(em)">
                        <image :src="'/static/img/emoji/' + em.url" mode="aspectFit"></image>
                    </view>
                </swiper-item>
            </swiper>
            <!-- 更多功能 相册-拍照 -->
            <view class="more-layer" :class="{ hidden: hideMore }">
                <view class="list">
                    <view class="box" @tap="chooseImage">
                        <view class="icon tupian2"></view>
                    </view>
                    <view class="box" @tap="camera">
                        <view class="icon paizhao"></view>
                    </view>
                </view>
            </view>
        </view>
        <!-- 底部输入栏 -->
        <view class="input-box" :class="popupLayerClass" @touchmove.stop.prevent="discard"
            :style="{ bottom: inputBottom + 'px' }">
            <!-- H5下不能录音，输入栏布局改动一下 -->
            <!-- #ifdef H5 -->
            <view class="more" @tap="showMore">
                <view class="icon add"></view>
            </view>
            <!-- #endif -->
            <view class="textbox">
                <view class="text-mode" :class="isVoice ? 'hidden' : ''">
                    <view class="box">
                        <textarea :show-confirm-bar="inputTextShowConfirmBar" auto-height="true" v-model="textMsg"
                            @focus="textareaFocus" @blur="blurTextarea" />
                    </view>
                    <view class="em" @tap="chooseEmoji">
                        <view class="icon biaoqing"></view>
                    </view>
                </view>
            </view>
            <!-- #ifndef H5 -->
            <view class="more" @tap="showMore">
                <view class="icon add"></view>
            </view>
            <!-- #endif -->
            <view class="send" :class="isVoice ? 'hidden' : ''" @tap="sendText">
                <view class="btn">发送</view>
            </view>
        </view>

        <!-- <view class="box-2">
            <view class="flex_col">
                <view class="flex_grow">
                    <input type="text" class="content" v-model="content" placeholder="请输入聊天内容"
                        placeholder-style="color:#DDD;" :cursor-spacing="6">
                </view>
                <button class="send" @tap="send">发送</button>
            </view>
        </view> -->
    </view>
</template>

<script>
import tuiBubblePopup from "@/components/thorui/tui-bubble-popup/tui-bubble-popup.vue"
export default {
    components: {
        tuiBubblePopup
    },
    data() {
        return {
            talkList: [],
            ajax: {
                rows: 20,	//每页数量
                page: 1,	//页码
                flag: true,	// 请求开关
                loading: true,	// 加载中
                loadText: '正在获取消息'
            },
            content: '',

            // #ifndef H5
            //H5不能录音
            inputBottom: 2,
            scrollViewBottom: 0,
            textMsg: "",
            inputTextShowConfirmBar: false,
            RECORDER: uni.getRecorderManager(),
            // #endif
            isVoice: false,
            voiceTis: '按住 说话',
            recordTis: "手指上滑 取消发送",
            recording: false,
            willStop: false,
            initPoint: { identifier: 0, Y: 0 },
            recordTimer: null,
            recordLength: 0,

            //播放语音相关参数
            AUDIO: uni.createInnerAudioContext(),
            playMsgid: null,
            VoiceTimer: null,
            // 抽屉参数
            popupLayerClass: '',
            // more参数
            hideMore: true,
            //表情定义
            hideEmoji: true,
            emojiList: this.$commen.emojiList,
            //表情图片图床名称 ，由于我上传的第三方图床名称会有改变，所以有此数据来做对应，您实际应用中应该不需要
            onlineEmoji: { "100.gif": "AbNQgA.gif", "101.gif": "AbN3ut.gif", "102.gif": "AbNM3d.gif", "103.gif": "AbN8DP.gif", "104.gif": "AbNljI.gif", "105.gif": "AbNtUS.gif", "106.gif": "AbNGHf.gif", "107.gif": "AbNYE8.gif", "108.gif": "AbNaCQ.gif", "109.gif": "AbNN4g.gif", "110.gif": "AbN0vn.gif", "111.gif": "AbNd3j.gif", "112.gif": "AbNsbV.gif", "113.gif": "AbNwgs.gif", "114.gif": "AbNrD0.gif", "115.gif": "AbNDuq.gif", "116.gif": "AbNg5F.gif", "117.gif": "AbN6ET.gif", "118.gif": "AbNcUU.gif", "119.gif": "AbNRC4.gif", "120.gif": "AbNhvR.gif", "121.gif": "AbNf29.gif", "122.gif": "AbNW8J.gif", "123.gif": "AbNob6.gif", "124.gif": "AbN5K1.gif", "125.gif": "AbNHUO.gif", "126.gif": "AbNIDx.gif", "127.gif": "AbN7VK.gif", "128.gif": "AbNb5D.gif", "129.gif": "AbNX2d.gif", "130.gif": "AbNLPe.gif", "131.gif": "AbNjxA.gif", "132.gif": "AbNO8H.gif", "133.gif": "AbNxKI.gif", "134.gif": "AbNzrt.gif", "135.gif": "AbU9Vf.gif", "136.gif": "AbUSqP.gif", "137.gif": "AbUCa8.gif", "138.gif": "AbUkGQ.gif", "139.gif": "AbUFPg.gif", "140.gif": "AbUPIS.gif", "141.gif": "AbUZMn.gif", "142.gif": "AbUExs.gif", "143.gif": "AbUA2j.gif", "144.gif": "AbUMIU.gif", "145.gif": "AbUerq.gif", "146.gif": "AbUKaT.gif", "147.gif": "AbUmq0.gif", "148.gif": "AbUuZV.gif", "149.gif": "AbUliF.gif", "150.gif": "AbU1G4.gif", "151.gif": "AbU8z9.gif", "152.gif": "AbU3RJ.gif", "153.gif": "AbUYs1.gif", "154.gif": "AbUJMR.gif", "155.gif": "AbUadK.gif", "156.gif": "AbUtqx.gif", "157.gif": "AbUUZ6.gif", "158.gif": "AbUBJe.gif", "159.gif": "AbUdIO.gif", "160.gif": "AbU0iD.gif", "161.gif": "AbUrzd.gif", "162.gif": "AbUDRH.gif", "163.gif": "AbUyQA.gif", "164.gif": "AbUWo8.gif", "165.gif": "AbU6sI.gif", "166.gif": "AbU2eP.gif", "167.gif": "AbUcLt.gif", "168.gif": "AbU4Jg.gif", "169.gif": "AbURdf.gif", "170.gif": "AbUhFS.gif", "171.gif": "AbU5WQ.gif", "172.gif": "AbULwV.gif", "173.gif": "AbUIzj.gif", "174.gif": "AbUTQs.gif", "175.gif": "AbU7yn.gif", "176.gif": "AbUqe0.gif", "177.gif": "AbUHLq.gif", "178.gif": "AbUOoT.gif", "179.gif": "AbUvYF.gif", "180.gif": "AbUjFU.gif", "181.gif": "AbaSSJ.gif", "182.gif": "AbUxW4.gif", "183.gif": "AbaCO1.gif", "184.gif": "Abapl9.gif", "185.gif": "Aba9yR.gif", "186.gif": "AbaFw6.gif", "187.gif": "Abaiex.gif", "188.gif": "AbakTK.gif", "189.gif": "AbaZfe.png", "190.gif": "AbaEFO.gif", "191.gif": "AbaVYD.gif", "192.gif": "AbamSH.gif", "193.gif": "AbaKOI.gif", "194.gif": "Abanld.gif", "195.gif": "Abau6A.gif", "196.gif": "AbaQmt.gif", "197.gif": "Abal0P.gif", "198.gif": "AbatpQ.gif", "199.gif": "Aba1Tf.gif", "200.png": "Aba8k8.png", "201.png": "AbaGtS.png", "202.png": "AbaJfg.png", "203.png": "AbaNlj.png", "204.png": "Abawmq.png", "205.png": "AbaU6s.png", "206.png": "AbaaXn.png", "207.png": "Aba000.png", "208.png": "AbarkT.png", "209.png": "AbastU.png", "210.png": "AbaB7V.png", "211.png": "Abafn1.png", "212.png": "Abacp4.png", "213.png": "AbayhF.png", "214.png": "Abag1J.png", "215.png": "Aba2c9.png", "216.png": "AbaRXR.png", "217.png": "Aba476.png", "218.png": "Abah0x.png", "219.png": "Abdg58.png" },
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.getHistoryMsg();
        });
    },
    onPageScroll(e) {
        if (e.scrollTop < 5) {
            this.getHistoryMsg();
        }
    },
    onLoad() {
        this.inputBottom = getApp().globalData.safeAreaHeight;
        this.scrollViewBottom = uni.upx2px(100) + this.inputBottom;
    },
    methods: {
        // 获取历史消息
        getHistoryMsg() {
            if (!this.ajax.flag) {
                return; //
            }

            // 此处用到 ES7 的 async/await 知识，为使代码更加优美。不懂的请自行学习。
            let get = async () => {
                this.hideLoadTips();
                this.ajax.flag = false;
                let data = await this.joinHistoryMsg();

                console.log('----- 模拟数据格式，供参考 -----');
                console.log(data);	// 查看请求返回的数据结构 

                // 获取待滚动元素选择器，解决插入数据后，滚动条定位时使用
                let selector = '';

                if (this.ajax.page > 1) {
                    // 非第一页，则取历史消息数据的第一条信息元素
                    selector = `#msg-${this.talkList[0].id}`;
                } else {
                    // 第一页，则取当前消息数据的最后一条信息元素
                    selector = `#msg-${data[data.length - 1].id}`;
                }

                // 将获取到的消息数据合并到消息数组中
                this.talkList = [...data, ...this.talkList];

                // 数据挂载后执行，不懂的请自行阅读 Vue.js 文档对 Vue.nextTick 函数说明。
                this.$nextTick(() => {
                    // 设置当前滚动的位置
                    this.setPageScrollTo(selector);

                    this.hideLoadTips(true);

                    if (data.length < this.ajax.rows) {
                        // 当前消息数据条数小于请求要求条数时，则无更多消息，不再允许请求。
                        // 可在此处编写无更多消息数据时的逻辑
                    } else {
                        this.ajax.page++;

                        // 延迟 200ms ，以保证设置窗口滚动已完成
                        setTimeout(() => {
                            this.ajax.flag = true;
                        }, 200)
                    }

                })
            }
            get();
        },
        // 拼接历史记录消息，正式项目可替换为请求历史记录接口
        joinHistoryMsg() {
            let join = () => {
                let arr = [];

                //通过当前页码及页数，模拟数据内容
                let startIndex = (this.ajax.page - 1) * this.ajax.rows;
                let endIndex = startIndex + this.ajax.rows;
                for (let i = startIndex; i < endIndex; i++) {
                    arr.push({
                        "id": i,	// 消息的ID
                        "content": `这是历史记录的第${i + 1}条消息`,	// 消息内容
                        "type": Math.random() > 0.5 ? 1 : 0,// 此为消息类别，设 1 为发出去的消息，0 为收到对方的消息,
                        "pic": "/static/logo.png"	// 头像
                    })
                }

                /*
                    颠倒数组中元素的顺序。将最新的数据排在本次接口返回数据的最后面。
                    后端接口按 消息的时间降序查找出当前页的数据后，再将本页数据按消息时间降序排序返回。
                    这是数据的重点，因为页面滚动条和上拉加载历史的问题。
                 */
                arr.reverse();

                return arr;
            }

            // 此处用到 ES6 的 Promise 知识，不懂的请自行学习。
            return new Promise((done, fail) => {
                // 无数据请求接口，由 setTimeout 模拟，正式项目替换为 ajax 即可。
                setTimeout(() => {
                    let data = join();
                    done(data);
                }, 1500);
            })
        },
        // 设置页面滚动位置
        setPageScrollTo(selector) {
            let view = uni.createSelectorQuery().in(this).select(selector);
            view.boundingClientRect((res) => {
                uni.pageScrollTo({
                    scrollTop: res.top - 30,	// -30 为多显示出大半个消息的高度，示意上面还有信息。
                    duration: 0
                });
            }).exec();
        },
        // 隐藏加载提示
        hideLoadTips(flag) {
            if (flag) {
                this.ajax.loadText = '消息获取成功';
                setTimeout(() => {
                    this.ajax.loading = false;
                }, 300);
            } else {
                this.ajax.loading = true;
                this.ajax.loadText = '正在获取消息';
            }
        },
        // 发送信息
        send() {
            if (!this.content) {
                uni.showToast({
                    title: '请输入有效的内容',
                    icon: 'none'
                })
                return;
            }

            uni.showLoading({
                title: '正在发送'
            })
            setTimeout(() => {
                uni.hideLoading();

                // 将当前发送信息 添加到消息列表。
                let data = {
                    "id": new Date().getTime(),
                    "content": this.content,
                    "type": 1,
                    "pic": "/static/logo.png"
                }
                this.talkList.push(data);

                this.$nextTick(() => {
                    // 清空内容框中的内容
                    this.content = '';
                    uni.pageScrollTo({
                        scrollTop: 999999,	// 设置一个超大值，以保证滚动条滚动到底部
                        duration: 0
                    });
                })
            }, 1500);
        },

        addEmoji(em) {
            this.textMsg += em.alt;
        },
        chooseImage() {
            this.getImage('album');
        },
        //拍照发送
        camera() {
            this.getImage('camera');
        },
        //选照片 or 拍照
        getImage(type) {
            this.hideDrawer();
            uni.chooseImage({
                count: 1,
                sourceType: [type],
                sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
                success: (res) => {
                    for (let i = 0; i < res.tempFilePaths.length; i++) {
                        uni.getImageInfo({
                            src: res.tempFilePaths[i],
                            success: (image) => {
                                console.log(image.width);
                                console.log(image.height);
                                let msg = { url: res.tempFilePaths[i], w: image.width, h: image.height };
                                this.sendMsg(res, TIM_MESSAGE_TYPE.IMAGE);
                                console.log('[DEBUG] sending message: ', res)
                            }
                        });
                    }
                }
            });
        },
        //获取焦点，如果不是选表情ing,则关闭抽屉
        textareaFocus(e) {
            if (this.popupLayerClass == 'showLayer' && this.hideMore == false) {
                this.hideDrawer();
            }
            this.inputBottom = e.detail.height;
        },
        blurTextarea(e) {
            this.inputBottom = getApp().globalData.safeAreaHeight;
        },
        // 选择表情
        chooseEmoji() {
            this.hideMore = true;
            if (this.hideEmoji) {
                this.hideEmoji = false;
                this.openDrawer();
            } else {
                this.hideDrawer();
            }
        },
        //更多功能(点击+弹出) 
        showMore() {
            this.isVoice = false;
            this.hideEmoji = true;
            if (this.hideMore) {
                this.hideMore = false;
                this.openDrawer();
            } else {
                this.hideDrawer();
            }
        },
        // 发送文字消息
        sendText() {
            this.hideDrawer();//隐藏抽屉
            if (!this.textMsg) {
                return;
            }

            let content = this.replaceEmoji(this.textMsg);
            let data = {
                "id": new Date().getTime(),
                "content": content,
                "type": 1,
                "pic": "/static/logo.png"
            }
            this.talkList.push(data);

            this.$nextTick(() => {
                // 清空内容框中的内容
                this.textMsg = '';//清空输入框
                uni.pageScrollTo({
                    scrollTop: 999999,	// 设置一个超大值，以保证滚动条滚动到底部
                    duration: 0
                });
            })
        },
        openDrawer() {
            this.popupLayerClass = 'showLayer';
        },
        // 隐藏抽屉
        hideDrawer() {
            this.popupLayerClass = '';
            setTimeout(() => {
                this.hideMore = true;
                this.hideEmoji = true;
            }, 150);
        },
        replaceEmoji(str) {
            let replacedStr = str.replace(/\[([^(\]|\[)]*)\]/g, (item, index) => {
                console.log("item: " + item);
                for (let i = 0; i < this.emojiList.length; i++) {
                    let row = this.emojiList[i];
                    for (let j = 0; j < row.length; j++) {
                        let EM = row[j];
                        if (EM.alt == item) {
                            //在线表情路径，图文混排必须使用网络路径，请上传一份表情到你的服务器后再替换此路径 
                            //比如你上传服务器后，你的100.gif路径为https://www.xxx.com/emoji/100.gif 则替换onlinePath填写为https://www.xxx.com/emoji/
                            let onlinePath = 'https://s2.ax1x.com/2019/04/12/'
                            let imgstr = '<img src="' + onlinePath + this.onlineEmoji[EM.url] + '">';
                            console.log("imgstr: " + imgstr);
                            return imgstr;
                        }
                    }
                }
            });
            return replacedStr;
        },
        nodesFliter(str) {
            let nodeStr = '<div style="align-items: center;word-wrap:break-word;">' + str + '</div>'
            return nodeStr
        },
    }
}
</script>

<style lang="scss">
@import "../../lib/global.scss";
@import "@/static/HM-chat/css/style.scss";

page {
    background-color: #F3F3F3;
    font-size: 28rpx;
}

/* 加载数据提示 */
.tips {
    position: fixed;
    left: 0;
    top: var(--window-top);
    width: 100%;
    z-index: 9;
    background-color: rgba(0, 0, 0, 0.15);
    height: 72rpx;
    line-height: 72rpx;
    transform: translateY(-80rpx);
    transition: transform 0.3s ease-in-out 0s;

    &.show {
        transform: translateY(0);
    }
}

.box-1 {
    width: 100%;
    height: auto;
    padding-bottom: 100rpx;
    box-sizing: content-box;

    /* 兼容iPhoneX */
    margin-bottom: 0;
    margin-bottom: constant(safe-area-inset-bottom);
    margin-bottom: env(safe-area-inset-bottom);
}

.box-2 {
    position: fixed;
    left: 0;
    width: 100%;
    bottom: 0;
    height: auto;
    z-index: 2;
    border-top: #e5e5e5 solid 1px;
    box-sizing: content-box;
    background-color: #F3F3F3;

    /* 兼容iPhoneX */
    padding-bottom: 0;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);

    >view {
        padding: 0 20rpx;
        height: 100rpx;
    }

    .content {
        background-color: #fff;
        height: 64rpx;
        padding: 0 20rpx;
        border-radius: 32rpx;
        font-size: 28rpx;
    }

    .send {
        background-color: #42b983;
        color: #fff;
        height: 64rpx;
        margin-left: 20rpx;
        border-radius: 32rpx;
        padding: 0;
        width: 120rpx;
        line-height: 62rpx;

        &:active {
            background-color: #5fc496;
        }
    }
}

.talk-list {
    padding-bottom: 20rpx;

    /* 消息项，基础类 */
    .item {
        padding: 20rpx 20rpx 0 20rpx;
        align-items: flex-start;
        align-content: flex-start;
        color: #333;

        .pic {
            width: 92rpx;
            height: 92rpx;
            border-radius: 50%;
            border: #fff solid 1px;
        }

        .content {
            padding: 20rpx;
            border-radius: 4px;
            max-width: 500rpx;
            word-break: break-all;
            line-height: 52rpx;
            position: relative;
        }

        /* 收到的消息 */
        &.pull {
            .content {
                margin-left: 32rpx;
                background-color: #fff;

                &::after {
                    content: '';
                    display: block;
                    width: 0;
                    height: 0;
                    border-top: 16rpx solid transparent;
                    border-bottom: 16rpx solid transparent;
                    border-right: 20rpx solid #fff;
                    position: absolute;
                    top: 30rpx;
                    left: -18rpx;
                }
            }
        }

        /* 发出的消息 */
        &.push {
            /* 主轴为水平方向，起点在右端。使不修改DOM结构，也能改变元素排列顺序 */
            flex-direction: row-reverse;

            .content {
                margin-right: 32rpx;
                background-color: #a0e959;

                &::after {
                    content: '';
                    display: block;
                    width: 0;
                    height: 0;
                    border-top: 16rpx solid transparent;
                    border-bottom: 16rpx solid transparent;
                    border-left: 20rpx solid #a0e959;
                    position: absolute;
                    top: 30rpx;
                    right: -18rpx;
                }
            }
        }
    }
}
</style>