<template>
	<view>
		<view class="content" @touchstart="hideDrawer">
			<scroll-view class="msg-list" scroll-y="true" :scroll-with-animation="scrollAnimation"
				:scroll-top="scrollTop" :scroll-into-view="scrollToView" @scrolltoupper="loadHistory"
				@scrolltolower="scrolltolowerCallback" @scroll="scrollCallback" upper-threshold="50"
				:style="{ bottom: scrollViewBottom + 'px' }">
				<!-- 加载历史数据waitingUI -->
				<view class="loading" v-if="isHistoryLoading">
					<view class="spinner">
						<view class="rect1"></view>
						<view class="rect2"></view>
						<view class="rect3"></view>
						<view class="rect4"></view>
						<view class="rect5"></view>
					</view>
				</view>
				<view class="row" v-for="(item, index) in msgList" :key="index" :id="generateMessageViewID(item.ID)">
					<!-- 用户消息 -->
					<view class="centerAlign time" v-if="item.shouldShowTime">{{
							timeFliter(item.time)
					}}</view>
					<block>
						<!-- 自己发出的消息 -->
						<view class="my" v-if="item.flow == 'out'">
							<!-- 左-消息 -->
							<view class="left">
								<!-- 文字消息 -->
								<view v-if="item.type == TIM.TYPES.MSG_TEXT" class="bubble">
									<rich-text :nodes="nodesFliter(item.payload.text)"></rich-text>
								</view>
								<!-- 图片消息 -->
								<view v-else-if="item.type == TIM.TYPES.MSG_IMAGE" class="bubble">
									<image class="img" :src="item.payload.imageInfoArray[0].url" mode="aspectFit"
										@click="imagePreview(item.payload.imageInfoArray[0].url)"></image>
								</view>
							</view>
							<!-- 右-头像 -->
							<view class="right">
								<image :src="userInfo.avatar_url" mode="aspectFit"></image>
							</view>
						</view>
						<!-- 别人发出的消息 -->
						<view class="other" v-else>
							<!-- 左-头像 -->
							<view class="left">
								<image :src="toUserInfo.avatar_url" mode="aspectFit" @click="toUserAvatarOnClick">
								</image>
							</view>
							<!-- 右-用户名称-时间-消息 -->
							<view class="right">
								<!-- <view class="username">
									<view class="name">{{ toUserInfo.nickname }}</view>
									<view class="time">{{ timeFliter(item.time) }}</view>
								</view> -->

								<!-- 文字消息 -->
								<view v-if="item.type == TIM.TYPES.MSG_TEXT" class="bubble">
									<rich-text :nodes="nodesFliter(item.payload.text)"></rich-text>
								</view>
								<!-- 图片消息 -->
								<view v-else-if="item.type == TIM.TYPES.MSG_IMAGE" class="bubble">
									<image :src="item.payload.imageInfoArray[0].url" mode="aspectFit"
										@click="imagePreview(item.payload.imageInfoArray[0].url)"></image>
								</view>
							</view>
						</view>
					</block>
				</view>
			</scroll-view>
		</view>
		<!-- 抽屉栏 -->
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
						<!-- <textarea :show-confirm-bar="inputTextShowConfirmBar" auto-height="true" v-model="textMsg"
							@focus="textareaFocus" @blur="blurTextarea" /> -->
						<input class="text-input" type="text" adjust-position="false" confirm-type="send"
							@confirm="sendText" v-model="textMsg" @focus="textareaFocus" @blur="blurTextarea" />
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
			<!-- <view class="send" :class="isVoice ? 'hidden' : ''" @tap="sendText">
				<view class="btn">发送</view>
			</view> -->
		</view>
		<!-- 录音UI效果 -->
		<view class="record" :class="recording ? '' : 'hidden'">
			<view class="ing" :class="willStop ? 'hidden' : ''">
				<view class="icon luyin2"></view>
			</view>
			<view class="cancel" :class="willStop ? '' : 'hidden'">
				<view class="icon chehui"></view>
			</view>
			<view class="tis" :class="willStop ? 'change' : ''">{{ recordTis }}</view>
		</view>
		<!-- 红包弹窗 -->
		<view class="windows" :class="windowsState">
			<!-- 遮罩层 -->
			<view class="mask" @touchmove.stop.prevent="discard" @tap="closeRedEnvelope"></view>
			<view class="layer" @touchmove.stop.prevent="discard">
				<view class="open-redenvelope">
					<view class="top">
						<view class="close-btn">
							<view class="icon close" @tap="closeRedEnvelope"></view>
						</view>
					</view>
					<view class="from">来自{{ redenvelopeData.from }}</view>
					<view class="blessing">{{ redenvelopeData.blessing }}</view>
					<view class="money">{{ redenvelopeData.money }}</view>
					<view class="showDetails" @tap="toDetails(redenvelopeData.rid)">
						查看领取详情 <view class="icon to"></view>
					</view>
				</view>
			</view>

		</view>
	</view>
</template>

<script>
import { mapState } from "vuex";
import { api } from '@/config/api.js';
import { utils } from '@/common/common.js';

const TIM_MESSAGE_TYPE = {
	"TEXT": 1,
	"IMAGE": 2,
	"VOICE": 3,
}

export default {
	data() {
		return {
			scrollViewBottom: 0,
			inputBottom: 2,
			inputTextShowConfirmBar: false,
			browsingHistoryMessage: false,

			//TIM变量
			conversationActive_: null,
			toUserId_: '',
			toUserInfo: null,
			userInfo: null,
			nextReqMessageID: '',
			count: 15,
			isCompleted: '',
			msgList: [],
			TIM: null,

			lastTimestampShowed: 0,

			//文字消息
			textMsg: '',
			//消息列表
			isHistoryLoading: false,
			scrollAnimation: false,
			scrollTop: 0,
			scrollToView: '',
			scrollHeight: 0,

			msgImgList: [],
			myuid: 0,

			//录音相关参数
			// #ifndef H5
			//H5不能录音
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
			//红包相关参数
			windowsState: '',
			redenvelopeData: {
				rid: null,	//红包ID
				from: null,
				face: null,
				blessing: null,
				money: null
			}
		};
	},
	computed: {
		...mapState({
			currentMessageList: state => state.currentMessageList,
		})
	},
	watch: {
		currentMessageList(newVal, oldVal) {
			this.msgList = newVal
			for (let i = 0; i < this.msgList.length; i++) {
				this.msgList[i].shouldShowTime = this.shouldShowTime(this.msgList[i].time)
			}
			this.screenMsg(newVal, oldVal)
		},
	},
	async onLoad(option) {
		this.inputBottom = getApp().globalData.safeAreaHeight;
		this.scrollViewBottom = uni.upx2px(100) + this.inputBottom;

		this.userInfo = this.$store.state.vuex_user
		console.log('[DEBUG] self userinfo: ', this.userInfo)
		// this.userInfo = JSON.parse(uni.getStorageSync('userInfo'))
		this.toUserId_ = this.$store.state.toUserId.toString()
		this.conversationActive_ = this.$store.state.conversationActive
		console.log('[DEBUG] conversationActive_: ', this.conversationActive_)
		this.TIM = this.$TIM

		//获取聊天对象的用户信息
		const resp = await api.getUserInfoFromServer({ user_id: this.toUserId_ })
		this.toUserInfo = resp.data
		uni.setNavigationBarTitle({
			title: this.toUserInfo.nickname
		})
		console.log('[DEBUG] toUserInfo: ', this.toUserInfo)

		this.getMsgList();
		//语音自然播放结束
		this.AUDIO.onEnded((res) => {
			this.playMsgid = null;
		});
		// #ifndef H5
		//录音开始事件
		this.RECORDER.onStart((e) => {
			this.recordBegin(e);
		})
		//录音结束事件
		this.RECORDER.onStop((e) => {
			this.recordEnd(e);
		})
		// #endif
	},
	onShow() {
		this.scrollTop = 9999999;
	},
	onUnload() {
		//退出页面 将所有的会话内的消息设置为已读

		this.$store.state.conversationActive.historyMessageLoaded = false;
	},
	methods: {
		toUserAvatarOnClick() {
			let userInfo = JSON.stringify(this.toUserInfo);
			uni.navigateTo({ url: '/page_subject/pages/user_info_detail?userInfo=' + userInfo })
		},

		scrollCallback(e) {
			// scroll upper
			if (e.detail.deltaY > 0) {
				this.browsingHistoryMessage = true
			}
		},

		scrolltolowerCallback() {
			console.log('[DEBUG] scroll to bottom')
			this.browsingHistoryMessage = false
		},

		shouldShowTime(seconds) {
			const GAP = 5 * 60;

			let lastTimestampShowed = this.lastTimestampShowed
			this.lastTimestampShowed = seconds;
			if (Math.abs(seconds - lastTimestampShowed) < GAP) {
				return false;
			}
			return true;
		},

		//聊天的节点加上外层的div
		nodesFliter(str) {
			let nodeStr = '<div style="align-items: center;word-wrap:break-word;">' + str + '</div>'
			return nodeStr
		},
		//时间过滤
		timeFliter(timer) {
			let timeData = new Date(timer * 1000)
			let str = this.$commen.dateTimeFliter(timeData)
			return str
		},

		keepScrollViewPosition() {
			this.$nextTick(async () => {
				const query = uni.createSelectorQuery().in(this)
				query
					.select('.msg-list')
					.boundingClientRect(data => {
						// data.height 为已经渲染的聊天列表内容高度
						// this.scrollHeight 为上一次聊天列表内容高度, 如果当前为第一次, 那么this.scrollHeight应该为0
						// 设置滚动条的高度
						this.scrollTop = data.height - this.scrollHeight
						// (注意: 如果在模板中, upper-threshold设置的值不为0, 为50, 那么可以加上该值), 如:
						// this.scrollTop = data.height - this.scrollHeight + 50
						// 将本次列表渲染后的内容高度记录下来, 方便下次加载时使用
						this.scrollHeight = data.height
					})
					.exec()
			})
		},

		// 接受消息(定位消息)
		screenMsg(newVal, oldVal) {

			if (newVal && oldVal && newVal.length == oldVal.length) { return; }

			// load first batch of history message
			if ((!oldVal || oldVal.length == 0) && newVal) {
				this.$nextTick(() => { this.scrollToView = this.generateMessageViewID(newVal[newVal.length - 1].ID) });
				return
			}

			if (oldVal && newVal && newVal.length > oldVal.length) {
				if (newVal[newVal.length - 1].ID == oldVal[oldVal.length - 1].ID) {
					// hit top and load history message
					this.keepScrollViewPosition();
					return;
				} else {
					if (newVal[newVal.length - 1].flow == "out" || !this.browsingHistoryMessage) {
						// sent a new message || not browsing history messages
						this.$nextTick(() => { this.scrollToView = this.generateMessageViewID(newVal[newVal.length - 1].ID) });
					} else {
						// comming a new message but user is browsing history messages
					}
				}
			}
		},
		//触发滑动到顶部(加载历史信息记录)
		async loadHistory(e) {
			// 更多消息列表
			this.isHistoryLoading = true
			let lastLatestMessageID = this.nextReqMessageID

			let conversationID = this.conversationActive_.conversationID
			const resp = await api.getHistoryMessageList(conversationID, this.count, this.nextReqMessageID);
			if (resp.code != api.SUCCESS_CODE) {
				this.isHistoryLoading = false;
				console.log('[ERROR] getHistoryMessageList fail')
				return;
			}
			const timMessageList = utils.myMessageListToTIMMessageList(resp.data.message_list, this.$store.state.vuex_user.id, this.$TIM)
			console.log("[DEBUG] timMessageList: ", timMessageList)
			this.$store.commit('unshiftCurrentMessageList', timMessageList)
			this.nextReqMessageID = resp.data.next_request_message_id // 用于续拉，分页续拉时需传入该字段。
			this.isCompleted = resp.data.is_complete
			console.log("[DEBUG] hit top trigger load more history")

			console.log('[DEBUG] scroll to message ', lastLatestMessageID)
			this.scrollToView = this.generateMessageViewID(lastLatestMessageID)
			// if (lastLatestMessageID > 0) {
			// 	//这段代码很重要，不然每次加载历史数据都会跳到顶部
			// 	this.$nextTick(function () {
			// 		this.scrollToView = this.generateMessageViewID(this.nextReqMessageID);//跳转上次的第一行信息位置
			// 		this.$nextTick(function () {
			// 			this.scrollAnimation = true;//恢复滚动动画
			// 		});

			// 	});
			// }
			this.isHistoryLoading = false;
		},

		// 加载初始页面消息
		async getMsgList() {
			// 历史消息列表
			this.isHistoryLoading = true
			let conversationID = this.conversationActive_.conversationID
			const resp = await api.getHistoryMessageListFromBeginning(conversationID, this.count);
			if (resp.code != api.SUCCESS_CODE) {
				this.isHistoryLoading = false;
				console.log('[ERROR] getHistoryMessageListFromBeginning fail')
				return;
			}
			const timMessageList = utils.myMessageListToTIMMessageList(resp.data.message_list, this.$store.state.vuex_user.id, this.$TIM)
			console.log("[DEBUG] timMessageList: ", timMessageList)
			this.$store.commit('pushCurrentMessageList', timMessageList)
			this.nextReqMessageID = resp.data.next_request_message_id // 用于续拉，分页续拉时需传入该字段。
			this.isCompleted = resp.data.is_complete
			if (timMessageList.length <= 0) { return }
			this.scrollToView = this.generateMessageViewID(timMessageList[timMessageList.length - 1].ID)
			console.log(this.nextReqMessageID)
			console.log("[DEBUG] load latest history")

			// // 滚动到底部
			// this.$nextTick(function () {
			// 	//进入页面滚动到底部
			// 	this.scrollTop = 9999;
			// 	this.$nextTick(function () {
			// 		this.scrollAnimation = true;
			// 	});
			// });
			this.isHistoryLoading = false;

			let ret = await utils.ackLastRecvMessage(resp.data.message_list, this.$store.state.vuex_user.id)
			if (!ret) { return; }
			this.$store.state.conversationActive.historyMessageLoaded = true;
		},
		//处理图片尺寸，如果不处理宽高，新进入页面加载图片时候会闪
		setPicSize(content) {
			// 让图片最长边等于设置的最大长度，短边等比例缩小，图片控件真实改变，区别于aspectFit方式。
			let maxW = uni.upx2px(350);//350是定义消息图片最大宽度
			let maxH = uni.upx2px(350);//350是定义消息图片最大高度
			if (content.w > maxW || content.h > maxH) {
				let scale = content.w / content.h;
				content.w = scale > 1 ? maxW : maxH * scale;
				content.h = scale > 1 ? maxW / scale : maxH;
			}
			return content;
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
		// 打开抽屉
		openDrawer() {
			this.popupLayerClass = 'showLayer';
			this.inputBottom = 0;
		},
		// 隐藏抽屉
		hideDrawer() {
			this.popupLayerClass = '';
			this.inputBottom = getApp().globalData.safeAreaHeight;
			setTimeout(() => {
				this.hideMore = true;
				this.hideEmoji = true;
			}, 150);
		},
		// 选择图片发送
		chooseImage() {
			this.getImage('album');
		},
		//拍照发送
		camera() {
			this.getImage('camera');
		},
		//发红包
		handRedEnvelopes() {
			uni.navigateTo({
				url: 'HM-hand/HM-hand'
			});
			this.hideDrawer();
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
						const imageFilePath = res.tempFilePaths[i]
						this.sendMsg(imageFilePath, TIM_MESSAGE_TYPE.IMAGE);
						console.log('[DEBUG] sending image message: ', imageFilePath)
					}
				}
			});
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
		//添加表情
		addEmoji(em) {
			this.textMsg += em.alt;
		},

		//获取焦点，如果不是选表情ing,则关闭抽屉
		textareaFocus(e) {
			if (this.popupLayerClass == 'showLayer' && this.hideMore == false) {
				this.hideDrawer();
			}
			// this.inputBottom = e.detail.height;
		},
		blurTextarea(e) {
			this.inputBottom = getApp().globalData.safeAreaHeight;
		},
		// 发送文字消息
		sendText() {
			this.hideDrawer();//隐藏抽屉
			if (!this.textMsg) {
				return;
			}
			let content = this.replaceEmoji(this.textMsg);
			this.sendMsg(content, TIM_MESSAGE_TYPE.TEXT);
			this.textMsg = '';//清空输入框
		},
		//替换表情符号为图片
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

		// 发送消息
		async sendMsg(content, type) {
			let message = {
				"from_user_id": this.$store.state.vuex_user.id,
				"to_user_id": this.toUserId_,
				"payload": "",
				"type": "",
				"conversation_id": this.conversationActive_.conversationID
			}

			if (type == TIM_MESSAGE_TYPE.TEXT) {
				message.type = "TEXT"
				message.payload = content
			} else if (type == TIM_MESSAGE_TYPE.IMAGE) {
				message.type = "IMAGE"
				const resp = await api.uploadImage(0, content)
				if (resp.code != api.SUCCESS_CODE) { return; }
				message.payload = resp.data.image_urls
			} else {
				throw "unsupported TIM message type: " + type
			}

			uni.showLoading({
				title: '发送中',
			});
			console.log('[DEBUG] sending message: ', message)
			const resp = await api.sendMessage(message)
			uni.hideLoading();
			if (resp.code != api.SUCCESS_CODE) {
				uni.showToast({
					title: '发送失败',
					icon: "fail",
					duration: 1000,
				})
				return;
			}
			this.scrollToView = this.generateMessageViewID(resp.data.message_id)
			let timMessage = utils.myMessageToTIMMessage(message, this.$store.state.vuex_user.id, this.$TIM)
			timMessage.time = new Date().getTime() / 1000;
			timMessage.ID = resp.data.message_id
			console.log('[DEBUG] sent tim message: ', timMessage)
			this.$store.commit('pushCurrentMessageList', timMessage)
		},

		generateMessageViewID(messageID) {
			return "messageID-" + messageID
		},

		// 添加文字消息到列表
		addTextMsg(msg) {
			this.msgList.push(msg);
		},
		// 添加语音消息到列表
		addVoiceMsg(msg) {
			this.msgList.push(msg);
		},
		// 添加图片消息到列表
		addImgMsg(msg) {
			msg.msg.content = this.setPicSize(msg.msg.content);
			this.msgImgList.push(msg.msg.content.url);
			this.msgList.push(msg);
		},
		addRedEnvelopeMsg(msg) {
			this.msgList.push(msg);
		},
		// 添加系统文字消息到列表
		addSystemTextMsg(msg) {
			this.msgList.push(msg);
		},
		// 添加系统红包消息到列表
		addSystemRedEnvelopeMsg(msg) {
			this.msgList.push(msg);
		},
		// 打开红包
		openRedEnvelope(msg, index) {
			let rid = msg.content.rid;
			uni.showLoading({
				title: '加载中...'
			});
			console.log("index: " + index);
			//模拟请求服务器效果
			setTimeout(() => {
				//加载数据
				if (rid == 0) {
					this.redenvelopeData = {
						rid: 0,	//红包ID
						from: "大黑哥",
						face: "/static/img/im/face/face.jpg",
						blessing: "恭喜发财，大吉大利",
						money: "已领完"
					}
				} else {
					this.redenvelopeData = {
						rid: 1,	//红包ID
						from: "售后客服008",
						face: "/static/img/im/face/face_2.jpg",
						blessing: "恭喜发财",
						money: "0.01"
					}
					if (!msg.content.isReceived) {
						// {type:"system",msg:{id:8,type:"redEnvelope",content:{text:"你领取了售后客服008的红包"}}},
						this.sendSystemMsg({ text: "你领取了" + (msg.userinfo.uid == this.myuid ? "自己" : msg.userinfo.username) + "的红包" }, 'redEnvelope');
						console.log("this.msgList[index]: " + JSON.stringify(this.msgList[index]));
						this.msgList[index].msg.content.isReceived = true;
					}
				}
				uni.hideLoading();
				this.windowsState = 'show';

			}, 200)
		},

		// 关闭红包弹窗
		closeRedEnvelope() {
			this.windowsState = 'hide';
			setTimeout(() => {
				this.windowsState = '';
			}, 200)
		},
		sendSystemMsg(content, type) {
			let lastid = this.msgList[this.msgList.length - 1].msg.id;
			lastid++;
			let row = { type: "system", msg: { id: lastid, type: type, content: content } };
			this.screenMsg(row)
		},
		//领取详情
		toDetails(rid) {
			uni.navigateTo({
				url: 'HM-details/HM-details?rid=' + rid
			})
		},
		// 预览图片
		showPic(msg) {
			uni.previewImage({
				indicator: "none",
				current: msg.content.url,
				urls: this.msgImgList
			});
		},
		// 播放语音
		playVoice(msg) {
			this.playMsgid = msg.id;
			this.AUDIO.src = msg.content.url;
			this.$nextTick(function () {
				this.AUDIO.play();
			});
		},
		// 录音开始
		voiceBegin(e) {
			if (e.touches.length > 1) {
				return;
			}
			this.initPoint.Y = e.touches[0].clientY;
			this.initPoint.identifier = e.touches[0].identifier;
			this.RECORDER.start({ format: "mp3" });//录音开始,
		},
		//录音开始UI效果
		recordBegin(e) {
			this.recording = true;
			this.voiceTis = '松开 结束';
			this.recordLength = 0;
			this.recordTimer = setInterval(() => {
				this.recordLength++;
			}, 1000)
		},
		// 录音被打断
		voiceCancel() {
			this.recording = false;
			this.voiceTis = '按住 说话';
			this.recordTis = '手指上滑 取消发送'
			this.willStop = true;//不发送录音
			this.RECORDER.stop();//录音结束
		},
		// 录音中(判断是否触发上滑取消发送)
		voiceIng(e) {
			if (!this.recording) {
				return;
			}
			let touche = e.touches[0];
			//上滑一个导航栏的高度触发上滑取消发送
			if (this.initPoint.Y - touche.clientY >= uni.upx2px(100)) {
				this.willStop = true;
				this.recordTis = '松开手指 取消发送'
			} else {
				this.willStop = false;
				this.recordTis = '手指上滑 取消发送'
			}
		},
		// 结束录音
		voiceEnd(e) {
			if (!this.recording) {
				return;
			}
			this.recording = false;
			this.voiceTis = '按住 说话';
			this.recordTis = '手指上滑 取消发送'
			this.RECORDER.stop();//录音结束
		},
		//录音结束(回调文件)
		recordEnd(e) {
			clearInterval(this.recordTimer);
			if (!this.willStop) {
				console.log("e: " + JSON.stringify(e));
				let msg = {
					length: 0,
					url: e.tempFilePath
				}
				let min = parseInt(this.recordLength / 60);
				let sec = this.recordLength % 60;
				min = min < 10 ? '0' + min : min;
				sec = sec < 10 ? '0' + sec : sec;
				msg.length = min + ':' + sec;
				this.sendMsg(msg, TIM_MESSAGE_TYPE.VOICE);
			} else {
				console.log('取消发送录音');
			}
			this.willStop = false;
		},
		// 切换语音/文字输入
		switchVoice() {
			this.hideDrawer();
			this.isVoice = this.isVoice ? false : true;
		},

		imagePreview(imageURL) {
			uni.previewImage({
				indicator: "number",
				loop: true,
				urls: [imageURL],
			})
		},

		discard() {
			return;
		}
	}
}
</script>
<style lang="scss">
@import "@/static/HM-chat/css/style.scss";

.time {
	color: #8f8f94;
	font-size: small;
}

.text-input {
	width: 100%;
}
</style>
