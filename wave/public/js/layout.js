var index = {};
index.init = function(){
    $("img.lazy").lazyload({
        effect: "fadeIn", // 载入使用何种效果
        threshold: 200 // 提前开始加载
    });
    $("li.lazy").lazyload({
        effect: "fadeIn"
    });
    $('.gonext_arrow').click(function () {
        $('body,html').animate({
            scrollTop: $('.header').height()
        }, 600);
    });
}
// 关于我们
var about = {};
about.init = function(){

}

// 公共
//判断操作系统
// 获取终端的相关信息
var Terminal = {
    // 辨别移动终端类型
    platform : function(){
        var u = navigator.userAgent, app = navigator.appVersion;
        return {
            // 是否为windows
            windows: u.indexOf('Windows NT') > -1 ,
            // 是否为mac
            mac: u.indexOf('Mac')
        };
    }(),
    // 辨别移动终端的语言：zh-cn、en-us、ko-kr、ja-jp...
    language : (navigator.browserLanguage || navigator.language).toLowerCase()
}
if(Terminal.platform.windows){
    $('html').addClass('windows').removeClass('mac');
}else if(Terminal.platform.mac){
    $('html').addClass('mac').removeClass('windows');
}else{
    $('html').removeClass('windows').removeClass('mac');
}
$(window).scroll(function () {
    if ($(this).scrollTop() > 500) {
        $('#back-top').fadeIn();
    } else {
        $('#back-top').fadeOut();
    }
});
// scroll body to 0px on click
$('#back-top a').click(function () {
    $('body,html').animate({
        scrollTop: 0
    }, 600);
    return false;
});