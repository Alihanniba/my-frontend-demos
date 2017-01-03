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
?>

<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title><?php echo $wechat; ?></title>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
	<link rel="stylesheet" href="css/index.css">
	<script>
		var _hmt = _hmt || [];
		(function() {
		  var hm = document.createElement("script");
		  hm.src = "www.alihanniba.com";
		  var s = document.getElementsByTagName("script")[0]; 
		  s.parentNode.insertBefore(hm, s);
		})();
	</script>
</head>
<body>
	<input type="hidden" id="total_count">
	<div class="header"></div>
	<!-- http://www.highoo.com/ -->
	<script type="text/javascript">
    	var cpro_id = "www.alihanniba.com";
	</script>
	<script src="http://cpro.baidustatic.com/cpro/ui/cm.js" type="text/javascript"></script>
	<div class="contains">
		<input type="text" class="search" id="search" placeholder="请输入影片名">
		<p class="search_button">搜索</p>
		<p class="wechat">最新电影/微信号：<?php echo $wechat; ?> </p>
		<div class="movie_main" id="movie_main">
			<!-- <figure>
				<img src=""/>
				<figcaption>黄浦江上的卢浦大桥</figcaption>
			</figure> -->
		</div>
	</div>
	<button class="footer">点击加载更多</button>
	<div id="movie_shadow"></div>
	<div id="onShadow">
		<img src="images/7788.jpg" alt="">
	</div>
	
	<script src="js/jquery-2.1.4.min.js"></script>
	<script src="js/index.js"></script>
</body>
</html>