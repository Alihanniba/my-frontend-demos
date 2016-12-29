<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>电影资源排序</title>
	<script src="js/jquery-2.1.4.min.js"></script>
	<style>
		body,html{
			height: 100%;
			width: 100%;
		}
		*{
			margin: 0;
			padding: 0;
		}
		#intro{
			margin:0 auto;
			width:1000px;
			font-size: 32px;
			text-align: left;
		}
		#list_name{
			height: 50px;
			width: 1000px;
			margin: 0 auto;
			color: #fff;
			background: #333;
		}
		#list_name p{
			float: left;
			height: 100%;
			width: 200px;
			line-height: 50px;
			text-align: center;
		}
		#operation{
			width: 400px!important;
		}
		#list{
			height: 100%;
			width: 1000px;
			/*border:1px solid #999;*/
			margin: 0 auto;
		}
		#list div{
			height: 50px;
			width: 100%;
			border-bottom:1px solid #999;
			font-size: 20px;
		}
		#list div button{
			float: right;
			height: 51px;
			width: 160px;
			outline: none;
			background: #999;
			border-radius: 4px;
			border:#333;
			cursor: pointer;
		}
		#list div p{
			float: left;
			height: 51px;
			width: 200px;
			line-height: 50px;
			text-align: center;
			overflow: hidden;
		}
	</style>
	<script>
		$(document).ready(function($) {
			$.ajax({
				url: 'movieList.php',
				type: 'POST',
				data: {},
			})
			.done(function(data) {
				console.log("success");
				// console.log(eval(data));
				if(data != ''){
					var list = eval(data);
					for (var i = 0; i < list.length; i++) {
						var movie_key = list[i].movie_key;
						var name = list[i].movie_name;
						var display = list[i].display;
						var sort = list[i].sort_order;

						var mdiv = document.createElement('div');
						// mdiv.setAttribute('onclick', 'Stick(this);');
						mdiv.id = "movie_list"+i;
			            document.getElementById('list').appendChild(mdiv);

			            var mname = document.createElement('p');
			            mname.innerHTML = name;
			            $('#movie_list'+i).append(mname);

						var mdisplay = document.createElement('p');
			            mdisplay.className = "display";
			            if(display == 1){
			            	mdisplay.innerHTML = "显示1";
			            }else if(display == 2){
			            	mdisplay.innerHTML = "显示2";
			            }else if(display == 3){
			            	mdisplay.innerHTML = "隐藏1";
			            }else{
			            	mdisplay.innerHTML = "隐藏2";
			            }
			            $('#movie_list'+i).append(mdisplay);

			            var mtop = document.createElement('p');
			            mtop.innerHTML = sort;
			            $('#movie_list'+i).append(mtop);

			            var mstick = document.createElement('button');
						mstick.setAttribute('onclick', 'Stick(this);');
			            mstick.innerHTML = "置顶";
			            $('#movie_list'+i).append(mstick);

			            var mmovie_key = document.createElement('p');
						mmovie_key.setAttribute('style', 'display:none');
			            mmovie_key.innerHTML = movie_key;
			            $('#movie_list'+i).append(mmovie_key);

			            var mShowOrHide = document.createElement('button');
						mShowOrHide.setAttribute('onclick', 'ShowHide(this);');
			            mShowOrHide.innerHTML = "显示/隐藏";
			            $('#movie_list'+i).append(mShowOrHide);
					}
				}
			})
			.fail(function() {
				console.log("error");
			})
			
		});

		function Stick(bj){
			var name = bj.parentNode.firstChild.innerHTML;
			var show_hide = bj.parentNode.childNodes[1].innerHTML;
			var stick = bj.parentNode.childNodes[2].innerHTML;
			var movie_key = bj.parentNode.childNodes[4].innerHTML;
			if(show_hide == "显示1"||show_hide == "显示2"){
				$.ajax({
				url: 'stick.php',
				type: 'POST',
				dataType: 'json',
				data: {
						name: name,
						show_hide:show_hide,
						movie_key:movie_key,
					},
				})
				.done(function(data) {
					console.log("success");
					var temp = $.parseJSON(data['temp']);
					bj.parentNode.childNodes[2].innerHTML = parseInt(temp[0]['max']) + 1;
					if(parseInt(data['tt']) > 0){
						var div = document.getElementById("list");
						var ff = bj.parentNode.parentNode.getElementsByTagName("div");
						div.insertBefore(bj.parentNode,ff[0]);
						alert("置顶成功!");
					}
				})
				.fail(function() {
					console.log("error");
				})
			}
		}

		function ShowHide(al){
			var name = al.parentNode.firstChild.innerHTML;
			var show_hide = al.parentNode.childNodes[1].innerHTML;
			var movie_key = al.parentNode.childNodes[4].innerHTML;
			$.ajax({
				url: 'showAndHide.php',
				type: 'POST',
				dataType: 'json',
				data: {
					name: name,
					show_hide: show_hide,
					movie_key: movie_key,
				},
			})
			.done(function(data) {
				console.log("success");
				if(data == 1){
					switch (show_hide){
						case "显示1":
							al.parentNode.childNodes[1].innerHTML = "隐藏1";
							break;
						case "显示2":
							al.parentNode.childNodes[1].innerHTML = "隐藏2";
							break;
						case "隐藏1":
							al.parentNode.childNodes[1].innerHTML = "显示1";
							break;
						case "隐藏2":
							al.parentNode.childNodes[1].innerHTML = "显示2";
							break;
						default:
							break;
					}
				}
			})
			.fail(function() {
				console.log("error");
			})
		}
	</script>
</head>
<body>
	<div id="intro">
		<p>显示1&nbsp;:意思是别的网站爬的电影显示</p>
		<p>显示2&nbsp;:意思自己上传的电影显示</p>
		<p>隐藏1&nbsp;:意思是别的网站爬的电影隐藏</p>
		<p>隐藏2&nbsp;:意思自己上传的电影隐藏</p>
		<p>置顶系数&nbsp;:数字越大越靠前</p>
	</div>
	<div id="list_name">
		<p>电影名称</p>
		<p>display</p>
		<p>置顶系数</p>
		<p id="operation">操作</p>
	</div>
	<div id="list">
		<!-- <div>
			<p class="name">花千骨</p>
			<p class="display">1</p>
			<p class="top">2</p>
			<button class="Stick">置顶</button>
			<button class="show">显示</button>
			<button class="hide">隐藏</button>
		</div> -->
	</div>
</body>
</html>