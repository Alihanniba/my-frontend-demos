<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>声牙科技</title>
	<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta http-equiv="pragma" content="no-cache"> 
	<meta http-equiv="Cache-Control" content="no-cache, must-revalidate"> 
	<meta http-equiv="expires" content="0">
	<style>
	*{padding: 0;margin: 0;}
	body {width:100%;height:100%;background: rgba(0,0,0,0);font-family: Helvetica Neue, Helvetica, Arial, sans-serif;font-size: 14px;color:#000;margin: 0;padding: 0;overflow: hidden; position: relative;}
	.container{
		width: 90%;
		background-color: #fff;
		border-radius: 3px;
		padding: 3px;
		position: absolute;
		z-index: 100;
		top: 50%;
		left: 5%;
		transform: translate(0, -50%);
		-ms-transform: translate(0, -50%);
		-moz-transform: translate(0, -50%);
		-webkit-transform: translate(0, -50%);
		-o-transform: translate(0, -50%);
		box-sizing: border-box;
		-moz-box-sizing:border-box;
		-webkit-box-sizing:border-box;
		display: none;
	}
	.adcon{display: block;overflow: hidden;-webkit-tap-highlight-color:rgba(0,0,0,0);}
	.adimg{
		display: inline-block;
		overflow: hidden;
		vertical-align: top;
	}
	.close{
		width: 28px;
		height: 28px;
		background: url(./images/wrong.png) 0 0 no-repeat;
		position: absolute;
		right: -14px;
		top: -14px;
		z-index: 1000;
		cursor: pointer;
		-webkit-tap-highlight-color:rgba(0,0,0,0);
		display: none;
	}
	.animated {-webkit-animation-duration:1s;animation-duration:1s;-webkit-animation-fill-mode:both;animation-fill-mode:both;}
	@-webkit-keyframes zoomInLeft {
		0% {opacity:0;-webkit-transform:scale3d(.1, .1, .1) translate(-1000px, -50%);transform:scale3d(.1, .1, .1) translate(-1000px, -50%);-webkit-animation-timing-function:cubic-bezier(0.55, .055, .675, .19);animation-timing-function:cubic-bezier(0.55, .055, .675, .19);}
		60% {opacity:1;-webkit-transform:scale3d(.475, .475, .475) translate(0px, -50%);transform:scale3d(.475, .475, .475) translate(10px, -50%);-webkit-animation-timing-function:cubic-bezier(0.175, .885, .32, 1);animation-timing-function:cubic-bezier(0.175, .885, .32, 1);}
	}
	@keyframes zoomInLeft {
		0% {opacity:0;-webkit-transform:scale3d(.1, .1, .1) translate(-1000px, -50%);-ms-transform:scale3d(.1, .1, .1) translate(-1000px, -50%);transform:scale3d(.1, .1, .1) translate(-1000px, -50%);-webkit-animation-timing-function:cubic-bezier(0.55, .055, .675, .19);animation-timing-function:cubic-bezier(0.55, .055, .675, .19);}
		60% {opacity:1;-webkit-transform:scale3d(.475, .475, .475) translate(0px, -50%);-ms-transform:scale3d(.475, .475, .475) translate(10px, -50%);transform:scale3d(.475, .475, .475) translate(0px, -50%);-webkit-animation-timing-function:cubic-bezier(0.175, .885, .32, 1);animation-timing-function:cubic-bezier(0.175, .885, .32, 1);}
	}
	.zoomInLeft {-webkit-animation-name:zoomInLeft;animation-name:zoomInLeft;}
	@-webkit-keyframes bounceIn {
		0%, 100%, 20%, 40%, 60%, 80% {-webkit-transition-timing-function:cubic-bezier(0.215, .61, .355, 1);transition-timing-function:cubic-bezier(0.215, .61, .355, 1);}
		0% {opacity:0;-webkit-transform:scale3d(.3, .3, .3) translate(0px, -50%);transform:scale3d(.3, .3, .3) translate(0px, -50%);}
		20% {-webkit-transform:scale3d(1.1, 1.1, 1.1) translate(0px, -50%);transform:scale3d(1.1, 1.1, 1.1) translate(0px, -50%);}
		40% {-webkit-transform:scale3d(.9, .9, .9) translate(0px, -50%);transform:scale3d(.9, .9, .9) translate(0px, -50%);}
		60% {opacity:1;-webkit-transform:scale3d(1.03, 1.03, 1.03) translate(0px, -50%);transform:scale3d(1.03, 1.03, 1.03) translate(0px, -50%);}
		80% {-webkit-transform:scale3d(.97, .97, .97) translate(0px, -50%);transform:scale3d(.97, .97, .97) translate(0px, -50%);}
		100% {opacity:1;-webkit-transform:scale3d(1, 1, 1) translate(0px, -50%);transform:scale3d(1, 1, 1) translate(0px, -50%);}
	}
	@keyframes bounceIn {
		0%, 100%, 20%, 40%, 60%, 80% {-webkit-transition-timing-function:cubic-bezier(0.215, .61, .355, 1);transition-timing-function:cubic-bezier(0.215, .61, .355, 1);}
		0% {opacity:0;-webkit-transform:scale3d(.3, .3, .3) translate(0px, -50%);-ms-transform:scale3d(.3, .3, .3) translate(0px, -50%);transform:scale3d(.3, .3, .3) translate(0px, -50%);}
		20% {-webkit-transform:scale3d(1.1, 1.1, 1.1) translate(0px, -50%);-ms-transform:scale3d(1.1, 1.1, 1.1) translate(0px, -50%);transform:scale3d(1.1, 1.1, 1.1) translate(0px, -50%);}
		40% {-webkit-transform:scale3d(.9, .9, .9) translate(0px, -50%);-ms-transform:scale3d(.9, .9, .9) translate(0px, -50%);transform:scale3d(.9, .9, .9) translate(0px, -50%);}
		60% {opacity:1;-webkit-transform:scale3d(1.03, 1.03, 1.03) translate(0px, -50%);-ms-transform:scale3d(1.03, 1.03, 1.03) translate(0px, -50%);transform:scale3d(1.03, 1.03, 1.03) translate(0px, -50%);}
		80% {-webkit-transform:scale3d(.97, .97, .97) translate(0px, -50%);-ms-transform:scale3d(.97, .97, .97) translate(0px, -50%);transform:scale3d(.97, .97, .97) translate(0px, -50%);}
		100% {opacity:1;-webkit-transform:scale3d(1, 1, 1) translate(0px, -50%);-ms-transform:scale3d(1, 1, 1) translate(0px, -50%);transform:scale3d(1, 1, 1) translate(0px, -50%);}
	}
	.bounceIn {-webkit-animation-name:bounceIn;animation-name:bounceIn;-webkit-animation-duration:1s;animation-duration:1s;}
	@-webkit-keyframes zoomOutRight {
		40% {opacity:1;-webkit-transform:scale3d(.475, .475, .475) translate(-42px, -50%);transform:scale3d(.475, .475, .475) translate(-42px, -50%);}
		100% {opacity:0;-webkit-transform:scale(.1) translate(2000px, -50%);transform:scale(.1) translate(2000px, -50%);-webkit-transform-origin:right center;transform-origin:right center;}
	}
	@keyframes zoomOutRight {
		40% {opacity:1;-webkit-transform:scale3d(.475, .475, .475) translate(-42px, -50%);-ms-transform:scale3d(.475, .475, .475) translate(-42px, -50%);transform:scale3d(.475, .475, .475) translate(-42px, -50%);}
		100% {opacity:0;-webkit-transform:scale(.1) translate(2000px, -50%);-ms-transform:scale(.1) translate(2000px, -50%);transform:scale(.1) translate(2000px, -50%);-webkit-transform-origin:right center;-ms-transform-origin:right center;transform-origin:right center;}
	}
	.zoomOutRight {-webkit-animation-name:zoomOutRight;animation-name:zoomOutRight;}
	</style>
	
</head>
<body>
	<div class="container">
		<a href="javascript:;" class="close"></a>
	</div>
	<input type="hidden" id="uid">
	<input type="hidden" id="mid">
	<input type="hidden" id="appid">
	<input type="hidden" id="auId">
	<input type="hidden" id="tId">
	<input type="hidden" id="macaddr">
	<script src="{{Config::get('app.url')}}js/jquery-2.1.4.min.js"></script>
	<script>
		var BASEURL = "{{Config::get('app.url')}}";
		$("body").width(window.innerWidth);
		$("body").height(window.innerHeight);
		var messurl = "";
		$(function() {
			$.ajax({
				url: BASEURL + 'api/getMacChipMessageSingle',
				type: 'post',
				dataType: 'json',
				data: {
					macAddr: GetQueryString('m'),
					time: GetQueryString('ts'),
					token: GetQueryString('t')
				}
			})
			.done(function(data) {
				console.log(data);
				if(data.success){
					$("#uid").val(data.result[0].u);
					$("#mid").val(data.result[0].m);
					$("#appid").val(data.result[0].a);
					$("#auId").val(data.result[0].au);
					$("#tId").val(data.result[0].t);
					$("body").css('background', 'rgba(0,0,0,.5)');
					messurl = data.result[0].message_link;
					// $(".adimg").attr('src', data.result[0].channel_img);
					$(".container").append('<a href="javascript:;" class="adcon" onclick="adconClick()"><img src="'+data.result[0].channel_image+'" alt="" class="adimg"></a>');
					$(".adimg").load(function() {
						var width = $(".container").width();
						var height = width * ($(".adimg").height() / $(".adimg").width());
						$(".adimg").width(width);
						$(".adimg").height(height);
						$(".container").css('display', 'block').addClass('bounceIn animated');
					});
					
					// setTimeout(function () {
					//		$(".container").removeClass('bounceIn animated');
					//	},1000);
					if(Terminal.platform.android){
						window.InsertAdJavaInterface.onInsertAdResult(true, '有广告');
					} else if(Terminal.platform.iPhone){
						window.location.href = "objc://onInsertAdResult::/" + 'status=true,errCode=' + data.errCode;
					}
				} else if(!data.success){
					if(Terminal.platform.android){
						window.InsertAdJavaInterface.onInsertAdResult(false, '没有广告');
					} else if(Terminal.platform.iPhone){
						window.location.href = "objc://onInsertAdResult::/" + 'status=false,errCode=' + data.errCode;
					}
				}
			})
			.fail(function(data) {
				console.log(data);
				if(Terminal.platform.android){
					window.InsertAdJavaInterface.onInsertAdResult(false, '接口请求失败');
				} else if(Terminal.platform.iPhone){
					window.location.href = "objc://onInsertAdResult::/status=false,errCode=InterfaceRequestFailed";
				}
			});
			
			//设置关闭按钮几秒后显示
			setTimeout(function () {
				$('.close').fadeIn();
			},1500);

			
			$('.close').on('click',function() {
				$(".container").removeClass('bounceIn animated').addClass('zoomOutRight animated');
				setTimeout(function () {
					if(Terminal.platform.android){
						window.InsertAdJavaInterface.onInsertAdCancelClick();
					} else if(Terminal.platform.iPhone){
						window.location.href = "objc://adViewClose::/close";
					}
				},1000);
			});
		});
		// 获取终端的相关信息
		var Terminal = {
			platform : function(){
				var u = navigator.userAgent, app = navigator.appVersion;
				return {
					windows: u.indexOf('Windows NT') > -1 ,// windows
					android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
					iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //iPhone或者QQHD浏览器
					iPad: u.indexOf('iPad') > -1, //iPad
					mac: u.indexOf('Mac')// mac
				};
			}(),
			language : (navigator.browserLanguage || navigator.language).toLowerCase()
		}
		//获取url参数
		function GetQueryString(name)
		{
			 var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
			 var r = window.location.search.substr(1).match(reg);
			 if(r!=null)return  unescape(r[2]); return null;
		}
		function adconClick() {
			var dataurl = BASEURL + "imgStatistic?m=" + $("#mid").val() + "&u=" + $("#uid").val() + "&a=" + $("#appid").val() + "&au="+ $("#auId").val() + "&t=" + $("#tId").val() + "&url=" + messurl;
			if(Terminal.platform.android){
				window.InsertAdJavaInterface.onInsertAdClick(dataurl);
			} else if(Terminal.platform.iPhone){
				window.location.href = "objc://spotAdClick::/" + dataurl;
			}
			// $.ajax({
			// 	url: BASEURL + 'api/totalClickNum',
			// 	type: 'post',
			// 	dataType: 'json',
			// 	data: {
			// 		uid: $("#uid").val(),
			// 		mid: $("#mid").val(),
			// 		appID: $("#appid").val()
			// 	}
			// })
			// .done(function(data) {
			// 	console.log(data);
			// })
			// .fail(function(data) {
			// 	console.log(data);
			// });
			
		}
	</script>
</body>
</html>