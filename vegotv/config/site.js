module.exports = {
	title: 'VegoTV',
	key: '',
	desc: '中国海量的正版高清视频聚集地，你想看的都在这里VegoTV！收看中国节目再也不用翻墙了',
	keywords: '海外视频, 海量视频, 视频, VegoTV, 高清, 正版, 中国节目, 浙江卫视, 湖南卫视, 新歌声, 快乐大本营, 天天向上, 爸爸去哪儿, 十二道锋味, 跑男',
	video_notice: '',
  boss_notice: '',
	mail_from: '',
	mail_auth:{
		user: '',
 		pass: ''
 	},
	opened: true,
	"mongo":{
		"options":{
			"db": { "native_parser": true },
			"server": {
				"poolSize": 10,
				"socketOptions": { "keepAlive": 0 }
			}
		}
	}
}