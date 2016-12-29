<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="utf-8">
    <title>广告 - 声牙科技</title>
    <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">
    <link rel="stylesheet" href="{{Config::get('app.url')}}css/swiper.min.css">
    <style>
    body {background: transparent;font-family: Helvetica Neue, Helvetica, Arial, sans-serif;font-size: 14px;color:#000;margin: 0;padding: 0;}
    .main_container{
        width: 1rem;
        height: 0.1236263736263736rem;
        margin: 0 auto;
        position: relative;
        overflow: hidden;
    }
    .swiper-container {width: 100%;max-height: 100%;}
    .swiper-container a{-webkit-tap-highlight-color:rgba(0,0,0,0);}
    .swiper-container a:focus{-webkit-tap-highlight-color:rgba(0,0,0,0);}
    .swiper-container img{ display:block; width: 100%; height: 0.1236263736263736rem;}
    .swiper-container .size1{height: 0.1236263736263736rem;}
    .swiper-container .size2{height: 0.1282051282051282rem;}
    .swiper-container .size3{height: 0.15rem;}
    .swiper-container .size4{height: 0.421875rem;}
    .swiper-container .size5{height: 0.5rem;}
    .swiper-container .size6{height: 0.6666666666666667rem;}
    .swiper-container .size7{height: 0.8333333333333333rem;}
    .swiper-slide {
        
    }
    </style>
</head>
<body>
    <div class="main_container">
        <!-- Swiper -->
        <div class="swiper-container">
            <div class="swiper-wrapper">
            </div>
            <div class="swiper-pagination"></div>
        </div>
    </div>
    <script src="{{Config::get('app.url')}}js/jquery-2.1.4.min.js"></script>
    <script src="{{Config::get('app.url')}}js/swiper.min.js"></script>
    <script>
    var BASEURL = "{{Config::get('app.url')}}";
    $(function() {
        resizeHtml();
        window.onresize = function(){
            resizeHtml();
        };
        function resizeHtml(){
            document.getElementsByTagName('html')[0].style.fontSize = window.innerWidth + 'px';
        }
        //获取比例
        var size = GetQueryString('s');
        var className = "size1";
        if(size == 1){
            $(".main_container").css({'height': '0.1236263736263736rem'});
            className = "size1";
        }else if(size == 2){
            $(".main_container").css({'height': '0.1282051282051282rem'});
            className = "size2";
        }else if(size == 3){
            $(".main_container").css({'height': '0.15rem'});
            className = "size3";
        }else if(size == 4){
            $(".main_container").css({'height': '0.421875rem'});
            className = "size4";
        }else if(size == 5){
            $(".main_container").css({'height': '0.5rem'});
            className = "size5";
        }else if(size == 6){
            $(".main_container").css({'height': '0.6666666666666667rem'});
            className = "size6";
        }else if(size == 7){
            $(".main_container").css({'height': '0.8333333333333333rem'});
            className = "size7";
        }

        var htmlstring = "";
        $.ajax({
            url: BASEURL + 'api/getMacMessageInfo',
            type: 'post',
            dataType: 'json',
            data: {
                macAddr: GetQueryString('m'),
                time: GetQueryString('ts'),
                token: GetQueryString('t'),
                size: GetQueryString('s')
            }
        })
        .done(function(data) {
            console.log(data);
            if(data.success){
                var mid_list = "mid:";
                for(var i in data.data){
                    var dataurl = BASEURL + "imgStatistic?m=" + data.data[i].m + "&u=" + data.data[i].u + "&a=" + data.data[i].a + "&au="+data.data[i].au + "&t=" + data.data[i].t + "&url=" + data.data[i].message_link;
                    htmlstring += "<div class=\"swiper-slide\"><a href=\"javascript:;\" onclick=\"AndroidClick(this)\" data-url=\""+dataurl+"\" data-u=\""+data.data[i].u+"\" data-m=\""+data.data[i].m+"\" data-a=\""+data.data[i].a+"\" data-au=\""+data.data[i].au+"\"><img src=\""+data.data[i].channel_image+"\" class='"+className+"' alt=\"\"></a></div>";
                    mid_list += data.data[i].m + '/';
                }
                mid_list = mid_list.substring(0,mid_list.length-1);
                console.log(mid_list);
                $(".swiper-wrapper").html(htmlstring);
                var swiper = new Swiper('.swiper-container', {
                    pagination: 'null',
                    paginationClickable: true,
                    touchMoveStopPropagation : false,
                    autoplay : 5000,
                    loop: true,
                    simulateTouch: false,
                    onlyExternal: true
                });
                if(Terminal.platform.android){
                    window.ADBannerJavaInterface.onInsertAdResult(true, '广告请求成功');
                } else if(Terminal.platform.iPhone){
                    window.location.href = "objc://onInsertAdResult::/" + 'status=true,errCode=' + data.errCode;
                }
            }else if(!data.success){//没有广告
                // $(".baidu-ad").css('display', 'block');
                if(Terminal.platform.android){
                    window.ADBannerJavaInterface.onInsertAdResult(false, '没有广告');
                } else if(Terminal.platform.iPhone){
                    window.location.href = "objc://onInsertAdResult::/" + 'status=false,errCode=' + data.errCode;
                }
            }
        })
        .fail(function(data) {
            console.log(data);
            // $(".baidu-ad").css('display', 'block');
            if(Terminal.platform.android){
                window.ADBannerJavaInterface.onInsertAdResult(false, '接口请求失败');
            } else if(Terminal.platform.iPhone){
                window.location.href = "objc://onInsertAdResult::/status=false,errCode=InterfaceRequestFailed";
            }
        });
        setTimeout(function () {
            console.log($(".baidu-ad").children('div').height());
            $(".baidu-ad").css('height', $(".baidu-ad").children('div').height());
        },1000);
    });
    function GetQueryString(name)
    {
         var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
         var r = window.location.search.substr(1).match(reg);
         if(r!=null)return  unescape(r[2]); return null;
    }
    // 获取终端的相关信息
    var Terminal = {
        // 辨别移动终端类型
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
    //点击调用安卓方法
    function AndroidClick(dom){
        if(Terminal.platform.android){
            window.ADBannerJavaInterface.onAdBannerClick($(dom).attr("data-url"));
        } else if(Terminal.platform.iPhone){
            window.location.href = "objc://onAdBannerClick::/" + $(dom).attr("data-url");
        }
        // $.ajax({
        //     url: BASEURL + 'api/totalClickNum',
        //     type: 'post',
        //     dataType: 'json',
        //     data: {
        //         uid: $(dom).attr("data-u"),
        //         mid: $(dom).attr("data-m"),
        //         appID: $(dom).attr("data-a")
        //     }
        // })
        // .done(function(data) {
        //     console.log(data);
        // })
        // .fail(function(data) {
        //     console.log(data);
        // });
    }
    </script>
</body>
</html>