<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <meta name="keywords" content="https://www.alihanniba.com/">
    <meta name="description" content="https://www.alihanniba.com/">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <title>@yield('title')</title>
    <link rel="stylesheet" href="{{Config::get('app.url')}}css/normalize.css">
    <link rel="stylesheet" href="{{Config::get('app.url')}}css/mobile.css">
    <link href="{{Config::get('app.url')}}dist/skin/blue.monday/css/jplayer.blue.monday.min.css" rel="stylesheet">
    <script>
        var _hmt = _hmt || [];
        (function() {
          var hm = document.createElement("script");
          hm.src = "//hm.baidu.com/hm.js?3ab42f9e08433180a3ad411f736159a7";
          var s = document.getElementsByTagName("script")[0];
          s.parentNode.insertBefore(hm, s);
        })();
    </script>
</head>
<body>
    @yield('content')
    <script src="{{Config::get('app.url')}}js/jquery-2.1.4.min.js"></script>
    <script src="{{Config::get('app.url')}}js/mobile.js"></script>
    <script type="text/javascript" src="{{Config::get('app.url')}}js/control.js"></script>
    <script type="text/javascript" src="{{Config::get('app.url')}}dist/jplayer/jquery.jplayer.min.js"></script>
    <script type="text/javascript" src="{{Config::get('app.url')}}dist/add-on/jplayer.playlist.min.js"></script>
    <script type="text/javascript" src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>
    <script src="http://sandbox-api.soundtooth.cn/game/jssdk_demo.php"></script>
    <script>
    @yield('script')
    </script>
</body>
</html>
