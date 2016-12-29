@extends('movie.layout')

@section('title', '电影票比价')

@section('css')
    <link rel="stylesheet" href="{{Config::get('app.url')}}css/idangerous.swiper.css">
@stop

@section('content')
	<input type="hidden" id="turnback_movieId" value='{{ isset($movieId) ? $movieId : '' }}'>
	<input type="hidden" id="slide_index" value='{{ isset($slide_index) ? $slide_index : '' }}'>
	<div class="bg-box">
		<header class="m-header">
			<div class="index-wrap">
				<div class="city">
					<p class="specific-place">深圳</p>
					<!-- <img src="{{Config::get('app.url')}}images/iconMore@2x.png"> -->
				</div>
				<div class="search-cinema">
					<!-- <img src="{{Config::get('app.url')}}images/iconSearch@2x.png" alt="搜索"> -->
				</div>
			</div>
		</header>
		<!-- 电影海报滚动 -->
		<div class="poster-list">
			<div class="avatar-holder">
				<div class="avatar-container">
				    <div class="avatar">
					    <div class="index_device">
					    	<div class="swiper-container">
					        	<div class="swiper-wrapper"></div>
					    	</div>
					    </div>
					    <div class="shadow-masage">
					    	<div class="movie-title"></div>
					    	<div class="star"></div>
					    </div>
				    </div>
				</div>
			</div>
			<!-- <div class="blur">
				<img class="list-bg" src="" style="height:321px;width:100%;margin:0;padding:0;">
			</div> -->

			<!-- <div class="index_device">
				<div class="swiper-container">
			    	<div class="swiper-wrapper"></div>
				</div>
			</div> -->
			<!-- <div class="shadow-masage">
				<div class="movie-title"></div>
				<div class="star"></div>
			</div> -->
		</div>
		<div class="mid-line"></div>
		<div class="cinema-content">
			<p class="index_cinema_house">影院</p>
			<ul class="cinema-list" id="cinema-list"></ul>
		</div>
		<button class="Comparative-price" style="display:none">比价购票</button>
		<div class="index_loading" display:none></div>
	</div>
	<img src="{{Config::get('app.url')}}images/loading@2x.png" alt="加载" id="uploadMore">

@stop

@section('js')
    <script src="{{Config::get('app.url')}}js/idangerous.swiper.min.js"></script>
    <script src="{{Config::get('app.url')}}js/background-blur.js"></script>
@stop
@section('script')
    var BASEURL = "{{Config::get('app.url')}}";
    $(document).ready(function() {
        movie.init();
        movie.initIndex();
    });
@stop
