@extends('movie.layout')

@section('title', $current_film_name)

@section('css')
    <link rel="stylesheet" type="text/css" href="{{Config::get('app.url')}}css/swiper.min.css">
@stop

@section('content')
    <input type="hidden" value="{{$current_To_film}}" id="current_To_film">
	<input type="hidden" value="{{$current_film_name}}" id="current_film_name">
	<input type="hidden" id="current_city_id" value='{{$current_city_id}}'>
	<input type="hidden" id="current_city_name" value='{{$current_city_name}}'>
	<input type="hidden" id="localLatitude" value='{{$localLatitude}}'>
	<input type="hidden" id="localLongitude" value='{{$localLongitude}}'>
    <header class='header_movie'>
		<img src="{{Config::get('app.url')}}images/iconReturn@2x.png" alt="返回" class="goback_movie">
		<span>{{$current_film_name}}</span>
		<!-- <img src="{{Config::get('app.url')}}images/iconSearch@2x.png" alt="搜索" class="search_movie"> -->
	</header>
	<!-- <ul class="price_movie_date">
		<li class="movie_date_today movie_date_time">今天(<span>12月16日</span>)</li>
		<li>明天(<span>12月17日</span>)</li>
		<li>后天(<span>12月18日</span>)</li>
	</ul> -->
	<div id="tabBox1" class="tabBox">
		<div class="bd" id="tabBox1-bd"><!-- 添加id，js用到 -->
		<!-- 高度自适应需添加外层 -->
		</div>
	</div>
	<img src="{{Config::get('app.url')}}images/loading@2x.png" alt="加载" id="uploadMore">
	<button class="account_movie_buy_tickets">购票</button>
    <p id="noFilmInfo">暂时没有电影院影片信息</p>
@stop

@section('js')
<script src="{{Config::get('app.url')}}js/TouchSlide.1.1.js"></script>
@stop

@section('script')
    var BASEURL = "{{Config::get('app.url')}}";
    $(document).ready(function() {
        movie.init();
        movie.initPrice();
    });
@stop
