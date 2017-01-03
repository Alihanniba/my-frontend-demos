var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
var parser  = require('ua-parser')
var sendmail = require('sendmail')()
var config = require(__dirname + '/../config/site')
/*
html video code:
	1 = MEDIA_ERR_ABORTED - fetching process aborted by user
	2 = MEDIA_ERR_NETWORK - error occurred when downloading
	3 = MEDIA_ERR_DECODE - error occurred when decoding
	4 = MEDIA_ERR_SRC_NOT_SUPPORTED - audio/video not supported
youtube code
	2 – 请求包含无效的参数值。例如，如果您指定的视频ID不足11个字符，或者如果视频ID包含无效字符（例如感叹号或星号），就会发生此错误。
	5 – 请求的内容无法在HTML5播放器中播放，或者发生了与HTML5播放器有关的其他错误。
	100 – 找不到所请求的视频。当视频已被移除（无论是何种原因）或者被标记为私有状态时，就会发生此错误。
	101 – 所请求的视频的所有者不允许在嵌入式播放器中播放此视频。
	150 – 此错误与101相同，实际就是变相的101错误！
android 
https://developer.android.com/reference/android/media/MediaPlayer.OnErrorListener.html
iOS
https://developer.apple.com/reference/avfoundation/1668907-av_foundation_error_constants/error_codes
*/

var CODES = {
	1: 'MEDIA_ERR_ABORTED - fetching process aborted by user',
	2: 'MEDIA_ERR_NETWORK - error occurred when downloading',
	3: 'MEDIA_ERR_DECODE - error occurred when decoding',
	4: 'MEDIA_ERR_SRC_NOT_SUPPORTED - audio/video not supported',
	5:	'请求的内容无法在HTML5播放器中播放，或者发生了与HTML5播放器有关的其他错误。',
	20: '请求包含无效的参数值。例如，如果您指定的视频ID不足11个字符，或者如果视频ID包含无效字符（例如感叹号或星号），就会发生此错误。',
	100: '找不到所请求的视频。当视频已被移除（无论是何种原因）或者被标记为私有状态时，就会发生此错误。',
	101: '所请求的视频的所有者不允许在嵌入式播放器中播放此视频。',
	150: '找不到所请求的视频。当视频已被移除（无论是何种原因）或者被标记为私有状态时，就会发生此错误。',
}


function youtubeID(url){
	var ID = null;
	var REG = /(?:youtube(?:-nocookie)?\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/i
	url = url.match(REG)
	if(url && url[1]) {
		ID = url[1];
	}
	return ID;
}

function send(id, ip, url, _from, code, referer, agent){
	if(!config.video_notice){
		return
	}
	var desc = CODES[code]
	if(code == 2 && youtubeID(url)){
		desc = code['20']
	}

	var nodemailer = require('nodemailer');

	// create reusable transporter object using the default SMTP transport
	var transporter = nodemailer.createTransport({
			host: 'smtp.mxhichina.com',
			port: 25,
			auth: config.mail_auth
	});

	var text = `视频播放出现错误:\n
视频 ID：${id}
客户端 IP：${ip}
网页：${referer}
视频地址：${url}
错误代码：${code}
错误描述：${desc}
来源：${_from}
Device： ${agent.device.family}
Family: ${agent.family}
OS：${agent.os.family}
User-Agent: ${agent.string}\n
`
	transporter.sendMail({
		from: config.mail_from,
		to: config.video_notice,
		subject: '视频错误监控',
		text: text,
	}, function(err, info) {
	})
}

var User = mongoose.model('User')
router.get('/', function(req, res) {
		res.status(204).end()
		if(req.app.get('env') !== 'production'){
			return
		}
		var ip = req.ip
		var uid = req.query.id
		var url = req.query.url
		var type = req.query.type
		var _from = req.query.from
		var code = req.query.code
		if((uid || url) && type && _from && code){
			try{
			var agent = req.get('User-Agent')
			var Log = mongoose.model('Log')
			agent = parser.parse(agent)
			if(type.toLowerCase() === 'video'){
				send(uid, ip, url, _from, code, req.get('referer'), agent)
			}
			var record = new Log({
				uid: uid,
				ip:ip,
				url: url,
				type: type,
				form: _from,
				code: code,
				agent: agent
			})
			record.save()
			}catch(e){
				console.log(e)
			}
			
		}
});

module.exports = router