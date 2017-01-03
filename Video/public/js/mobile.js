var mobile = {};
mobile.init = function () {
    "use strict";
};
/**
 * [autoSearch description]
 * @return {[type]} [description]
 */
function autoSearch(){
    var  title = $('#index-input-url').val();
    if (title === '') {
        return false;
    } else{
        window.location.href= BASEURL + "m/search?title=" + title;
    }
}
function wordlimit(){
    $(".index_selected_box .index_selected_show .search_desc").each(function(){
        var maxwidth=70;
        if($(this).text().length>maxwidth){
            $(this).text($(this).text().substring(0,maxwidth));
            $(this).html($(this).html()+'...');
        }
    });
    $(".index_selected_box .short_film_selected_show .search_desc").each(function(){
        var maxwidth=45;
        if($(this).text().length>maxwidth){
            $(this).text($(this).text().substring(0,maxwidth));
            $(this).html($(this).html()+'...');
        }
    });
}
/**
 * [shortFilm description]站长推荐,精选视频,随便看看   三个版块渲染抽出函数
 * @param  {[type]} data [description]
 * @param  {[type]} quit [description]
 * @return {[type]}      [description]
 */
function shortFilm(data){
    var result = data.result;
    if(result.length > 0){
        $("#page").val(data.page);
        $("#pagepart").val(data.pagepart);
        $("#last_postid").val(data.last_postid);
        for (var i = 0; i < result.length; i++) {
            $(".index_selected_box .short_film_selected_show").append(
                    '<figure onclick=moviePlayForSquare(this);>'+
                        '<p class="movie_key">'+result[i].id+'</p>'+
                        '<img src="'+result[i].image+'"/ class="images">'+
                        '<figcaption>'+result[i].title+'</figcaption>'+
                        '<p class="search_desc">'+result[i].desc+'</p>'+
                        '<p class="short_film_time">'+result[i].time+'</p>'+
                    '</figure>'
                );
        }
        wordlimit();
    }else{
        $("#uploadMore_box").css('display', 'none');
        $("#load_spacing_interval").css('display', 'none');
        $("#noSomeThing").css('display', 'block');
    }
}
/**
 * [indexMoviePlayForSquare description]电影美剧跳向剧集渲染页面
 * @param  {[type]} rj [description]
 * @return {[type]}    [description]
 */
function indexMoviePlayForSquare(rj){
    var movie_id = $(rj).eq(0).find('.hidden_id').html();
    var movie_title = $(rj).eq(0).find('figcaption').html();
    window.location.href= BASEURL + "m/play?id="+movie_id+"&t="+movie_title;
}
/**
 * [moviePlayForSquare description]站长推荐,精选视频,随便看看   三个版块视频播放
 * @param  {[type]} sj [description]
 * @return {[type]}    [description]
 */
function moviePlayForSquare(sj){
    var movie_key = $(sj).eq(0).find('.movie_key').html();
    var movie_image = $(sj).eq(0).find('.images').attr('src');
    var movie_title = $(sj).eq(0).find('figcaption').html();
    $.ajax({
        url: BASEURL + 'api/squareUrlShow',
        type: 'GET',
        dataType: 'json',
        data: {
            fid: movie_key
        },
    })
    .done(function(data) {
        if(data.status == 0){
            var movie_url = data.url;
            saveData(movie_url,movie_image,movie_title);
        }
    })
    .fail(function() {
        console.log("error");
    })


}
var page = 0,isClick = true;
/**
 * [movieAutoLoad description]站长推荐,精选视频,随便看看   三个版块渲染
 * @param  {[type]} dj [description]
 * @return {[type]}    [description]
 */
function movieAutoLoad(dj){
    $(".index_selected_box .index_selected_show").empty();
    $(".index_selected_box .short_film_selected_show").empty();

    $.ajax({
        url: BASEURL + 'api/squareShow',
        type: 'GET',
        dataType: 'json',
        data: {
            tabword:dj,
        },
    })
    .done(function(data) {
        shortFilm(data);
    })
    .fail(function() {
        console.log("error");
    })
}
/**
 * [indexMovieShow description]电影美剧首页渲染
 * @param  {[type]} page     [description]
 * @param  {[type]} pagesize [description]
 * @return {[type]}          [description]
 */
function indexMovieShow(page,pagesize,quit){
    if(quit == 1){
        $(".index_selected_box .index_selected_show").empty();
        $(".index_selected_box .short_film_selected_show").empty();
    }
    $.ajax({
        url: BASEURL + 'waveTVPlayShow',
        type: 'GET',
        dataType: 'json',
        data: {
            page:page,
            pagesize:pagesize
        },
    })
    .done(function(data) {
        if(data.length > 0){
            for (var i = 0; i < data.length; i++) {
                $(".index_selected_box .index_selected_show").append(
                        '<figure onclick="indexMoviePlayForSquare(this)">'+
                            '<p class="hidden_id">'+data[i].id+'</p>'+
                            '<img src="'+data[i].img+'"/ class="images">'+
                            '<figcaption>'+data[i].title+'</figcaption>'+
                            '<p class="search_desc">'+data[i].desc+'</p>'+
                        '</figure>'
                    );
            }
            $("#uploadMore").css('display', 'block');
            wordlimit();
        }else{
            $("#uploadMore_box").css('display', 'none');
            $("#load_spacing_interval").css('display', 'none');
            $("#noSomeThing").css('display', 'block');
        }
    })
    .fail(function() {
        console.log("error");
    })
}
/**
 * [moreShortFilm description]站长推荐,精选视频,随便看看   三个版块加载更多
 * @param  {[type]} key         [description]
 * @param  {[type]} page        [description]
 * @param  {[type]} pagepart    [description]
 * @param  {[type]} last_postid [description]
 * @return {[type]}             [description]
 */
function moreShortFilm(key,page,pagepart,last_postid){
    $.ajax({
        url: BASEURL + 'api/squarePageShow',
        type: 'GET',
        dataType: 'json',
        data: {
            tabword: key,
            pagepart:pagepart,
            page:page,
            last_postid:last_postid
        },
    })
    .done(function(data) {
        // console.log(data);
        shortFilm(data);
    })
    .fail(function() {
        console.log("error");
    })
}
/**
 * [initIndex description]
 * @return {[type]} [description]
 */
mobile.initIndex = function () {
    "use strict";
    // var title=$('#index-input-url').val();
    $('#index-search-submit').click(function () {
   		autoSearch();
    });
    $(document).on("keydown", function (event) {
        var userAgent = navigator.userAgent.toLowerCase();
        var keycode;
        if (userAgent.indexOf('firefox') >= 0 || userAgent.indexOf('ie') >= 0) {
            keycode = event.which;
        } else {
            var ev = (event === undefined)
                ? window.event
                : event;
            keycode = ev.keyCode;
        }
        if (keycode === 13 && document.activeElement.id === "index-input-url") {
            autoSearch();
        }
    });
    $(document).ready(function() {
         wx.ready(function(){
            /**
             * [success description]分享到朋友圈
             * @param  {[type]} )       {                                                            } [description]
             * @param  {[type]} cancel: function      () {                                                            }                } [description]
             * @return {[type]}         [description]
             */
            wx.onMenuShareTimeline({
                title: '10万名程序猿推荐的追剧神网（APP看剧out了！)', // 分享标题
                link: window.location.href, // 分享链接
                imgUrl: BASEURL+'images/tips-icon@2x.png', // 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
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
                title: '10万名程序猿推荐的追剧神网', // 分享标题
                desc: '还在用APP看剧？out了！', // 分享描述
                link: window.location.href, // 分享链接
                imgUrl: BASEURL+'images/tips-icon@2x.png', // 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });
        });
        /**
         * [description]导航切换
         * @param  {[type]} event) {                       $(this).addClass("selected_nav");            $(this).siblings().removeClass("selected_nav");        } [description]
         * @return {[type]}        [description]
         */
        $(".index_movie_nav p").on('click', function(event) {
            isClick = false;
            $(this).addClass("selected_nav");
            $("#uploadMore_box").css('display', 'none');
            $("#load_spacing_interval").css('display', 'block');
            $(this).siblings().removeClass("selected_nav");
            $("#noSomeThing").css('display','none');
            $('body,html').scrollTop(250);
            setTimeout(function(){
                isClick = true;
            },3000);
        });
        /**
         * [url description]进入首页即调用电影美剧接口
         * @type {[type]}
         */
        var decideshowOrHide = 1;
        indexMovieShow(0,10,decideshowOrHide);
        /**
         * [description]回到顶部
         * @param  {[type]} event) {                       indexMovieShow(0,10,decideshowOrHide);                        $("#noSomeThing").css('display','none');                          $('body,html').animate({scrollTop:0} [description]
         * @param  {[type]} 1000);                                                                 return false;          }                                       [description]
         * @return {[type]}        [description]
         */
        $("#brotherss_isters").on('click',function(event) {
            indexMovieShow(0,10,decideshowOrHide);
        });
        $("#recommended_station").on('click',function(event) {
            movieAutoLoad('hot');
        });
        $("#Feature").on('click',function(event) {
            movieAutoLoad('stars');
        });
        $("#look_around").on('click',function(event) {
            movieAutoLoad('rand');
        });
        /**
         * [description]加载更多
         * @param  {[type]} event) {                                   if($(document).scrollTop() + $(window).height() > $(document).height() - 1){                if($("#noSomeThing").css('display') [description]
         * @return {[type]}        [description]
         */

        $(window).bind('scroll', function(event) {
            /* Act on the event */
                if($(document).scrollTop() + $(window).height() > $(document).height() - 10){
                    if($("#noSomeThing").css('display') == 'none' && isClick == true){
                        $("#uploadMore_box").css('display', 'block');
                        $("#load_spacing_interval").css('display', 'none');
                        var pageone = parseInt($("#page").val());
                        var pagepart = parseInt($("#pagepart").val());
                        var last_postid = parseInt($("#last_postid").val());
                        if($("#brotherss_isters"). hasClass("selected_nav")){
                            page++;
                            var decideshowOrHide = 0;
                            indexMovieShow(page,10,decideshowOrHide);
                            isClick = false;
                            setTimeout(function(){
                                isClick = true;
                            },1000);
                        }
                        if($("#recommended_station"). hasClass("selected_nav")){
                            moreShortFilm('hot',pageone,pagepart,last_postid);
                            isClick = false;
                            setTimeout(function(){
                                isClick = true;
                            },1000);
                        }
                        if($("#Feature"). hasClass("selected_nav")){
                            moreShortFilm('stars',pageone,pagepart,last_postid);
                            isClick = false;
                            setTimeout(function(){
                                isClick = true;
                            },1000);
                        }
                        if($("#look_around"). hasClass("selected_nav")){
                            moreShortFilm('rand',pageone,pagepart,last_postid);
                            isClick = false;
                            setTimeout(function(){
                                isClick = true;
                            },1000);
                        }
                    }
                }
        });

        /**
         * 设定导航栏向上滑动时固定在顶部
         */
        //获取导航距离页面顶部的距离
        var toTopHeight = $(".index_movie_select").offset().top;

        //监听页面滚动
        $(window).scroll(function() {
            //页面滚动时让input失去焦点
            if($(document).scrollTop() > 210){
                $("#index-input-url").blur();
            }
            //判断页面滚动超过导航时执行的代码
            if( $(document).scrollTop() > toTopHeight ){
                //检测是否为IE6。jQuery1.9中去掉了msie的方法，所以只好这样写
                if ('undefined' == typeof(document.body.style.maxHeight)) {
                    //页面滚动的距离
                    var scrollTop = $(document).scrollTop();
                    //IE6下，用absolute定位，并设置Top值为距离页面顶部的距离
                    $(".index_movie_select").css({'position':'absolute','top':scrollTop+'px'});
                }else{
                    //IE6以上浏览器采用fixed定位
                    $(".index_movie_select").addClass("nav_fixed");
                }
            }else{//判断页面滚动没有超过导航时执行的代码
                if ('undefined' == typeof(document.body.style.maxHeight)) {
                    //设置Top值为导航距页面顶部的初始值。（IE6为了防止浏览器一下滚动过多，所以不能采用直接去掉定位的方法）
                    $(".index_movie_select").css({'position':'absolute','top':toTopHeight+'px'});
                }else{
                    //IE6以上浏览器移除fixed定位，采用默认流布局
                    $(".index_movie_select").removeClass("nav_fixed");
                }
            }
        });


    });
};
/**
 * [goToPlay description]
 * @param  {[type]} bj [description]
 * @return {[type]}    [description]
 */
function goToPlay(bj){
    var title_key = $("#hidden_title").val();
	var index= bj.attributes['index'].value;
    var title = bj.firstChild.innerHTML;
	window.location.href= BASEURL + "m/play?index="+index+"&k="+title_key+"&t="+title;
}
/**
 * [initSearchList description]
 * @return {[type]} [description]
 */
function searchResouce(){
    $(".demoSpan1").on('click',  function(event) {
        var name = $(".search_header_search .search_input").val();
        if(name === ''){
            return false;
        }else{
            window.location.href=BASEURL + "m/search?title="+ name;
        }
    });
    $(document).on("keydown", function (event) {
        var userAgent = navigator.userAgent.toLowerCase();
        var keycode;
        if (userAgent.indexOf('firefox') >= 0 || userAgent.indexOf('ie') >= 0) {
            keycode = event.which;
        } else {
            var ev = (event === undefined)
                ? window.event
                : event;
            keycode = ev.keyCode;
        }
        if (keycode === 13 && document.activeElement.id === "search_input") {
            var name = $(".search_header_search .search_input").val();
            if(name === ''){
                return false;
            }else{
                window.location.href=BASEURL + "m/search?title="+ name;
            }
        }
    });
}
mobile.initSearchList = function () {
    "use strict";
    $(document).ready(function() {
    	var title = $("#hidden_title").val();
        showList(title);
        searchResouce();
    });
    function showList(name){
    	$.ajax({
    		url: BASEURL + 'api/searchShow',
    		type: 'GET',
    		dataType: 'json',
    		data: {
    			keyword: name,
    		},
    	})
    	.done(function(data) {
            // console.log(data);
    		if(data.status == 0 && data.result.length !== 0){
    			var len = data.result.length;
    			for (var i = 0; i < len; i++) {
    				var title = data.result[i].title;
    				var image = data.result[i].image;
                    var updated = data.result[i].updated;
    				var desc = data.result[i].desc;
                    var type = data.result[i].type;

    				var figure = document.createElement('figure');
                    figure.setAttribute('index',i);
    				figure.setAttribute('onclick','goToPlay(this)');
    				document.getElementById('search_main').appendChild(figure);

                    var ltitle = document.createElement('figcaption');
                    ltitle.innerHTML = title;
                    figure.appendChild(ltitle);

    				var limage = document.createElement('img');
    				limage.setAttribute('class','images');
    				limage.src = image;
    				figure.appendChild(limage);

    				var ldesc = document.createElement('p');
    				ldesc.setAttribute('class','search_desc');
    				ldesc.innerHTML = desc;
    				figure.appendChild(ldesc);

                    if(type !== 1 && type !== 6 && type !== 8){
                        var lupdate = document.createElement('p');
                        lupdate.setAttribute('class','search_update');
                        lupdate.setAttribute('id','search_update'+i);
                        lupdate.innerHTML = '更新至:';
                        figure.appendChild(lupdate);

                        var total = document.createElement('a');
                        total.innerHTML = updated;
                        document.getElementById('search_update'+i).appendChild(total);
                    }
    			}
                /**
                 * [description]搜索内容简介字数限定
                 * @param  {[type]} ){                         var maxwidth [description]
                 * @return {[type]}     [description]
                 */
                $("#search_main .search_desc").each(function(){
                    var maxwidth=60;
                    if($(this).text().length>maxwidth){
                        $(this).text($(this).text().substring(0,maxwidth));
                        $(this).html($(this).html()+'...');
                    }
                });
    		}else{
                $("#iconNoData").css('display', 'block');
                $("#noFindSomeThing").css('display', 'block');
            }
    	})
    	.fail(function() {
    		console.log("error");
    	})
    }
};
function siblings(elm) {
	var a = [];
	var p = elm.parentNode.children;
	for(var i =0,pl= p.length;i<pl;i++) {
		if(p[i] !== elm) a.push(p[i]);
	}
	return a;
}
/**
 * [closeChangePlatform description]关闭切换平台
 * @return {[type]} [description]
 */
function closeChangePlatform(){
    $(".select_platform").css('display', 'none');
    $("#play_shadom").css('display', 'none');
    $("body").css('overflow', 'scroll');
}
/**
 * [goToParse description]改变样式函数并播放电视剧或综艺
 * @param  {[type]} bj [description]
 * @return {[type]}    [description]
 */
function goToParse(bj){
	bj.setAttribute('style','border:1px solid rgb(255,132,164);color:rgb(255,132,164);');
	for (var i = 0; i < bj.children.length; i++) {
		bj.children[i].setAttribute('style','color:rgb(255,132,164);');
	}
	var pNode = siblings(bj);
	for (var i = 0; i < pNode.length; i++) {
		pNode[i].setAttribute('style','border:1px solid rgb(224,224,224);color: rgb(170,170,170);');
		for (var j = 0; j < pNode[i].children.length; j++) {
			pNode[i].children[j].setAttribute('style','color: rgb(170,170,170);');
		}
	}
    var divisiveLen = bj.childNodes.length;
    var teleplayUrl = bj.children[0].innerHTML;
    var teleplayImage = $(".video_info figure .video_img").attr("src");
    if(divisiveLen == 2){
        var teleplayTitle = $(".video_info figure figcaption").html();
    }else{
        var teleplayTitle = bj.children[1].innerHTML
    }
    saveData(teleplayUrl,teleplayImage,teleplayTitle);
}
/**
 * [playFirstEpisode description]电视剧和综艺直接点击播放默认播放第一集
 * @return {[type]} [description]
 */
function playFirstEpisode(){
    var firstPlayEpisode = document.getElementById('episode_main').childNodes[0].childNodes[0];
    var divisiveLen = document.getElementById('episode_main').childNodes[0].childNodes[0].childNodes.length;
    var firstPlayEpisodeImage = $(".video_info figure .video_img").attr("src");
    var firstPlayEpisodeUrl = firstPlayEpisode.childNodes[0].innerHTML;
    if(divisiveLen == 2){
        var firstPlayEpisodeTitle = $(".video_info figure figcaption").html();
    }else{
        var firstPlayEpisodeTitle = firstPlayEpisode.childNodes[1].innerHTML;
    }
    saveData(firstPlayEpisodeUrl,firstPlayEpisodeImage,firstPlayEpisodeTitle);
}
/**
 * [channelType description]修改平台时根据平台修改播放源及决定显示是否去广告
 * @param  {[type]} figure               [description]
 * @param  {[type]} select_platform_name [description]
 * @return {[type]}                      [description]
 */
function channelType(figure,select_platform_name){
    closeChangePlatform();
    if(figure == 7){
        switch(select_platform_name) {
            case '优酷':
                $(".video_info figure .clip_logo").attr('src',BASEURL+'images/iconSourceYouku@2x.png');
                $(".video_info figure .clip_name").html(select_platform_name);
                break;
            case '土豆':
                $(".video_info figure .clip_logo").attr('src',BASEURL+'images/iconSourceTudou@2x.png');
                $(".video_info figure .clip_name").html(select_platform_name);
                break;
            case '搜狐':
                $(".video_info figure .clip_logo").attr('src',BASEURL+'images/iconSourceSohu@2x.png');
                $(".video_info figure .clip_name").html(select_platform_name);
                break;
            case 'PPTV':
                $(".video_info figure .clip_logo").attr('src',BASEURL+'images/iconSourcePptv@2x.png');
                $(".video_info figure .clip_name").html(select_platform_name);
                $(".video_info figure .pulldown_logo").after('<p class="no_parse">(暂未能去广告)</p>');
                break;
            case '新浪':
                $(".video_info figure .clip_logo").attr('src',BASEURL+'images/iconSourceSina@2x.png');
                $(".video_info figure .clip_name").html(select_platform_name);
                $(".video_info figure .pulldown_logo").after('<p class="no_parse">(暂未能去广告)</p>');
                break;
            case '腾讯':
                $(".video_info figure .clip_logo").attr('src',BASEURL+'images/iconSourceTencent@2x.png');
                $(".video_info figure .clip_name").html(select_platform_name);
                $(".video_info figure .pulldown_logo").after('<p class="no_parse">(暂未能去广告)</p>');
                break;
            case '爱奇艺':
                $(".video_info figure .clip_logo").attr('src',BASEURL+'images/iconSourceIqiyi@2x.png');
                $(".video_info figure .clip_name").html(select_platform_name);
                $(".video_info figure .pulldown_logo").after('<p class="no_parse">(暂未能去广告)</p>');
                break;
            case '芒果TV':
                $(".video_info figure .clip_logo").attr('src',BASEURL+'images/iconSourceMango@2x.png');
                $(".video_info figure .clip_name").html(select_platform_name);
                $(".video_info figure .pulldown_logo").after('<p class="no_parse">(暂未能去广告)</p>');
                break;
            case '华数tv':
                $(".video_info figure .clip_logo").attr('src',BASEURL+'images/iconSourceWasu@2x.png');
                $(".video_info figure .clip_name").html(select_platform_name);
                $(".video_info figure .pulldown_logo").after('<p class="no_parse">(暂未能去广告)</p>');
                break;
            case '风行网':
                $(".video_info figure .clip_logo").attr('src',BASEURL+'images/iconSourceFun@2x.png');
                $(".video_info figure .clip_name").html(select_platform_name);
                $(".video_info figure .pulldown_logo").after('<p class="no_parse">(暂未能去广告)</p>');
                break;
        }
    }else{
        switch(select_platform_name) {
            case '优酷':
                $(".video_info figure .clip_logo").attr('src',BASEURL+'images/iconSourceYouku@2x.png');
                $(".video_info figure .clip_name").html(select_platform_name);
                $(".video_info figure .no_parse").remove();
                break;
            case '土豆':
                $(".video_info figure .clip_logo").attr('src',BASEURL+'images/iconSourceTudou@2x.png');
                $(".video_info figure .clip_name").html(select_platform_name);
                $(".video_info figure .no_parse").remove();
                break;
            case '搜狐':
                $(".video_info figure .clip_logo").attr('src',BASEURL+'images/iconSourceSohu@2x.png');
                $(".video_info figure .clip_name").html(select_platform_name);
                $(".video_info figure .no_parse").remove();
                break;
            case 'PPTV':
                $(".video_info figure .clip_logo").attr('src',BASEURL+'images/iconSourcePptv@2x.png');
                $(".video_info figure .clip_name").html(select_platform_name);
                break;
            case '新浪':
                $(".video_info figure .clip_logo").attr('src',BASEURL+'images/iconSourceSina@2x.png');
                $(".video_info figure .clip_name").html(select_platform_name);
                break;
            case '腾讯':
                $(".video_info figure .clip_logo").attr('src',BASEURL+'images/iconSourceTencent@2x.png');
                $(".video_info figure .clip_name").html(select_platform_name);
                break;
            case '爱奇艺':
                $(".video_info figure .clip_logo").attr('src',BASEURL+'images/iconSourceIqiyi@2x.png');
                $(".video_info figure .clip_name").html(select_platform_name);
                break;
            case '芒果TV':
                $(".video_info figure .clip_logo").attr('src',BASEURL+'images/iconSourceMango@2x.png');
                $(".video_info figure .clip_name").html(select_platform_name);
                break;
            case '华数tv':
                $(".video_info figure .clip_logo").attr('src',BASEURL+'images/iconSourceWasu@2x.png');
                $(".video_info figure .clip_name").html(select_platform_name);
                break;
            case '风行网':
                $(".video_info figure .clip_logo").attr('src',BASEURL+'images/iconSourceFun@2x.png');
                $(".video_info figure .clip_name").html(select_platform_name);
                break;
        }
    }
}
/**
 * [goToChange description]改变平台函数
 * @param  {[type]} dj [description]
 * @return {[type]}    [description]
 */
function goToChange(dj){
    var figure = $("figure").children().length;
    var select_channels = dj.firstChild.innerHTML;
    var select_platform_name = dj.lastChild.childNodes[1].innerHTML;
    channelType(figure,select_platform_name);
    $(".video_info .episode_intro_show .episode_main .play_episode").empty();
    showEpisode(select_channels);
}
function goToChangeForSouku(tj){
    var figure = $("figure").children().length;
    var select_platform_chineseName = tj.lastChild.childNodes[1].innerHTML;
    var select_platform_name = tj.childNodes[0].innerHTML;
    var selectionEpisodeSouku = JSON.parse($("#selectionVideoPreload").val());
    selectionEpisodeSouku = selectionEpisodeSouku[select_platform_name];
    // console.log(selectionEpisodeSouku);
    // console.log(select_platform_chineseName);
    channelType(figure,select_platform_chineseName);
    $(".video_info .episode_intro_show .episode_main .play_episode").empty();
    if(selectionEpisodeSouku.length > 0){
        for (var i = 0; i < selectionEpisodeSouku.length; i++) {
            $(".video_info .episode_intro_show .episode_main .play_episode").eq(0).append('<p onclick="goToParse(this)"><span class="episode_url">'+selectionEpisodeSouku[i].url+'</span>'+ selectionEpisodeSouku[i].tag + '</p>');
        };
    }
}
function showEpisode(selectedChannel){
    $.ajax({
        url: BASEURL + 'api/getEpisodesByChannel',
        type: 'POST',
        dataType: 'json',
        data: {
            channel: selectedChannel,
        },
    })
    .done(function(data) {
        // console.log(data);
        for (var i = 0; i < data.length; i++) {
            $(".video_info .episode_intro_show .episode_main .play_episode").eq(0).append('<p onclick="goToParse(this)"><span class="episode_url">'+data[i].url+'</span>'+ data[i].playno + '</p>');
        };
    })
    .fail(function() {
        console.log("error");
    })
}

/**
 * [selectionEpisode description]剧集与简介的切换
 * @param  {[type]} kj [description]
 * @return {[type]}    [description]
 */
function selectionEpisode(kj){
    $(kj).css('border-bottom', '3px solid rgb(244,24,81)');
    $(kj).css('color', 'rgb(51,51,51)');
    $(".video_info .episode_intro .info_right").css('border-bottom', 'none');
    $(".video_info .episode_intro .info_right").css('color', 'rgb(153,153,153)');
    $(".video_info .episode_intro_show .episode_main").css('display', 'block');
    $(".video_info .episode_intro_show .intro_main").css('display', 'none');
}
function selectionIntro(lj){
    $(lj).css('border-bottom', '3px solid rgb(244,24,81)');
    $(lj).css('color', 'rgb(51,51,51)');
    $(".video_info .episode_intro .info_left").css('border-bottom', 'none');
    $(".video_info .episode_intro .info_left").css('color', 'rgb(153,153,153)');
    $(".video_info .episode_intro_show .episode_main").css('display', 'none');
    $(".video_info .episode_intro_show .intro_main").css('display', 'block');
}
/**
 * [changePlatform description]切换平台样式
 * @return {[type]} [description]
 */
function changePlatform(){
    $(".select_platform").css('display', 'block');
    $("#play_shadom").css('display', 'block');
    $("body").css('overflow', 'hidden');
}
/**
 * [goToPlayMovie description]请求接口获取的电影播放
 * @param  {[type]} sj [description]
 * @return {[type]}    [description]
 */
function goToPlayMovie(sj){
    closeChangePlatform();
    var movieUrl = sj.firstChild.innerHTML;
    var movieTitle = $(".video_info figure figcaption").html();
    var movieImage = $(".video_info figure .video_img").attr("src");
    saveData(movieUrl,movieTitle,movieImage);
}
/**
 * [goToPlayMovieForSouku description]搜库电影播放
 * @param  {[type]} qj [description]
 * @return {[type]}    [description]
 */
function goToPlayMovieForSouku(qj){
    var figure = $("figure").children().length;
    var select_platform_name = qj.lastChild.childNodes[1].innerHTML;
    channelType(figure,select_platform_name);
    goToPlayMovie(qj);
}
/**
 * [playLoadMovie description]野鸡网电影播放
 * @param  {[type]} aj [description]
 * @return {[type]}    [description]
 */
function playLoadMovie(aj){
    var loadMovieUrl = $(aj).next()[0].innerHTML;
    var movieTitle = aj.parentNode.childNodes[1].innerHTML;
    var movieImage  = aj.parentNode.childNodes[0].src;
    saveData(loadMovieUrl,movieImage,movieTitle);
}
/**
 * [saveData description]所有视频播放前请求信息入库接口
 * @param  {[type]} url   [description]
 * @param  {[type]} image [description]
 * @param  {[type]} title [description]
 * @return {[type]}       [description]
 */
function saveData(url,image,title){
    $.ajax({
        url: BASEURL + 'm/saveData',
        type: 'POST',
        dataType: 'json',
        data: {
            url: url,
            image: image,
            title: title,
        },
    })
    .done(function(data) {
        // console.log("success");
        // console.log(data);
        if(data.status !== -1){
            var id = data.id;
            window.location.href = BASEURL + "m/video?id=" + id;
        }
    })
    .fail(function() {
        console.log("error");
        alert("视频获取错误,请刷新一次");
    })
}
mobile.initPlay = function () {
    "use strict";
    $(document).ready(function() {
    	var index = parseInt($("#hidden_index").val());
        var title = $("#hidden_t").val();
        var id = $("#hidden_id").val();
        searchResouce();
        if(id !== 'null'){
            var id = parseInt(id);
            $.ajax({
                url: BASEURL + 'waveTVPlayByIdShow',
                type: 'GET',
                dataType: 'json',
                data: {
                    id: id
                },
            })
            .done(function(data) {
                if(data.length > 0){
                    var video_for_business = data[0].video_for_business;
                    console.log(video_for_business);
                    $("body").append(
                        '<div class="video_info">'+
                            '<figure>'+
                                '<img src="'+data[0].img+'"/ class="video_img">'+
                                '<figcaption>'+data[0].title+'</figcaption>'+
                                '<p class="click_play" onclick="playFirstEpisode()"></p>'+
                            '</figure>'+
                            '<div class="episode_intro">'+
                                '<div class="box_one box_left">'+
                                    '<p class="info_one info_left" onclick="selectionEpisode(this)">剧集</p>'+
                                '</div>'+
                                '<div class="box_one box_right">'+
                                    '<p class="info_one info_right" onclick="selectionIntro(this)">简介</p>'+
                                '</div>'+
                            '</div>'+
                            '<div class="episode_intro_show">'+
                                '<div class="episode_main" id="episode_main">'+
                                    '<div class="play_episode">'+
                                    '</div>'+
                                '</div>'+
                                '<div class="intro_main">'+data[0].desc+
                                '</div>'+
                            '</div>'+
                        '</div>'
                    );
                    for (var i = 0; i < video_for_business.length; i++) {
                        $(".video_info .episode_intro_show .episode_main .play_episode").eq(0).append('<p onclick="goToParse(this)"><span class="episode_url">'+video_for_business[i].url+'</span>'+(i+1)+ '</p>');
                    }
                }
            })
            .fail(function() {
                console.log("error");
            })

        }else{
            /**
             * [url description]用title请求搜索接口
             * @type {[type]}
             */
            $.ajax({
                url: BASEURL + 'api/searchShow',
                type: 'GET',
                dataType: 'json',
                data: {
                    keyword: title,
                },
            })
            .done(function(data) {
                console.log(data);
                if(data.status == 0){
                    var selectionVideo = data.result[index];
                    var channels = selectionVideo.channels;
                    // console.log(channels.length);
                    if(channels.length !== 0){
                        //视频来源优先级
                        var available = ['youku','tudou', 'sohu', 'pptv', 'sina', 'qq','qiyi','hunantv','huashu','fengxing'];
                        var availableName = ['优酷','土豆', '搜狐', 'PPTV', '新浪', '腾讯','爱奇艺','芒果TV','华数tv','风行网'];
                        var availableLogo = [
                            BASEURL+'images/iconSourceYouku@2x.png',
                            BASEURL+'images/iconSourceTudou@2x.png',
                            BASEURL+'images/iconSourceSohu@2x.png',
                            BASEURL+'images/iconSourcePptv@2x.png',
                            BASEURL+'images/iconSourceSina@2x.png',
                            BASEURL+'images/iconSourceTencent@2x.png',
                            BASEURL+'images/iconSourceIqiyi@2x.png',
                            BASEURL+'images/iconSourceMango@2x.png',
                            BASEURL+'images/iconSourceWasu@2x.png',
                            BASEURL+'images/iconSourceFun@2x.png',
                        ];
                        var selectedChannel = '';
                        var selectedSource = '';
                        var selectionLogo = '';
                    }
                    if(selectionVideo.type == 2|| selectionVideo.type == 4){
                        if(channels.length > 0){
                            for (var x = 0; x < available.length; x++) {
                                for (var j = 0; j < channels.length; j++) {
                                    if (channels[j].indexOf(available[x]) !== -1) {
                                        selectedChannel = channels[j];
                                        selectedSource = availableName[x];
                                        selectionLogo = availableLogo[x];
                                        break;
                                    }
                                }
                                if (selectedChannel) {
                                    break;
                                }
                            }
                            if (!selectedChannel) {
                                selectedChannel = channels[0];
                                selectedSource = '未知';
                                selectionLogo = BASEURL + 'images/iconSourceUnknown@2x.png';
                            }
                        }
                        // $(".video_info figure .clip_name").html(selectedSource);
                        $("#hidden_selectedChannel").val(selectedChannel);
                        // $(".video_info figure .clip_logo").attr('src',selectionLogo);

                        if(selectionVideo.type == 2){
                            if(selectedSource == '优酷' || selectedSource == '土豆' || selectedSource == '搜狐'){
                                $("body").append(
                                    '<div class="video_info">'+
                                        '<figure>'+
                                            '<img src="'+selectionVideo.image+'"/ class="video_img">'+
                                            '<figcaption>'+selectionVideo.title+'</figcaption>'+
                                            '<p class="search_update">更新至:<a>'+selectionVideo.updated+'</a></p>'+
                                            '<p class="play_clip">播放源:</p>'+
                                            '<p class="play_clip_info" onclick="changePlatform()">'+
                                                '<img src="'+selectionLogo+'" alt="" class="clip_logo">'+
                                                '<span class="clip_name">'+selectedSource+'</span>'+
                                            '</p>'+
                                            '<img src="'+BASEURL+'images/btnMoreSource@2x.png" alt="" class="pulldown_logo">'+
                                            '<p class="click_play" onclick="playFirstEpisode()"></p>'+
                                        '</figure>'+
                                        '<div class="episode_intro">'+
                                            '<div class="box_one box_left">'+
                                                '<p class="info_one info_left" onclick="selectionEpisode(this)">剧集</p>'+
                                            '</div>'+
                                            '<div class="box_one box_right">'+
                                                '<p class="info_one info_right" onclick="selectionIntro(this)">简介</p>'+
                                            '</div>'+
                                        '</div>'+
                                        '<div class="episode_intro_show">'+
                                            '<div class="episode_main" id="episode_main">'+
                                                '<div class="play_episode">'+
                                                '</div>'+
                                            '</div>'+
                                            '<div class="intro_main">'+selectionVideo.desc+
                                            '</div>'+
                                        '</div>'+
                                    '</div>'+
                                    '<div class="select_platform">'+
                                        '<div class="select_platform_info">'+
                                        '</div>'+
                                        '<p class="cancel_button" onclick="closeChangePlatform()">取消</p>'+
                                    '</div>'+
                                    '<div id="play_shadom"></div>'
                                );
                            }else{
                                $("body").append(
                                    '<div class="video_info">'+
                                        '<figure>'+
                                            '<img src="'+selectionVideo.image+'"/ class="video_img">'+
                                            '<figcaption>'+selectionVideo.title+'</figcaption>'+
                                            '<p class="search_update">更新至:<a>'+selectionVideo.updated+'</a></p>'+
                                            '<p class="play_clip">播放源:</p>'+
                                            '<p class="play_clip_info" onclick="changePlatform()">'+
                                                '<img src="'+selectionLogo+'" alt="" class="clip_logo">'+
                                                '<span class="clip_name">'+selectedSource+'</span>'+
                                            '</p>'+
                                            '<img src="'+BASEURL+'images/btnMoreSource@2x.png" alt="" class="pulldown_logo">'+
                                            '<p class="no_parse">(暂未能去广告)</p>'+
                                            '<p class="click_play" onclick="playFirstEpisode()"></p>'+
                                        '</figure>'+
                                        '<div class="episode_intro">'+
                                            '<div class="box_one box_left">'+
                                                '<p class="info_one info_left" onclick="selectionEpisode(this)">剧集</p>'+
                                            '</div>'+
                                            '<div class="box_one box_right">'+
                                                '<p class="info_one info_right" onclick="selectionIntro(this)">简介</p>'+
                                            '</div>'+
                                        '</div>'+
                                        '<div class="episode_intro_show">'+
                                            '<div class="episode_main" id="episode_main">'+
                                                '<div class="play_episode">'+
                                                '</div>'+
                                            '</div>'+
                                            '<div class="intro_main">'+selectionVideo.desc+
                                            '</div>'+
                                        '</div>'+
                                    '</div>'+
                                    '<div class="select_platform">'+
                                        '<div class="select_platform_info">'+
                                        '</div>'+
                                        '<p class="cancel_button" onclick="closeChangePlatform()">取消</p>'+
                                    '</div>'+
                                    '<div id="play_shadom"></div>'
                                );
                            }
                            for (var i = 0; i < channels.length; i++) {
                                if(channels[i].indexOf('youku') !== -1){
                                    $(".select_platform .select_platform_info").eq(0).append('<div class="select_platform_one" onclick="goToChange(this)"><p class="select_channels">'+channels[i]+'</p><p><img src="'+BASEURL+'images/iconSourceYouku@2x.png" alt=""><span>优酷</span><span class="tipUpdata">(更新到'+selectionVideo.updated+')</span></p></div>');
                                }
                                if(channels[i].indexOf('tudou') !== -1){
                                    $(".select_platform .select_platform_info").eq(0).append('<div class="select_platform_one" onclick="goToChange(this)"><p class="select_channels">'+channels[i]+'</p><p><img src="'+BASEURL+'images/iconSourceTudou@2x.png" alt=""><span>土豆</span><span class="tipUpdata">(更新到'+selectionVideo.updated+')</span></p></div>');
                                }
                                if(channels[i].indexOf('sohu') !== -1){
                                    $(".select_platform .select_platform_info").eq(0).append('<div class="select_platform_one" onclick="goToChange(this)"><p class="select_channels">'+channels[i]+'</p><p><img src="'+BASEURL+'images/iconSourceSohu@2x.png" alt=""><span>搜狐</span><span class="tipUpdata">(更新到'+selectionVideo.updated+')</span></p></div>');
                                }
                                if(channels[i].indexOf('pptv') !== -1){
                                    $(".select_platform .select_platform_info").eq(0).append('<div class="select_platform_one" onclick="goToChange(this)"><p class="select_channels">'+channels[i]+'</p><p><img src="'+BASEURL+'images/iconSourcePptv@2x.png" alt=""><span>PPTV</span><span class="tipUpdata">(更新到'+selectionVideo.updated+')</span></p></div>');
                                }
                                if(channels[i].indexOf('sina') !== -1){
                                    $(".select_platform .select_platform_info").eq(0).append('<div class="select_platform_one" onclick="goToChange(this)"><p class="select_channels">'+channels[i]+'</p><p><img src="'+BASEURL+'images/iconSourceSina@2x.png" alt=""><span>新浪</span><span class="tipUpdata">(更新到'+selectionVideo.updated+')</span></p></div>');
                                }
                                if(channels[i].indexOf('qq') !== -1){
                                    $(".select_platform .select_platform_info").eq(0).append('<div class="select_platform_one" onclick="goToChange(this)"><p class="select_channels">'+channels[i]+'</p><p><img src="'+BASEURL+'images/iconSourceTencent@2x.png" alt=""><span>腾讯</span><span class="tipUpdata">(更新到'+selectionVideo.updated+')</span></p></div>');
                                }
                                if(channels[i].indexOf('qiyi') !== -1){
                                    $(".select_platform .select_platform_info").eq(0).append('<div class="select_platform_one" onclick="goToChange(this)"><p class="select_channels">'+channels[i]+'</p><p><img src="'+BASEURL+'images/iconSourceIqiyi@2x.png" alt=""><span>爱奇艺</span><span class="tipUpdata">(更新到'+selectionVideo.updated+')</span></p></div>');
                                }
                                if(channels[i].indexOf('huashu') !== -1){
                                    $(".select_platform .select_platform_info").eq(0).append('<div class="select_platform_one" onclick="goToChange(this)"><p class="select_channels">'+channels[i]+'</p><p><img src="'+BASEURL+'images/iconSourceWasu@2x.png" alt=""><span>华数tv</span><span class="tipUpdata">(更新到'+selectionVideo.updated+')</span></p></div>');
                                }
                                if(channels[i].indexOf('hunantv') !== -1){
                                    $(".select_platform .select_platform_info").eq(0).append('<div class="select_platform_one" onclick="goToChange(this)"><p class="select_channels">'+channels[i]+'</p><p><img src="'+BASEURL+'images/iconSourceMango@2x.png" alt=""><span>芒果TV</span><span class="tipUpdata">(更新到'+selectionVideo.updated+')</span></p></div>');
                                }
                                if(channels[i].indexOf('fengxing') !== -1){
                                    $(".select_platform .select_platform_info").eq(0).append('<div class="select_platform_one" onclick="goToChange(this)"><p class="select_channels">'+channels[i]+'</p><p><img src="'+BASEURL+'images/iconSourceFun@2x.png" alt=""><span>风行网</span><span class="tipUpdata">(更新到'+selectionVideo.updated+')</span></p></div>');
                                }
                            }
                            showEpisode(selectedChannel);
                        }else{
                            if(selectedSource == '优酷' || selectedSource == '土豆' || selectedSource == '搜狐'){
                                $("body").append(
                                    '<div class="video_info">'+
                                        '<figure>'+
                                            '<img src="'+selectionVideo.image+'"/ class="video_img">'+
                                            '<figcaption>'+selectionVideo.title+'</figcaption>'+
                                            '<p class="search_update">更新至:<a>'+selectionVideo.updated+'</a></p>'+
                                            '<p class="play_clip">播放源:</p>'+
                                            '<p class="play_clip_info" onclick="changePlatform()">'+
                                                '<img src="'+selectionLogo+'" alt="" class="clip_logo">'+
                                                '<span class="clip_name">'+selectedSource+'</span>'+
                                            '</p>'+
                                            '<img src="'+BASEURL+'images/btnMoreSource@2x.png" alt="" class="pulldown_logo">'+
                                            '<p class="click_play" onclick="playFirstEpisode()"></p>'+
                                        '</figure>'+
                                        '<div class="episode_intro">'+
                                            '<div class="box_one box_left">'+
                                                '<p class="info_one info_left" onclick="selectionEpisode(this)">剧集</p>'+
                                            '</div>'+
                                            '<div class="box_one box_right">'+
                                                '<p class="info_one info_right" onclick="selectionIntro(this)">简介</p>'+
                                            '</div>'+
                                        '</div>'+
                                        '<div class="episode_intro_show">'+
                                            '<div class="episode_main" id="episode_main">'+
                                                '<div class="play_episode">'+
                                                '</div>'+
                                            '</div>'+
                                            '<div class="intro_main">'+selectionVideo.desc+
                                            '</div>'+
                                        '</div>'+
                                    '</div>'+
                                    '<div class="select_platform">'+
                                        '<div class="select_platform_info">'+
                                        '</div>'+
                                        '<p class="cancel_button" onclick="closeChangePlatform()">取消</p>'+
                                    '</div>'+
                                    '<div id="play_shadom"></div>'
                                );
                            }else{
                                $("body").append(
                                    '<div class="video_info">'+
                                        '<figure>'+
                                            '<img src="'+selectionVideo.image+'"/ class="video_img">'+
                                            '<figcaption>'+selectionVideo.title+'</figcaption>'+
                                            '<p class="search_update">更新至:<a>'+selectionVideo.updated+'</a></p>'+
                                            '<p class="play_clip">播放源:</p>'+
                                            '<p class="play_clip_info" onclick="changePlatform()">'+
                                                '<img src="'+selectionLogo+'" alt="" class="clip_logo">'+
                                                '<span class="clip_name">'+selectedSource+'</span>'+
                                            '</p>'+
                                            '<img src="'+BASEURL+'images/btnMoreSource@2x.png" alt="" class="pulldown_logo">'+
                                            '<p class="no_parse">(暂未能去广告)</p>'+
                                            '<p class="click_play" onclick="playFirstEpisode()"></p>'+
                                        '</figure>'+
                                        '<div class="episode_intro">'+
                                            '<div class="box_one box_left">'+
                                                '<p class="info_one info_left" onclick="selectionEpisode(this)">剧集</p>'+
                                            '</div>'+
                                            '<div class="box_one box_right">'+
                                                '<p class="info_one info_right" onclick="selectionIntro(this)">简介</p>'+
                                            '</div>'+
                                        '</div>'+
                                        '<div class="episode_intro_show">'+
                                            '<div class="episode_main" id="episode_main">'+
                                                '<div class="play_episode">'+
                                                '</div>'+
                                            '</div>'+
                                            '<div class="intro_main">'+selectionVideo.desc+
                                            '</div>'+
                                        '</div>'+
                                    '</div>'+
                                    '<div class="select_platform">'+
                                        '<div class="select_platform_info">'+
                                        '</div>'+
                                        '<p class="cancel_button" onclick="closeChangePlatform()">取消</p>'+
                                    '</div>'+
                                    '<div id="play_shadom"></div>'
                                );
                            }
                            for (var i = 0; i < channels.length; i++) {
                                if(channels[i].indexOf('youku') !== -1){
                                    $(".select_platform .select_platform_info").eq(0).append('<div class="select_platform_one" onclick="goToChange(this)"><p class="select_channels">'+channels[i]+'</p><p><img src="'+BASEURL+'images/iconSourceYouku@2x.png" alt=""><span>优酷</span><span class="tipUpdata">(更新到'+selectionVideo.updated+')</span></p></div>');
                                }
                                if(channels[i].indexOf('tudou') !== -1){
                                    $(".select_platform .select_platform_info").eq(0).append('<div class="select_platform_one" onclick="goToChange(this)"><p class="select_channels">'+channels[i]+'</p><p><img src="'+BASEURL+'images/iconSourceTudou@2x.png" alt=""><span>土豆</span><span class="tipUpdata">(更新到'+selectionVideo.updated+')</span></p></div>');
                                }
                                if(channels[i].indexOf('sohu') !== -1){
                                    $(".select_platform .select_platform_info").eq(0).append('<div class="select_platform_one" onclick="goToChange(this)"><p class="select_channels">'+channels[i]+'</p><p><img src="'+BASEURL+'images/iconSourceSohu@2x.png" alt=""><span>搜狐</span><span class="tipUpdata">(更新到'+selectionVideo.updated+')</span></p></div>');
                                }
                                if(channels[i].indexOf('pptv') !== -1){
                                    $(".select_platform .select_platform_info").eq(0).append('<div class="select_platform_one" onclick="goToChange(this)"><p class="select_channels">'+channels[i]+'</p><p><img src="'+BASEURL+'images/iconSourcePptv@2x.png" alt=""><span>PPTV</span><span class="tipUpdata">(更新到'+selectionVideo.updated+')</span></p></div>');
                                }
                                if(channels[i].indexOf('sina') !== -1){
                                    $(".select_platform .select_platform_info").eq(0).append('<div class="select_platform_one" onclick="goToChange(this)"><p class="select_channels">'+channels[i]+'</p><p><img src="'+BASEURL+'images/iconSourceSina@2x.png" alt=""><span>新浪</span><span class="tipUpdata">(更新到'+selectionVideo.updated+')</span></p></div>');
                                }
                                if(channels[i].indexOf('qq') !== -1){
                                    $(".select_platform .select_platform_info").eq(0).append('<div class="select_platform_one" onclick="goToChange(this)"><p class="select_channels">'+channels[i]+'</p><p><img src="'+BASEURL+'images/iconSourceTencent@2x.png" alt=""><span>腾讯</span><span class="tipUpdata">(更新到'+selectionVideo.updated+')</span></p></div>');
                                }
                                if(channels[i].indexOf('qiyi') !== -1){
                                    $(".select_platform .select_platform_info").eq(0).append('<div class="select_platform_one" onclick="goToChange(this)"><p class="select_channels">'+channels[i]+'</p><p><img src="'+BASEURL+'images/iconSourceIqiyi@2x.png" alt=""><span>爱奇艺</span><span class="tipUpdata">(更新到'+selectionVideo.updated+')</span></p></div>');
                                }
                                if(channels[i].indexOf('huashu') !== -1){
                                    $(".select_platform .select_platform_info").eq(0).append('<div class="select_platform_one" onclick="goToChange(this)"><p class="select_channels">'+channels[i]+'</p><p><img src="'+BASEURL+'images/iconSourceWasu@2x.png" alt=""><span>华数tv</span><span class="tipUpdata">(更新到'+selectionVideo.updated+')</span></p></div>');
                                }
                                if(channels[i].indexOf('hunantv') !== -1){
                                    $(".select_platform .select_platform_info").eq(0).append('<div class="select_platform_one" onclick="goToChange(this)"><p class="select_channels">'+channels[i]+'</p><p><img src="'+BASEURL+'images/iconSourceMango@2x.png" alt=""><span>芒果TV</span><span class="tipUpdata">(更新到'+selectionVideo.updated+')</span></p></div>');
                                }
                                if(channels[i].indexOf('fengxing') !== -1){
                                    $(".select_platform .select_platform_info").eq(0).append('<div class="select_platform_one" onclick="goToChange(this)"><p class="select_channels">'+channels[i]+'</p><p><img src="'+BASEURL+'images/iconSourceFun@2x.png" alt=""><span>风行网</span><span class="tipUpdata">(更新到'+selectionVideo.updated+')</span></p></div>');
                                }
                            }
                            showEpisode(selectedChannel);
                        }
                    }
                    if(selectionVideo.type == 1 || selectionVideo.type == 3  || selectionVideo.type == 5 || selectionVideo.type == 6 || selectionVideo.type == 7 || selectionVideo.type == 8 || selectionVideo.type == 9){
                        var preload = selectionVideo.preload;
                        var preloadJson = JSON.stringify(preload);
                        $("#selectionVideoPreload").val(preloadJson);
                        var arr = [];
                        var arrValue = [];
                        for(var s in preload){
                            arr.push(s);
                            arrValue.push(preload[s]);
                        }
                        // console.log(arr);
                        // console.log(arrValue);
                        var availableSouku = ['youku','tudou', 'sohu', 'pptv', 'sina', 'qq','qiyi','hunantv','huashu','fengxing'];
                        var availableNameSouku = ['优酷','土豆', '搜狐', 'PPTV', '新浪', '腾讯','爱奇艺','芒果TV','华数tv','风行网'];
                        var availableLogoSouku = [
                            BASEURL+'images/iconSourceYouku@2x.png',
                            BASEURL+'images/iconSourceTudou@2x.png',
                            BASEURL+'images/iconSourceSohu@2x.png',
                            BASEURL+'images/iconSourcePptv@2x.png',
                            BASEURL+'images/iconSourceSina@2x.png',
                            BASEURL+'images/iconSourceTencent@2x.png',
                            BASEURL+'images/iconSourceIqiyi@2x.png',
                            BASEURL+'images/iconSourceMango@2x.png',
                            BASEURL+'images/iconSourceWasu@2x.png',
                            BASEURL+'images/iconSourceFun@2x.png',
                        ];
                        var selectedTypeSouku = '';
                        var selectedSourceSouku = '';
                        var selectionLogoSouku = '';
                        var selectionEpisodeSouku = '';
                        for (var x = 0; x < availableSouku.length; x++) {
                            for (var j = 0; j < arr.length; j++) {
                                if (arr[j].indexOf(availableSouku[x]) !== -1) {
                                    selectedTypeSouku = arr[j];
                                    selectedSourceSouku = availableNameSouku[x];
                                    selectionLogoSouku = availableLogoSouku[x];
                                    selectionEpisodeSouku = arrValue[j];
                                    break;
                                }
                            }
                            if (selectedTypeSouku) {
                                break;
                            }
                        }
                        if (!selectedTypeSouku) {
                            selectedTypeSouku = arr[0];
                            selectionEpisodeSouku = arrValue[0];
                            selectedSourceSouku = '未知';
                            selectionLogoSouku = BASEURL + 'images/iconSourceUnknown@2x.png';
                        }
                        // console.log(selectedTypeSouku);
                        // console.log(selectedSourceSouku);
                        // console.log(selectionLogoSouku);
                        // console.log(selectionEpisodeSouku);
                        if(selectionVideo.type == 8){
                            $("body").append(
                                '<div class="video_info">'+
                                    '<figure>'+
                                        '<img src="'+selectionVideo.image+'"/ class="video_img">'+
                                        '<figcaption>'+selectionVideo.title+'</figcaption>'+
                                        '<p class="play_clip">播放源:</p>'+
                                        '<p class="play_clip_info">'+
                                            '<img src="'+BASEURL+'images/iconSourceUnknown@2x.png" alt="" class="clip_logo">'+
                                            '<span class="clip_name">未知</span>'+
                                        '</p>'+
                                        '<p class="click_play" onclick="playLoadMovie(this)"></p>'+
                                        '<p class="hidden_url">'+selectionVideo.preload.qiniu[0].url+'</p>'+
                                    '</figure>'+
                                '</div>'+
                                '<div class="movie_show_style">'+
                                    '<div class="movie_show_head">'+
                                        '<p>电影简介</p>'+
                                    '</div>'+
                                    '<div class="movie_show_desc">'+selectionVideo.desc+
                                    '</div>'+
                                '</div>'
                            );
                        }else if(selectionVideo.type == 5 || selectionVideo.type == 9){
                            if(selectedSourceSouku == '优酷' || selectedSourceSouku == '土豆' || selectedSourceSouku == '搜狐'){
                                $("body").append(
                                    '<div class="video_info">'+
                                        '<figure>'+
                                            '<img src="'+selectionVideo.image+'"/ class="video_img">'+
                                            '<figcaption>'+selectionVideo.title+'</figcaption>'+
                                            '<p class="search_update">更新至:<a>'+selectionVideo.updated+'</a></p>'+
                                            '<p class="play_clip">播放源:</p>'+
                                            '<p class="play_clip_info" onclick="changePlatform()">'+
                                                '<img src="'+selectionLogoSouku+'" alt="" class="clip_logo">'+
                                                '<span class="clip_name">'+selectedSourceSouku+'</span>'+
                                            '</p>'+
                                            '<img src="'+BASEURL+'images/btnMoreSource@2x.png" alt="" class="pulldown_logo">'+
                                            '<p class="click_play" onclick="playFirstEpisode()"></p>'+
                                        '</figure>'+
                                        '<div class="episode_intro">'+
                                            '<div class="box_one box_left">'+
                                                '<p class="info_one info_left" onclick="selectionEpisode(this)">剧集</p>'+
                                            '</div>'+
                                            '<div class="box_one box_right">'+
                                                '<p class="info_one info_right" onclick="selectionIntro(this)">简介</p>'+
                                            '</div>'+
                                        '</div>'+
                                        '<div class="episode_intro_show">'+
                                            '<div class="episode_main" id="episode_main">'+
                                                '<div class="play_episode">'+
                                                '</div>'+
                                            '</div>'+
                                            '<div class="intro_main">'+selectionVideo.desc+
                                            '</div>'+
                                        '</div>'+
                                    '</div>'+
                                    '<div class="select_platform">'+
                                        '<div class="select_platform_info">'+
                                        '</div>'+
                                        '<p class="cancel_button" onclick="closeChangePlatform()">取消</p>'+
                                    '</div>'+
                                    '<div id="play_shadom"></div>'
                                );
                            }else{
                                $("body").append(
                                    '<div class="video_info">'+
                                        '<figure>'+
                                            '<img src="'+selectionVideo.image+'"/ class="video_img">'+
                                            '<figcaption>'+selectionVideo.title+'</figcaption>'+
                                            '<p class="search_update">更新至:<a>'+selectionVideo.updated+'</a></p>'+
                                            '<p class="play_clip">播放源:</p>'+
                                            '<p class="play_clip_info" onclick="changePlatform()">'+
                                                '<img src="'+selectionLogoSouku+'" alt="" class="clip_logo">'+
                                                '<span class="clip_name">'+selectedSourceSouku+'</span>'+
                                            '</p>'+
                                            '<img src="'+BASEURL+'images/btnMoreSource@2x.png" alt="" class="pulldown_logo">'+
                                            '<p class="no_parse">(暂未能去广告)</p>'+
                                            '<p class="click_play" onclick="playFirstEpisode()"></p>'+
                                        '</figure>'+
                                        '<div class="episode_intro">'+
                                            '<div class="box_one box_left">'+
                                                '<p class="info_one info_left" onclick="selectionEpisode(this)">剧集</p>'+
                                            '</div>'+
                                            '<div class="box_one box_right">'+
                                                '<p class="info_one info_right" onclick="selectionIntro(this)">简介</p>'+
                                            '</div>'+
                                        '</div>'+
                                        '<div class="episode_intro_show">'+
                                            '<div class="episode_main" id="episode_main">'+
                                                '<div class="play_episode">'+
                                                '</div>'+
                                            '</div>'+
                                            '<div class="intro_main">'+selectionVideo.desc+
                                            '</div>'+
                                        '</div>'+
                                    '</div>'+
                                    '<div class="select_platform">'+
                                        '<div class="select_platform_info">'+
                                        '</div>'+
                                        '<p class="cancel_button" onclick="closeChangePlatform()">取消</p>'+
                                    '</div>'+
                                    '<div id="play_shadom"></div>'
                                );
                            }
                            // console.log(selectionEpisodeSouku.length);
                            if(selectionEpisodeSouku.length > 0){
                                for (var i = 0; i < selectionEpisodeSouku.length; i++) {
                                    $(".video_info .episode_intro_show .episode_main .play_episode").eq(0).append('<p onclick="goToParse(this)"><span class="episode_url">'+selectionEpisodeSouku[i].url+'</span>'+ selectionEpisodeSouku[i].tag + '</p>');
                                };
                            }
                            for (var i = 0; i < arr.length; i++) {
                                if(arr[i].indexOf('youku') !== -1){
                                    $(".select_platform .select_platform_info").eq(0).append('<div class="select_platform_one" onclick="goToChangeForSouku(this)"><p class="select_channels">'+arr[i]+'</p><p><img src="'+BASEURL+'images/iconSourceYouku@2x.png" alt=""><span>优酷</span><span class="tipUpdata">(更新到'+selectionVideo.updated+')</span></p></div>');
                                }
                                if(arr[i].indexOf('tudou') !== -1){
                                    $(".select_platform .select_platform_info").eq(0).append('<div class="select_platform_one" onclick="goToChangeForSouku(this)"><p class="select_channels">'+arr[i]+'</p><p><img src="'+BASEURL+'images/iconSourceTudou@2x.png" alt=""><span>土豆</span><span class="tipUpdata">(更新到'+selectionVideo.updated+')</span></p></div>');
                                }
                                if(arr[i].indexOf('sohu') !== -1){
                                    $(".select_platform .select_platform_info").eq(0).append('<div class="select_platform_one" onclick="goToChangeForSouku(this)"><p class="select_channels">'+arr[i]+'</p><p><img src="'+BASEURL+'images/iconSourceSohu@2x.png" alt=""><span>搜狐</span><span class="tipUpdata">(更新到'+selectionVideo.updated+')</span></p></div>');
                                }
                                if(arr[i].indexOf('pptv') !== -1){
                                    $(".select_platform .select_platform_info").eq(0).append('<div class="select_platform_one" onclick="goToChangeForSouku(this)"><p class="select_channels">'+arr[i]+'</p><p><img src="'+BASEURL+'images/iconSourcePptv@2x.png" alt=""><span>PPTV</span><span class="tipUpdata">(更新到'+selectionVideo.updated+')</span></p></div>');
                                }
                                if(arr[i].indexOf('sina') !== -1){
                                    $(".select_platform .select_platform_info").eq(0).append('<div class="select_platform_one" onclick="goToChangeForSouku(this)"><p class="select_channels">'+arr[i]+'</p><p><img src="'+BASEURL+'images/iconSourceSina@2x.png" alt=""><span>新浪</span><span class="tipUpdata">(更新到'+selectionVideo.updated+')</span></p></div>');
                                }
                                if(arr[i].indexOf('qq') !== -1){
                                    $(".select_platform .select_platform_info").eq(0).append('<div class="select_platform_one" onclick="goToChangeForSouku(this)"><p class="select_channels">'+arr[i]+'</p><p><img src="'+BASEURL+'images/iconSourceTencent@2x.png" alt=""><span>腾讯</span><span class="tipUpdata">(更新到'+selectionVideo.updated+')</span></p></div>');
                                }
                                if(arr[i].indexOf('qiyi') !== -1){
                                    $(".select_platform .select_platform_info").eq(0).append('<div class="select_platform_one" onclick="goToChangeForSouku(this)"><p class="select_channels">'+arr[i]+'</p><p><img src="'+BASEURL+'images/iconSourceIqiyi@2x.png" alt=""><span>爱奇艺</span><span class="tipUpdata">(更新到'+selectionVideo.updated+')</span></p></div>');
                                }
                                if(arr[i].indexOf('hunantv') !== -1){
                                    $(".select_platform .select_platform_info").eq(0).append('<div class="select_platform_one" onclick="goToChangeForSouku(this)"><p class="select_channels">'+arr[i]+'</p><p><img src="'+BASEURL+'images/iconSourceMango@2x.png" alt=""><span>芒果TV</span><span class="tipUpdata">(更新到'+selectionVideo.updated+')</span></p></div>');
                                }
                                if(arr[i].indexOf('huashu') !== -1){
                                    $(".select_platform .select_platform_info").eq(0).append('<div class="select_platform_one" onclick="goToChangeForSouku(this)"><p class="select_channels">'+arr[i]+'</p><p><img src="'+BASEURL+'images/iconSourceWasu@2x.png" alt=""><span>华数tv</span><span class="tipUpdata">(更新到'+selectionVideo.updated+')</span></p></div>');
                                }
                                if(arr[i].indexOf('fengxing') !== -1){
                                    $(".select_platform .select_platform_info").eq(0).append('<div class="select_platform_one" onclick="goToChangeForSouku(this)"><p class="select_channels">'+arr[i]+'</p><p><img src="'+BASEURL+'images/iconSourceFun@2x.png" alt=""><span>风行网</span><span class="tipUpdata">(更新到'+selectionVideo.updated+')</span></p></div>');
                                }
                            }
                        }else if(selectionVideo.type == 6){
                            if(selectedSourceSouku == '优酷' || selectedSourceSouku == '土豆' || selectedSourceSouku == '搜狐'){
                                $("body").append(
                                    '<div class="video_info">'+
                                        '<figure>'+
                                            '<img src="'+selectionVideo.image+'"/ class="video_img">'+
                                            '<figcaption>'+selectionVideo.title+'</figcaption>'+
                                            '<p class="play_clip">播放源:</p>'+
                                            '<p class="play_clip_info" onclick="changePlatform()">'+
                                                '<img src="'+selectionLogoSouku+'" alt="" class="clip_logo">'+
                                                '<span class="clip_name">'+selectedSourceSouku+'</span>'+
                                            '</p>'+
                                            '<img src="'+BASEURL+'images/btnMoreSource@2x.png" alt="" class="pulldown_logo">'+
                                            '<p class="click_play" onclick="playLoadMovie(this)"></p>'+
                                            '<p class="hidden_url">'+selectionEpisodeSouku[0].url+'</p>'+
                                        '</figure>'+
                                    '</div>'+
                                    '<div class="movie_show_style">'+
                                        '<div class="movie_show_head">'+
                                            '<p>电影简介</p>'+
                                        '</div>'+
                                        '<div class="movie_show_desc">'+selectionVideo.desc+
                                        '</div>'+
                                    '</div>'+
                                    '<div class="select_platform">'+
                                        '<div class="select_platform_info">'+
                                        '</div>'+
                                        '<p class="cancel_button" onclick="closeChangePlatform()">取消</p>'+
                                    '</div>'+
                                    '<div id="play_shadom"></div>'
                                );
                            }else{
                                $("body").append(
                                    '<div class="video_info">'+
                                        '<figure>'+
                                            '<img src="'+selectionVideo.image+'"/ class="video_img">'+
                                            '<figcaption>'+selectionVideo.title+'</figcaption>'+
                                            '<p class="play_clip">播放源:</p>'+
                                            '<p class="play_clip_info" onclick="changePlatform()">'+
                                                '<img src="'+selectionLogoSouku+'" alt="" class="clip_logo">'+
                                                '<span class="clip_name">'+selectedSourceSouku+'</span>'+
                                            '</p>'+
                                            '<img src="'+BASEURL+'images/btnMoreSource@2x.png" alt="" class="pulldown_logo">'+
                                            '<p class="no_parse">(暂未能去广告)</p>'+
                                            '<p class="click_play" onclick="playLoadMovie(this)"></p>'+
                                            '<p class="hidden_url">'+selectionEpisodeSouku[0].url+'</p>'+
                                        '</figure>'+
                                    '</div>'+
                                    '<div class="movie_show_style">'+
                                        '<div class="movie_show_head">'+
                                            '<p>电影简介</p>'+
                                        '</div>'+
                                        '<div class="movie_show_desc">'+selectionVideo.desc+
                                        '</div>'+
                                    '</div>'+
                                    '<div class="select_platform">'+
                                        '<div class="select_platform_info">'+
                                        '</div>'+
                                        '<p class="cancel_button" onclick="closeChangePlatform()">取消</p>'+
                                    '</div>'+
                                    '<div id="play_shadom"></div>'
                                );
                            }
                            for (var i = 0; i < arr.length; i++) {
                                if(arr[i].indexOf('youku') !== -1){
                                    $(".select_platform .select_platform_info").eq(0).append('<div class="select_platform_one" onclick="goToPlayMovieForSouku(this)"><p class="select_channels">'+arrValue[i][0].url+'</p><p><img src="'+BASEURL+'images/iconSourceYouku@2x.png" alt=""><span>优酷</span>&nbsp;&nbsp;('+selectionVideo.title+')</p></div>');
                                }
                                if(arr[i].indexOf('tudou') !== -1){
                                    $(".select_platform .select_platform_info").eq(0).append('<div class="select_platform_one" onclick="goToPlayMovieForSouku(this)"><p class="select_channels">'+arrValue[i][0].url+'</p><p><img src="'+BASEURL+'images/iconSourceTudou@2x.png" alt=""><span>土豆</span>&nbsp;&nbsp;('+selectionVideo.title+')</p></div>');
                                }
                                if(arr[i].indexOf('sohu') !== -1){
                                    $(".select_platform .select_platform_info").eq(0).append('<div class="select_platform_one" onclick="goToPlayMovieForSouku(this)"><p class="select_channels">'+arrValue[i][0].url+'</p><p><img src="'+BASEURL+'images/iconSourceSohu@2x.png" alt=""><span>搜狐</span>&nbsp;&nbsp;('+selectionVideo.title+')</p></div>');
                                }
                                if(arr[i].indexOf('pptv') !== -1){
                                    $(".select_platform .select_platform_info").eq(0).append('<div class="select_platform_one" onclick="goToPlayMovieForSouku(this)"><p class="select_channels">'+arrValue[i][0].url+'</p><p><img src="'+BASEURL+'images/iconSourcePptv@2x.png" alt=""><span>PPTV</span>&nbsp;&nbsp;('+selectionVideo.title+')</p></div>');
                                }
                                if(arr[i].indexOf('sina') !== -1){
                                    $(".select_platform .select_platform_info").eq(0).append('<div class="select_platform_one" onclick="goToPlayMovieForSouku(this)"><p class="select_channels">'+arrValue[i][0].url+'</p><p><img src="'+BASEURL+'images/iconSourceSina@2x.png" alt=""><span>新浪</span>&nbsp;&nbsp;('+selectionVideo.title+')</p></div>');
                                }
                                if(arr[i].indexOf('qq') !== -1){
                                    $(".select_platform .select_platform_info").eq(0).append('<div class="select_platform_one" onclick="goToPlayMovieForSouku(this)"><p class="select_channels">'+arrValue[i][0].url+'</p><p><img src="'+BASEURL+'images/iconSourceTencent@2x.png" alt=""><span>腾讯</span>&nbsp;&nbsp;('+selectionVideo.title+')</p></div>');
                                }
                                if(arr[i].indexOf('qiyi') !== -1){
                                    $(".select_platform .select_platform_info").eq(0).append('<div class="select_platform_one" onclick="goToPlayMovieForSouku(this)"><p class="select_channels">'+arrValue[i][0].url+'</p><p><img src="'+BASEURL+'images/iconSourceIqiyi@2x.png" alt=""><span>爱奇艺</span>&nbsp;&nbsp;('+selectionVideo.title+')</p></div>');
                                }
                                if(arr[i].indexOf('huashu') !== -1){
                                    $(".select_platform .select_platform_info").eq(0).append('<div class="select_platform_one" onclick="goToPlayMovieForSouku(this)"><p class="select_channels">'+arrValue[i][0].url+'</p><p><img src="'+BASEURL+'images/iconSourceWasu@2x.png" alt=""><span>华数tv</span>&nbsp;&nbsp;('+selectionVideo.title+')</p></div>');
                                }
                                if(arr[i].indexOf('fengxing') !== -1){
                                    $(".select_platform .select_platform_info").eq(0).append('<div class="select_platform_one" onclick="goToPlayMovieForSouku(this)"><p class="select_channels">'+arrValue[i][0].url+'</p><p><img src="'+BASEURL+'images/iconSourceFun@2x.png" alt=""><span>风行网</span>&nbsp;&nbsp;('+selectionVideo.title+')</p></div>');
                                }
                            }
                        }else if(selectionVideo.type == 7 || selectionVideo.type == 3){
                            if(selectedSourceSouku == '优酷' || selectedSourceSouku == '土豆' || selectedSourceSouku == '搜狐'){
                                $("body").append(
                                    '<div class="video_info">'+
                                        '<figure>'+
                                            '<img src="'+selectionVideo.image+'"/ class="video_img">'+
                                            '<figcaption>'+selectionVideo.title+'</figcaption>'+
                                            '<p class="search_update">更新至:<a>'+selectionVideo.updated+'</a></p>'+
                                            '<p class="play_clip">播放源:</p>'+
                                            '<p class="play_clip_info" onclick="changePlatform()">'+
                                                '<img src="'+selectionLogoSouku+'" alt="" class="clip_logo">'+
                                                '<span class="clip_name">'+selectedSourceSouku+'</span>'+
                                            '</p>'+
                                            '<img src="'+BASEURL+'images/btnMoreSource@2x.png" alt="" class="pulldown_logo">'+
                                            '<p class="click_play" onclick="playFirstEpisode()"></p>'+
                                        '</figure>'+
                                        '<div class="episode_intro">'+
                                            '<div class="box_one box_left">'+
                                                '<p class="info_one info_left" onclick="selectionEpisode(this)">剧集</p>'+
                                            '</div>'+
                                            '<div class="box_one box_right">'+
                                                '<p class="info_one info_right" onclick="selectionIntro(this)">简介</p>'+
                                            '</div>'+
                                        '</div>'+
                                        '<div class="episode_intro_show">'+
                                            '<div class="episode_main" id="episode_main">'+
                                                '<div class="play_variety">'+
                                                '</div>'+
                                            '</div>'+
                                            '<div class="intro_main">'+selectionVideo.desc+
                                            '</div>'+
                                        '</div>'+
                                    '</div>'
                                );
                            }else{
                                $("body").append(
                                    '<div class="video_info">'+
                                        '<figure>'+
                                            '<img src="'+selectionVideo.image+'"/ class="video_img">'+
                                            '<figcaption>'+selectionVideo.title+'</figcaption>'+
                                            '<p class="search_update">更新至:<a>'+selectionVideo.updated+'</a></p>'+
                                            '<p class="play_clip">播放源:</p>'+
                                            '<p class="play_clip_info" onclick="changePlatform()">'+
                                                '<img src="'+selectionLogoSouku+'" alt="" class="clip_logo">'+
                                                '<span class="clip_name">'+selectedSourceSouku+'</span>'+
                                            '</p>'+
                                            '<img src="'+BASEURL+'images/btnMoreSource@2x.png" alt="" class="pulldown_logo">'+
                                            '<p class="no_parse">(暂未能去广告)</p>'+
                                            '<p class="click_play" onclick="playFirstEpisode()"></p>'+
                                        '</figure>'+
                                        '<div class="episode_intro">'+
                                            '<div class="box_one box_left">'+
                                                '<p class="info_one info_left" onclick="selectionEpisode(this)">剧集</p>'+
                                            '</div>'+
                                            '<div class="box_one box_right">'+
                                                '<p class="info_one info_right" onclick="selectionIntro(this)">简介</p>'+
                                            '</div>'+
                                        '</div>'+
                                        '<div class="episode_intro_show">'+
                                            '<div class="episode_main" id="episode_main">'+
                                                '<div class="play_variety">'+
                                                '</div>'+
                                            '</div>'+
                                            '<div class="intro_main">'+selectionVideo.desc+
                                            '</div>'+
                                        '</div>'+
                                    '</div>'
                                );
                            }
                            if(selectionEpisodeSouku.length > 0){
                                for (var i = 0; i < selectionEpisodeSouku.length; i++) {
                                    $(".video_info .episode_intro_show .episode_main .play_variety").eq(0).append('<p onclick="goToParse(this)"><span class="variety_url">'+selectionEpisodeSouku[i].url+'</span><span>'+ selectionEpisodeSouku[i].tag + '</span><span class="divisive_type"></span></p>');
                                };
                            }
                        }else{
                            if(selectionVideo.preload.length > 0){
                                for (var x = 0; x < available.length; x++) {
                                    for (var j = 0; j < selectionVideo.preload.length; j++) {
                                        if (selectionVideo.preload[j].url.indexOf(available[x]) !== -1) {
                                            selectedChannel = selectionVideo.preload[j];
                                            selectedSource = availableName[x];
                                            selectionLogo = availableLogo[x];
                                            break;
                                        }
                                    }
                                    if (selectedChannel) {
                                        break;
                                    }
                                }
                                if (!selectedChannel) {
                                    selectedChannel = selectionVideo.preload[0];
                                    selectedSource = '未知';
                                    selectionLogo = BASEURL + 'images/iconSourceUnknown@2x.png';
                                }
                            }
                            if(selectedSourceSouku == '优酷' || selectedSourceSouku == '土豆' || selectedSourceSouku == '搜狐'){
                                $("body").append(
                                    '<div class="video_info">'+
                                        '<figure>'+
                                            '<img src="'+selectionVideo.image+'"/ class="video_img">'+
                                            '<figcaption>'+selectionVideo.title+'</figcaption>'+
                                            '<p class="play_clip">播放源:</p>'+
                                            '<p class="play_clip_info" onclick="changePlatform()">'+
                                                '<img src="'+selectionLogo+'" alt="" class="clip_logo">'+
                                                '<span class="clip_name">'+selectedSource+'</span>'+
                                            '</p>'+
                                            '<img src="'+BASEURL+'images/btnMoreSource@2x.png" alt="" class="pulldown_logo">'+
                                            '<p class="click_play" onclick="playLoadMovie(this)"></p>'+
                                            '<p class="hidden_url">'+selectionVideo.preload[0].url+'</p>'+
                                        '</figure>'+
                                    '</div>'+
                                    '<div class="movie_show_style">'+
                                        '<div class="movie_show_head">'+
                                            '<p>电影简介</p>'+
                                        '</div>'+
                                        '<div class="movie_show_desc">'+selectionVideo.desc+
                                        '</div>'+
                                    '</div>'+
                                    '<div class="select_platform">'+
                                        '<div class="select_platform_info">'+
                                        '</div>'+
                                        '<p class="cancel_button" onclick="closeChangePlatform()">取消</p>'+
                                    '</div>'+
                                    '<div id="play_shadom"></div>'
                                );
                            }else{
                                $("body").append(
                                    '<div class="video_info">'+
                                        '<figure>'+
                                            '<img src="'+selectionVideo.image+'"/ class="video_img">'+
                                            '<figcaption>'+selectionVideo.title+'</figcaption>'+
                                            '<p class="play_clip">播放源:</p>'+
                                            '<p class="play_clip_info" onclick="changePlatform()">'+
                                                '<img src="'+selectionLogo+'" alt="" class="clip_logo">'+
                                                '<span class="clip_name">'+selectedSource+'</span>'+
                                            '</p>'+
                                            '<img src="'+BASEURL+'images/btnMoreSource@2x.png" alt="" class="pulldown_logo">'+
                                            '<p class="no_parse">(暂未能去广告)</p>'+
                                            '<p class="click_play" onclick="playLoadMovie(this)"></p>'+
                                            '<p class="hidden_url">'+selectionVideo.preload[0].url+'</p>'+
                                        '</figure>'+
                                    '</div>'+
                                    '<div class="movie_show_style">'+
                                        '<div class="movie_show_head">'+
                                            '<p>电影简介</p>'+
                                        '</div>'+
                                        '<div class="movie_show_desc">'+selectionVideo.desc+
                                        '</div>'+
                                    '</div>'+
                                    '<div class="select_platform">'+
                                        '<div class="select_platform_info">'+
                                        '</div>'+
                                        '<p class="cancel_button" onclick="closeChangePlatform()">取消</p>'+
                                    '</div>'+
                                    '<div id="play_shadom"></div>'
                                );
                            }

                            for (var i = 0; i < selectionVideo.preload.length; i++) {
                                if(selectionVideo.preload[i].url.indexOf('youku') !== -1){
                                    $(".select_platform .select_platform_info").eq(0).append('<div class="select_platform_one" onclick="goToPlayMovie(this)"><p class="select_channels">'+selectionVideo.preload[i].url+'</p><p><img src="'+BASEURL+'images/iconSourceYouku@2x.png" alt=""><span>优酷</span><span class="tipUpdata">(更新到'+selectionVideo.updated+')</span></p></div>');
                                }
                                if(selectionVideo.preload[i].url.indexOf('tudou') !== -1){
                                    $(".select_platform .select_platform_info").eq(0).append('<div class="select_platform_one" onclick="goToPlayMovie(this)"><p class="select_channels">'+selectionVideo.preload[i].url+'</p><p><img src="'+BASEURL+'images/iconSourceTudou@2x.png" alt=""><span>土豆</span><span class="tipUpdata">(更新到'+selectionVideo.updated+')</span></p></div>');
                                }
                                if(selectionVideo.preload[i].url.indexOf('sohu') !== -1){
                                    $(".select_platform .select_platform_info").eq(0).append('<div class="select_platform_one" onclick="goToPlayMovie(this)"><p class="select_channels">'+selectionVideo.preload[i].url+'</p><p><img src="'+BASEURL+'images/iconSourceSohu@2x.png" alt=""><span>搜狐</span><span class="tipUpdata">(更新到'+selectionVideo.updated+')</span></p></div>');
                                }
                                if(selectionVideo.preload[i].url.indexOf('pptv') !== -1){
                                    $(".select_platform .select_platform_info").eq(0).append('<div class="select_platform_one" onclick="goToPlayMovie(this)"><p class="select_channels">'+selectionVideo.preload[i].url+'</p><p><img src="'+BASEURL+'images/iconSourcePptv@2x.png" alt=""><span>PPTV</span><span class="tipUpdata">(更新到'+selectionVideo.updated+')</span></p></div>');
                                }
                                if(selectionVideo.preload[i].url.indexOf('sina') !== -1){
                                    $(".select_platform .select_platform_info").eq(0).append('<div class="select_platform_one" onclick="goToPlayMovie(this)"><p class="select_channels">'+selectionVideo.preload[i].url+'</p><p><img src="'+BASEURL+'images/iconSourceSina@2x.png" alt=""><span>新浪</span><span class="tipUpdata">(更新到'+selectionVideo.updated+')</span></p></div>');
                                }
                                if(selectionVideo.preload[i].url.indexOf('qq') !== -1){
                                    $(".select_platform .select_platform_info").eq(0).append('<div class="select_platform_one" onclick="goToPlayMovie(this)"><p class="select_channels">'+selectionVideo.preload[i].url+'</p><p><img src="'+BASEURL+'images/iconSourceTencent@2x.png" alt=""><span>腾讯</span><span class="tipUpdata">(更新到'+selectionVideo.updated+')</span></p></div>');
                                }
                                if(selectionVideo.preload[i].url.indexOf('qiyi') !== -1){
                                    $(".select_platform .select_platform_info").eq(0).append('<div class="select_platform_one" onclick="goToPlayMovie(this)"><p class="select_channels">'+selectionVideo.preload[i].url+'</p><p><img src="'+BASEURL+'images/iconSourceIqiyi@2x.png" alt=""><span>爱奇艺</span><span class="tipUpdata">(更新到'+selectionVideo.updated+')</span></p></div>');
                                }
                                if(selectionVideo.preload[i].url.indexOf('huashu') !== -1){
                                    $(".select_platform .select_platform_info").eq(0).append('<div class="select_platform_one" onclick="goToPlayMovie(this)"><p class="select_channels">'+selectionVideo.preload[i].url+'</p><p><img src="'+BASEURL+'images/iconSourceWasu@2x.png" alt=""><span>华数tv</span><span class="tipUpdata">(更新到'+selectionVideo.updated+')</span></p></div>');
                                }
                            }
                        }
                    }
                    if(selectionVideo.type == -1){
                        $("#iconNoData").css('display', 'block');
                        $("#noFindSomeThing").css('display', 'block');
                    }
                }
                wx.ready(function(){
                        /**
                         * [success description]分享到朋友圈
                         * @param  {[type]} )       {                                                            } [description]
                         * @param  {[type]} cancel: function      () {                                                            }                } [description]
                         * @return {[type]}         [description]
                         */
                        wx.onMenuShareTimeline({
                            title: $(".video_info figure figcaption").html()+'_高清在线', // 分享标题
                            link: window.location.href, // 分享链接
                            imgUrl: $(".video_info figure .video_img").attr('src'), // 分享图标
                            success: function () {
                                // 用户确认分享后执行的回调函数
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
                            title: $(".video_info figure figcaption").html()+'_高清在线', // 分享标题
                            desc: '据说10万名程序猿都在上的追剧神网', // 分享描述
                            link: window.location.href, // 分享链接
                            imgUrl: $(".video_info figure .video_img").attr('src'), // 分享图标
                            success: function () {
                                // 用户确认分享后执行的回调函数
                            },
                            cancel: function () {
                                // 用户取消分享后执行的回调函数
                            }
                        });
                    });
            })
            .fail(function() {
                console.log("error");
            })
        }

    });
};


mobile.initGoToPlay = function(){
    "use strict";
    $(document).ready(function() {
        var id = $("#video_id").val();
        $.ajax({
            url: BASEURL + 'm/getData',
            type: 'POST',
            dataType: 'json',
            data: {
                id: id,
            },
        })
        .done(function(data) {
            // console.log(data);
            if(data.status == 0){
                var video_url = data.result[0]['url'];
                SPlayer.initializePlayer(video_url, 'null');
                document.title = data.result[0]['title'];
                wx.ready(function(){
                    /**
                     * [success description]分享到朋友圈
                     * @param  {[type]} )       {                                                            } [description]
                     * @param  {[type]} cancel: function      () {                                                            }                } [description]
                     * @return {[type]}         [description]
                     */
                    wx.onMenuShareTimeline({
                        title: data.result[0]['title']+'_高清在线', // 分享标题
                        link: window.location.href, // 分享链接
                        imgUrl: data.result[0]['image'], // 分享图标
                        success: function () {
                            // 用户确认分享后执行的回调函数
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
                        title: data.result[0]['title']+'_高清在线', // 分享标题
                        desc: '据说10万名程序猿都在上的追剧神网', // 分享描述
                        link: window.location.href, // 分享链接
                        imgUrl: data.result[0]['image'], // 分享图标
                        success: function () {
                            // 用户确认分享后执行的回调函数
                        },
                        cancel: function () {
                            // 用户取消分享后执行的回调函数
                        }
                    });
                });

            }else{
                alert('视频获取错误,请刷新一次');
            }
        })
        .fail(function() {
            alert('视频获取错误,请刷新一次');
        })
    });
}



