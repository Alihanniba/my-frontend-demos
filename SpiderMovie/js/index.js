$(document).ready(function() {
	/**
	 * 判断是否在微信中打开
	 */
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
	// browserRedirect();
	$(".header").on('click',  function(event) {
		/* Act on the event */
		window.location.href = "http://video.soundtooth.cn/";
	});
	$(".search_button").on('click',function(event) {
		var search = $("#search").val();
		if(search != '请输入影片名'){
			$.ajax({
			url: 'search.php',
			type: 'POST',
			dataType: 'json',
			data: {
				title: search
				},
			})
			.done(function(data) {
				// console.log(data.length);
				if(data.length >= 1){
					$("figure").remove();
					for (var i = 0; i < data.length; i++) {
						var key = data[i].id;
						var display = data[i].display;
						var img = data[i].movie_image;
						var title = data[i].movie_name;
						var url = data[i].movie_url;
						var movie_key = data[i].movie_key;

						var figure = document.createElement('figure');
						figure.setAttribute('onclick', 'figure(this);');
			            document.getElementById('movie_main').appendChild(figure);

			            var kkey = document.createElement('p');
			            kkey.setAttribute('style','display:none');
			            kkey.innerHTML = key;
			            figure.appendChild(kkey);

			            var mimg = document.createElement('img');
			            if(display == 1){
			            	mimg.src = "../images/"+img;
			            }else{
			            	mimg.src = img;
			            }
			            figure.appendChild(mimg);

			            var mtitle = document.createElement('figcaption');
			            mtitle.innerHTML = title;
			            figure.appendChild(mtitle);

			            var murl = document.createElement('p');
			            murl.setAttribute('style', 'display:none;');
			            murl.innerHTML = url;
			            figure.appendChild(murl);

			            var mkey = document.createElement('p');
			            mkey.setAttribute('style', 'display:none;');
			            mkey.innerHTML = movie_key;
			            figure.appendChild(mkey);

			            var mdisplay = document.createElement('p');
			            mdisplay.setAttribute('style', 'display:none;');
			            mdisplay.innerHTML = display;
			            figure.appendChild(mdisplay);
					}
				}else{
					alert("你输入的影片暂时无法找到!");
				}
			})
			.fail(function() {
				console.log("error");
			})
			
		}else{
			$("figure").remove();
			movie_list(1);
		}
	});
	$("#search").focus(function(event) {
		/* Act on the event */
		if(this.value == '请输入影片名'){
			this.value = '';
		}
	});
	$("#search").blur(function(event) {
		/* Act on the event */
		if(this.value == ''){
			this.value = '请输入影片名';
		}
	});
	movie_list(1);

	var page = 2;
	$(".footer").on('click',  function(event) {
		/* Act on the event */
		movie_list(page);
		console.log(page);
		page++;
	});
});

function figure(bj) {
	window.location.href = "play.php?key="+ bj.children[0].innerHTML;
}
function movie_list(page){
	$.ajax({
		url: 'cc.php',
		type: 'POST',
		dataType: 'json',
		data: {
			page:page
		},
	})
	.done(function(data) {
		if(data == null){
			return false;
		}
		for (var i = 0; i < data.length; i++) {
			var key = data[i].id;
			var display = data[i].display;
			var img = data[i].movie_image;
			var title = data[i].movie_name;
			var url = data[i].movie_url;
			var movie_key = data[i].movie_key;

			var figure = document.createElement('figure');
			figure.setAttribute('onclick', 'figure(this);');
            document.getElementById('movie_main').appendChild(figure);

            var kkey = document.createElement('p');
            kkey.setAttribute('style','display:none');
            kkey.innerHTML = key;
            figure.appendChild(kkey);

            var mimg = document.createElement('img');
            if(display == 1){
            	mimg.src = "../images/"+img;
            }else{
            	mimg.src = img;
            }
            figure.appendChild(mimg);

            var mtitle = document.createElement('figcaption');
            mtitle.innerHTML = title;
            figure.appendChild(mtitle);

            var murl = document.createElement('p');
            murl.setAttribute('style', 'display:none;');
            murl.innerHTML = url;
            figure.appendChild(murl);

            var mkey = document.createElement('p');
            mkey.setAttribute('style', 'display:none;');
            mkey.innerHTML = movie_key;
            figure.appendChild(mkey);

            var mdisplay = document.createElement('p');
            mdisplay.setAttribute('style', 'display:none;');
            mdisplay.innerHTML = display;
            figure.appendChild(mdisplay);
		}
	})
	.fail(function() {
		console.log("error");
	});
}


