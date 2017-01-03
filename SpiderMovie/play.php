<?php 
	require("data.php");
	//php手机端PC端跳转
	function is_mobile() { 
	    $user_agent = $_SERVER['HTTP_USER_AGENT']; 
	    $mobile_agents = array("240x320","acer","acoon","acs-","abacho","ahong","airness","alcatel","amoi", 
	    "android","anywhereyougo.com","applewebkit/525","applewebkit/532","asus","audio", 
	    "au-mic","avantogo","becker","benq","bilbo","bird","blackberry","blazer","bleu", 
	    "cdm-","compal","coolpad","danger","dbtel","dopod","elaine","eric","etouch","fly ", 
	    "fly_","fly-","go.web","goodaccess","gradiente","grundig","haier","hedy","hitachi", 
	    "htc","huawei","hutchison","inno","ipad","ipaq","iphone","ipod","jbrowser","kddi", 
	    "kgt","kwc","lenovo","lg ","lg2","lg3","lg4","lg5","lg7","lg8","lg9","lg-","lge-","lge9","longcos","maemo", 
	    "mercator","meridian","micromax","midp","mini","mitsu","mmm","mmp","mobi","mot-", 
	    "moto","nec-","netfront","newgen","nexian","nf-browser","nintendo","nitro","nokia", 
	    "nook","novarra","obigo","palm","panasonic","pantech","philips","phone","pg-", 
	    "playstation","pocket","pt-","qc-","qtek","rover","sagem","sama","samu","sanyo", 
	    "samsung","sch-","scooter","sec-","sendo","sgh-","sharp","siemens","sie-","softbank", 
	    "sony","spice","sprint","spv","symbian","tablet","talkabout","tcl-","teleca","telit", 
	    "tianyu","tim-","toshiba","tsm","up.browser","utec","utstar","verykool","virgin", 
	    "vk-","voda","voxtel","vx","wap","wellco","wig browser","wii","windows ce", 
	    "wireless","xda","xde","zte"); 
	    $is_mobile = false; 
	    foreach ($mobile_agents as $device) { 
	        if (stristr($user_agent, $device)) { 
	            $is_mobile = true; 
	            break; 
	        } 
	    } 
	    return $is_mobile; 
	} 
	if (!is_mobile()) { 
	    header('Location: http://www.alihanniba.com/');
	    return;
	} 

	if(!$_GET['key']){
		echo 'Error';
		exit();
	}
	$key = $_GET['key'];
	$result = $dbh -> prepare("SELECT * from `dy592` WHERE `id` =".$key);
	if(!$result->execute()){
		echo "error1";
		exit();
	}
	$movieInfo = $result->fetchall();
	$title = $movieInfo[0]['movie_name'];
	$keys = $movieInfo[0]['movie_key'];
	$url = $movieInfo[0]['movie_url'];
	$img = $movieInfo[0]['movie_image'];
	$display = $movieInfo[0]['display'];
	if($display == 1){
		$img = "../images/".$img;
	}else{
		$img = $img;
	}
?>

<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title><?php echo $title; ?>_高清在线</title>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
	<link rel="stylesheet" href="css/index.css">
	<link rel="stylesheet" href="css/swiper.min.css">
	<script>
		var _hmt = _hmt || [];
		(function() {
		  var hm = document.createElement("script");
		  hm.src = "www.alihanniba.com";
		  var s = document.getElementsByTagName("script")[0]; 
		  s.parentNode.insertBefore(hm, s);
		})();
	</script>
	<script src="js/jquery-2.1.4.min.js"></script>
	<style>
		body{
			background: rgb(240,239,245);
		}
	</style>

	<script>
		//判断是否手机端打开
        function browserRedirect() {
        	var sUserAgent = navigator.userAgent.toLowerCase();
        	var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
        	var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
        	var bIsMidp = sUserAgent.match(/midp/i) == "midp";
        	var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
        	var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
        	var bIsAndroid = sUserAgent.match(/android/i) == "android";
        	var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
        	var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
        	if (! (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM)) {
            	alert("观看视频请用手机打开此网站\nwww.alihanniba.com");
        	}
        }
	
		$(document).ready(function() {
            var ua = navigator.userAgent.toLowerCase();
            if(ua.indexOf('micromessenger') > 0){
            	$("#onShadow").css("background","url(../images/tipsWechat@2x.png) no-repeat");
            	$("#onShadow img").css('display', 'block');
    			$("#movie_shadow").on('click',function() {
    				/* Act on the event */
    				$(this).hide();
    				$("#onShadow").hide();
    			});
			}

			wx.ready(function(){
	            /**
	             * [success description]分享到朋友圈
	             * @param  {[type]} )       {                                                            } [description]
	             * @param  {[type]} cancel: function      () {                                                            }                } [description]
	             * @return {[type]}         [description]
	             */
	            wx.onMenuShareTimeline({
	                title: '<?php echo $title; ?>_高清在线', // 分享标题
	                link: window.location.href, // 分享链接
	                imgUrl: '<?php echo $img; ?>', // 分享图标
	                success: function () { 
	                    // 用户确认分享后执行的回调函数
	                    $("#share_shadom").css('display', 'none');
	                },
	                cancel: function () { 
	                    // 用户取消分享后执行的回调函数
	                }
	            });
	            /**
	             * [success description]分享给朋友
	             * @param  {[type]} )       {                                                            } [description]
	             * @param  {[type]} cancel: function      () {                                                            }                } [description]
	             * @return {[type]}         [description]
	             */
	            wx.onMenuShareAppMessage({
	                title: '<?php echo $title; ?>_高清在线', // 分享标题
	                desc: '<?php echo $title; ?>_高清在线', // 分享描述
	                link: window.location.href, // 分享链接
	                imgUrl: '<?php echo $img; ?>', // 分享图标
	                success: function () { 
	                    // 用户确认分享后执行的回调函数
	                    $("#share_shadom").css('display', 'none');
	                },
	                cancel: function () { 
	                    // 用户取消分享后执行的回调函数
	                }
	            });
	        });

			$(".header").on('click',  function(event) {
				window.location.href = "www.alihanniba.com";
			});

			/**
			 * 三张app下载图
			 */
			var appImg1 = new Array(
					"../images/1.jpg",
					"../images/2.jpg",
					"../images/3.png"
				);
			var appImg2 = new Array(
					"../images/4.jpg",
					"../images/5.jpg",
					"../images/6.jpg"
				);
			var appImg3 = new Array(
					"../images/7.jpg",
					"../images/8.jpg",
					"../images/9.jpg"
				);
			var x = Math.floor(Math.random()*3);
			var y = Math.floor(Math.random()*3);
			var z = Math.floor(Math.random()*3);
			$("#three_movie").append(
					'<img src="'+appImg1[x]+'" alt="">'+
					'<img src="'+appImg2[y]+'" alt="">'+
					'<img src="'+appImg3[z]+'" alt="">'
				);
			//判断手机客户端是安卓还是iOS
            var ua = navigator.userAgent.toLowerCase();
			var browser = {
			   versions: function () {
			    var u = navigator.userAgent, app = navigator.appVersion;
			    return {//移动终端浏览器版本信息
			     trident: u.indexOf('Trident') > -1, //IE内核
			     presto: u.indexOf('Presto') > -1, //opera内核
			     webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
			     gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
			     mobile: !!u.match(/AppleWebKit.*Mobile/i) || !!u.match(/MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/), //是否为移动终端
			     ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
			     android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
			     iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
			     iPad: u.indexOf('iPad') > -1, //是否iPad
			     webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
			    };
			   } (),
			   language: (navigator.browserLanguage || navigator.language).toLowerCase()
			}

			$("#three_movie").on('click', function(event) {
				browserRedirect();
				if(browser.versions.iPhone || browser.versions.iPad || browser.versions.ios){
					window.location.href = "www.alihanniba.com";
				}
				if(browser.versions.android){
					if(ua.indexOf('micromessenger') > 0){
						alert("请在点击右上角在浏览器打开,观看更多内容");
					}
					else{
						alert("点击下载,观看更多内容");
						window.location.href = "www.alihanniba.com";
					}
					
				}
			});
			
			/**
			 * 电影随机推荐部分
			 */

			// $.ajax({
			// 	url: 'recommend.php',
			// 	type: 'POST',
			// 	dataType: 'json',
			// 	data: {},
			// })
			// .done(function(data) {
			// 	console.log("success");
			// 	if(data == null){
			// 		return false;
			// 	}
			// 	for (var i = 0; i < data.length; i++) {
			// 		var key = data[i].id;
			// 		var display = data[i].display;
			// 		var img = data[i].movie_image;
			// 		var title = data[i].movie_name;
			// 		var url = data[i].movie_url;
			// 		var movie_key = data[i].movie_key;

			// 		var figure = document.createElement('figure');
			// 		figure.setAttribute('onclick', 'figure(this);');
		 //            document.getElementById('three_movie').appendChild(figure);

		 //            var kkey = document.createElement('p');
		 //            kkey.setAttribute('style','display:none');
		 //            kkey.innerHTML = key;
		 //            figure.appendChild(kkey);

		 //            var mimg = document.createElement('img');
		 //            if(display == 1){
		 //            	mimg.src = "../images/"+img;
		 //            }else{
		 //            	mimg.src = img;
		 //            }
		 //            figure.appendChild(mimg);

		 //            var mtitle = document.createElement('figcaption');
		 //            mtitle.innerHTML = title;
		 //            figure.appendChild(mtitle);

		 //            var murl = document.createElement('p');
		 //            murl.setAttribute('style', 'display:none;');
		 //            murl.innerHTML = url;
		 //            figure.appendChild(murl);

		 //            var mkey = document.createElement('p');
		 //            mkey.setAttribute('style', 'display:none;');
		 //            mkey.innerHTML = movie_key;
		 //            figure.appendChild(mkey);

		 //            var mdisplay = document.createElement('p');
		 //            mdisplay.setAttribute('style', 'display:none;');
		 //            mdisplay.innerHTML = display;
		 //            figure.appendChild(mdisplay);
			// 	}
			// })
			// .fail(function() {
			// 	console.log("error");
			// })

			if(<?php echo $display; ?> == 2){
					$("video").attr("src","<?php echo trim($url); ?>");
			}else{
				$.ajax({
				url: 'test.php',
				type: 'POST',
				data: {
					key:"<?php echo $keys;?>"
				},
				})
				.done(function(data) {
					console.log("success");
					console.log(data);
					$("video").attr("src",data);
				})
				.fail(function() {
					console.log("error");
				})
			}
		});
		function figure(bj) {
			window.location.href = "play.php?key="+ bj.children[0].innerHTML;
		}
		function run(){
			var s = document.getElementById("dd");
			if(s.innerHTML == 0){
				$("#wait_time").css('display', 'none');
				$("#shadom").css('display', 'none');
				return;
			}
			s.innerHTML = s.innerHTML * 1 - 1;
		}
		window.setInterval("run();", 1000);
	</script>
</head>
<body>
	<div style="display:none;">
		<img src="<?php echo $img; ?>" alt="">
	</div>
	<div class="header"></div>
	<p class="title"><?php echo $title; ?></p>
	<div id="wait_time">广告倒计时&nbsp;<span id="dd">5</span>&nbsp;秒</div>
	<div id="shadom">
		<div id="dysd"></div>
	</div>
	<video src="" controls="controls" height="240" width="100%" id="play_video">
		您的手机太low了,请换一个高级点的手机观看!
	</video>
	<div class="movie_recommend">
		<div class="recommend">
			<p id="img"></p>
			<p id="title">电影推荐</p>
			<a href="index.php">
				<img src="./images/btnBackToHome@2x.png" width="64px" height="30px">
			</a>
		</div>
		<div class="three_movie" id="three_movie">
			<a href=""></a>
			
		</div>
	</div>
	<!-- app下载推荐 -->
	<div class="movie_recommend app-recommend">
	<div class="recommend">
		<p id="img"></p>
		<p id="title">应用推荐</p>
	</div>
	<div class="swiper-container">
	<div class="swiper-wrapper">
		<div class="swiper-slide"><a href=""><img src="./images/app-logo/256 256.png" alt="声牙"></a></div>
		<div class="swiper-slide"><a href=""><img src="./images/app-logo/256.png" alt="零元购"></a></div>
		<div class="swiper-slide"><a href=""><img src="./images/app-logo/icon68x681.png" alt="缘分吧"></a></div>
		<div class="swiper-slide"><a href=""><img src="./images/app-logo/258-.png" alt=""></a></div>
		<div class="swiper-slide"><a href=""><img src="./images/app-logo/pp助手.jpg" alt=""></a></div>
	</div>
	</div>
	</div>
	<div id="share_shadom"></div>
	<!--h-->
	<script type="text/javascript">
		var cpro_id="123456";
		(window["cproStyleApi"] = window["cproStyleApi"] || {})[cpro_id]={at:"3",hn:"0",wn:"0",imgRatio:"1.7",scale:"20.20",pat:"6",tn:"template_inlay_all_mobile_lu_native",rss1:"#FFFFFF",adp:"1",ptt:"0",titFF:"%E5%BE%AE%E8%BD%AF%E9%9B%85%E9%BB%91",titFS:"14",rss2:"#000000",titSU:"0",ptbg:"70",ptp:"1"}
	</script>
	<script src="http://cpro.baidustatic.com/cpro/ui/cm.js" type="text/javascript"></script>
	<p id="statement">本站不存储视频文件 版权由原网站所有</p>
	<div id="movie_shadow"></div>
	<div id="onShadow">
		<img src="images/7788.jpg" alt="">
	</div>
	<script type="text/javascript" src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>
    <script src="http://www.alihanniba.com/jssdk_dingyuehao.php"></script>
	<script src="js/swiper.min.js"></script>
	<script>
		var swiper = new Swiper('.swiper-container', {
	        slidesPerView: 6,
	        freeMode: true
	    });
	</script>
</body>
</html>
