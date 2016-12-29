<!DOCTYPE html>
<html  lang="zh">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <meta name="keywords" content="">
    <meta name="description" content="">
    <meta name="format-detection" content="telephone=no" />
    <meta content="email=no" name="format-detection" />
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <meta name="csrf-token" content="{{ csrf_token() }}" />
    <title>@yield('title')</title>
    <link rel="shortcut icon" href="{{Config::get('app.mobileUrl')}}images/soundTooth.ico">
    <link rel="stylesheet" href="{{Config::get('app.mobileUrl')}}css/mobile.css">
    <script>
        var _hmt = _hmt || [];
        (function() {
          var hm = document.createElement("script");
          hm.src = "//hm.baidu.com/hm.js?4b01d2b2a7a52c41065c6feb59092d19";
          var s = document.getElementsByTagName("script")[0];
          s.parentNode.insertBefore(hm, s);
        })();
    </script>
    @yield('css')
</head>
<body>
    <header>
        <img src="{{Config::get('app.mobileUrl')}}images/developer@2x.png" alt="logo" id="web-logo">
        <!-- <span></span> -->
        <!-- <div id="add-app-header"></div> -->
        <div id="message-list-header">
            <img src="{{Config::get('app.mobileUrl')}}images/interface@2x.png" alt="">
        </div>
    </header>
    <nav class="guide-nav">
        <div class="username">
            <p><span>用户</span><br>{{ Session::get('user_phone') }}</p>
        </div>
        <ul>
            <li class="backstage-index">后台首页</li>
            <li class="message-list">广告列表</li>
            <!-- <li class="finance-center">&nbsp;&nbsp;财务中心</li> -->
            <li class="personal-center">个人中心</li>
            <!-- <li class="notice-center">&nbsp;&nbsp;消息中心</li>
            <li class="help-center">&nbsp;&nbsp;帮助中心</li> -->
        </ul>
        <p class="layout">退出</p>
    </nav>
    <div class="notice-center-module">
        <p>消息中心</p>
        <div class="notice-center-content">
            <div class="success-notice-message">
                <p class="notice-message-time">03-04 16:34</p>
                <p class="notice-message-detail">您成功提现了300.00元</p>
            </div>
            <div class="success-notice-message">
                <p class="notice-message-time">03-04 16:34</p>
                <p class="notice-message-detail">您成功提现了300.00元</p>
            </div>
            <div class="failure-notice-message">
                <p class="notice-message-time">03-04 16:34</p>
                <p class="notice-message-detail">添加"百度地图"失败,请您重新添加.</p>
                <p class="notice-message-why">原因: 开发证书不正确.</p>
            </div>
            <div class="failure-notice-message">
                <p class="notice-message-time">03-04 16:34</p>
                <p class="notice-message-detail">添加"百度地图"失败,请您重新添加.</p>
                <p class="notice-message-why">原因: 开发证书不正确.</p>
            </div>
        </div>
        <div class="enter-empty-message">
            <div class="cancel-message">取消</div>
            <div class="empty-message">清空</div>
        </div>
    </div>
    @yield('content')

    <!-- <footer>
        <p class="footer-declaration footer-declaration-one">Copyright ® 2015-2015 Soundtooth</p>
        <p class="footer-declaration footer-declaration-two">All Rights Reserved. 粤ICP备14034246号-1</p>
    </footer> -->
    <div class="body-shadow"></div>
    <div class="loading-area"></div>
    <script src="{{Config::get('app.mobileUrl')}}js/jquery-2.1.4.min.js"></script>
    <script src="{{Config::get('app.mobileUrl')}}js/mobile.js"></script>
    @yield('js')
</body>
</html>
