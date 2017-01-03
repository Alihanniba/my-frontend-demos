<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <meta name="keywords" content="电影比价">
    <meta name="description" content="电影比价">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <title>@yield('title')</title>
    <link rel="stylesheet" href="{{Config::get('app.url')}}css/index.css">
    @yield('css')
</head>
<body>
    @yield('content')
    <script src="{{Config::get('app.url')}}js/jquery-2.1.4.min.js"></script>
    <script src="{{Config::get('app.url')}}js/movie.js"></script>
    <script src="{{Config::get('app.url')}}js/background-blur.js"></script>
    @yield('js')
    <script>
    @yield('script')
    </script>
</body>
</html>
