
$(document).ready(function(){
	//  定义根域名
	var BASEURL = /\.dev\//.test(location.href)? 'http://api.vego.dev' : 'http://wechat.vego.tv';
	var agent = 'navigator' in window && 'userAgent' in navigator && navigator.userAgent.toLowerCase() || '';
	var isWechat =  /micromessenger/i.test(agent);
	if(!isWechat){
		return
	}
	var list = [
			'checkJsApi',
			'onMenuShareTimeline',
			'onMenuShareAppMessage',
			'onMenuShareQQ',
			'onMenuShareWeibo',
			'onMenuShareQZone',
			'hideMenuItems',
			'showMenuItems',
			'hideAllNonBaseMenuItem',
			'showAllNonBaseMenuItem',
			'translateVoice',
			'startRecord',
			'stopRecord',
			'onVoiceRecordEnd',
			'playVoice',
			'onVoicePlayEnd',
			'pauseVoice',
			'stopVoice',
			'uploadVoice',
			'downloadVoice',
			'chooseImage',
			'previewImage',
			'uploadImage',
			'downloadImage',
			'getNetworkType',
			'openLocation',
			'getLocation',
			'hideOptionMenu',
			'showOptionMenu',
			'closeWindow',
			'scanQRCode',
			'chooseWXPay',
			'openProductSpecificView',
			'addCard',
			'chooseCard',
			'openCard'
		];
	$.ajax({
		url: BASEURL + '/service/wechat/jssdk',
		type:'POST',
		dataType: 'json',
		data:{
			url: location.href.split('#')[0]
		},
		success: function(data){
			if( data.code ){
				return console.error(data.message)
			}
			var config = data.data
			console.log(data);
			config.debug = window['config'] && window['config'].debug
			config.jsApiList = list;
			wx.config(config)
			wx.error(function(res){console.log(JSON.stringify(res))});
			wx.ready(function(){
				console.log('Wechat config success')
				if(window['_onWecahtReady']){
					window['_onWecahtReady']()
				}
			})
		},
		error: function(xhr, type){
			console.error('Error', type)
		}
	})
})