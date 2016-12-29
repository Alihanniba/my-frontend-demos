<!DOCTYPE html>
<html lang="zh">
<head>
	<meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0">
	<title>Document</title>
	<script type="text/javascript" src="http://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js"></script>
	<script type="text/javascript">
		function Interface1(i){
			$.ajax({
				url: 'http://pushsdk.soundtooth.cn/api/pushToEveryOne',
				type: 'post',
				dataType: 'json',
				data: {'index': i},
			})
			.done(function(data) {
				alert(data.success);
			})
			.fail(function() {
				alert("error");
			});
		}
	</script>
	<style>
		* {
		    margin: 0;
		    padding: 0;
		}

		html,body {
		    font-family: Helvetica, Arial,"Microsoft YaHei", sans-serif;
		    width: 100%;
		    height: 100%;
		    letter-spacing: 0.1px;
		    background-color: rgb(103, 153, 255);
		}
		#Interface{
			display: block;
			width: 120px;
			height: 40px;
			line-height: 40px;
			font-size: 18px;
			color: #333;
			text-align: center;
			text-decoration: none;
			background-color: #fff;
			position: fixed;
			top: 30%;
			left: 50%;
			margin-left: -50px;
			border-radius: 4px;
		}
		#Interface2{
			display: block;
			width: 120px;
			height: 40px;
			line-height: 40px;
			font-size: 18px;
			color: #333;
			text-align: center;
			text-decoration: none;
			background-color: #fff;
			position: fixed;
			top: 50%;
			left: 50%;
			margin-left: -50px;
			border-radius: 4px;
		}
	</style>
</head>
<body>
	<a href="javascript:;" onclick="Interface1(0)" id="Interface">推送1</a>
	<a href="javascript:;" onclick="Interface1(1)" id="Interface2">推送2</a>
</body>
</html>