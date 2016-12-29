(function(){
	var VEGO = VEGO || {}
	var _mobile
	var agent = 'navigator' in window && 'userAgent' in navigator && navigator.userAgent.toLowerCase() || '';

	// add global ajax param, test for zepto.js
	$(document).on('ajaxBeforeSend', function(e, xhr, settings){
		var token = 'token=' + (VEGO.util.getCookie('token') || '')
		var openid = 'openid=' + (VEGO.util.getCookie('openid') || '')
		var arg = [token,openid].join('&')
		var type = settings.type
		if(type.toUpperCase() == 'POST' || type.toUpperCase() == 'PUT'){
			if(settings.data){
				settings.data += '&' + arg
			}else{
				xhr.setRequestHeader('Content-Type',settings.contentType || 'application/x-www-form-urlencoded;charset=UTF-8')
				settings.data  = arg
			}
			return true
		}
	})

	$(document).on('ajaxBeforeSend', function(e, xhr, settings){
		var token = VEGO.util.getCookie('token') || ''
		var openid = VEGO.util.getCookie('openid') || ''
		var type = settings.type
		if(type.toUpperCase() == 'POST' || type.toUpperCase() == 'PUT'){
			var data = settings.data || {}
			data.token = token
			data.openid = openid
			settings.data = data
			return true
		}
		settings.url += /\?[^=]+=.+/.test(settings.url) ? '&token=' + token : '?token=' + token
		settings.url +=  '&openid=' + openid
		return true
	})

	VEGO.util = {
		user: function(){
			return getCookie('token') || getCookie('openid')
		},
		getCookie: function(name){
			var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
			if(arr=document.cookie.match(reg)){
				return unescape(arr[2])
			}
		},
		isWechat: function(){
			
			return /micromessenger/i.test(agent);
		},
		isMobile : function(){
			if(_mobile){
				return _mobile
			}
			_mobile = /ipad/i.test(agent) || 
				/iphone os/i.test(agent) ||
				/midp/i.test(agent) || 
				/rv:1.2.3.4/i.test(agent) ||
				/ucweb/i.test(agent) || 
				/android/i.test(agent) ||
				/windows ce/i.test(agent) ||
				/windows mobile/i.test(agent)
			return _mobile
		}
	}
}())


