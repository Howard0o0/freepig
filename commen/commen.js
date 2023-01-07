const commen = {}


commen.emojiList = [
	[{ "url": "1.png", "alt": "[1]" }, { "url": "2.png", "alt": "[2]" }, { "url": "3.png", "alt": "[3]" }, { "url": "4.png", "alt": "[4]" }, { "url": "5.png", "alt": "[5]" }, { "url": "6.png", "alt": "[6]" }, { "url": "7.png", "alt": "[7]" }, { "url": "8.png", "alt": "[8]" }, { "url": "9.png", "alt": "[9]" }, { "url": "10.png", "alt": "[10]" }, { "url": "11.png", "alt": "[11]" }, { "url": "12.png", "alt": "[12]" }, { "url": "13.png", "alt": "[13]" }, { "url": "14.png", "alt": "[14]" }, { "url": "15.png", "alt": "[15]" }, { "url": "16.png", "alt": "[16]" }, { "url": "17.png", "alt": "[17]" }, { "url": "18.png", "alt": "[18]" }, { "url": "19.png", "alt": "[19]" }, { "url": "20.png", "alt": "[20]" }, { "url": "21.png", "alt": "[21]" }, { "url": "22.png", "alt": "[22]" }, { "url": "23.png", "alt": "[23]" }, { "url": "24.png", "alt": "[24]" }, { "url": "25.png", "alt": "[25]" }, { "url": "26.png", "alt": "[26]" }, { "url": "27.png", "alt": "[27]" }, { "url": "28.png", "alt": "[28]" }, { "url": "29.png", "alt": "[29]" }, { "url": "30.png", "alt": "[30]" }, { "url": "31.png", "alt": "[31]" }, { "url": "32.png", "alt": "[32]" }, { "url": "33.png", "alt": "[33]" }, { "url": "34.png", "alt": "[34]" }, { "url": "35.png", "alt": "[35]" }, { "url": "36.png", "alt": "[36]" }, { "url": "37.png", "alt": "[37]" }, { "url": "38.png", "alt": "[38]" }, { "url": "39.png", "alt": "[39]" }],
]

/**@dateTimeFliter 转换格林日期时间格式为常用日期格式
 * @time[必填] 						Date  		格林日期格式
 * @part[可选,默认:0]				Number      选择返回日期时间部分  列:0:返回所有 1:只返回日期  2:只返回时间
 * @dateComplete[可选,默认:true] 	Boolean 	日期位数不足是否添0补齐:true:补齐,false:不补齐
 * @timeComplete[可选,默认:true] 	Boolean 	时间位数不足是否添0补齐:true:补齐,false:不补齐
 * @dateConnector[可选,默认:-] 		String 		年月日连接符  例: - : /
 * @timeConnector[可选,默认::] 		String 		时间连接符   例: - : /
 * @hour12[可选,默认:false]          Boolean     是否返回12小时制时间   例: true:返回12小时制时间   false:返回24小时制时间
 * @return   '2019-11-25 15:05:54'  String    返回示例
 * **/
commen.dateTimeFliter = function (time, part = 0, dateComplete = true, timeComplete = true, dateConnector = '-',
	timeConnector = ':', hour12 = false) {
	let year = time.getFullYear()
	let month = time.getMonth() + 1
	let day = time.getDate()
	let hour = time.getHours()
	let minute = time.getMinutes()
	let second = time.getSeconds()
	let dateStr = ''
	let timeStr = ''
	//转换日期
	if (dateComplete) { //添0补齐
		if (month < 10) {
			month = '0' + month
		}
		if (day < 10) {
			day = '0' + day
		}
	}
	dateStr = year + dateConnector + month + dateConnector + day
	//转换时间
	//修改小时制
	if (hour12) {
		if (hour > 12) {
			hour = hour - 12
			if (timeComplete) {
				if (hour < 10) {
					hour = '下午 ' + '0' + hour
				} else {
					hour = '下午 ' + hour
				}
			}
		} else {
			if (timeComplete) {
				if (hour < 10) {
					hour = '上午 ' + '0' + hour
				} else {
					hour = '上午 ' + hour
				}
			}
		}
	}
	//判断分钟与秒
	if (timeComplete) { //添0补齐
		if (minute < 10) {
			minute = '0' + minute
		}
		if (second < 10) {
			second = '0' + second
		}
	}
	timeStr = hour + timeConnector + minute + timeConnector + second
	//合成输出值
	if (part == 0) {
		return dateStr + ' ' + timeStr
	} else if (part == 1) {
		return dateStr
	} else if (part == 2) {
		return timeStr
	}
	return '传参有误'
}



export default commen
