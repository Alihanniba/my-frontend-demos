@extends('movie.layout')

@section('title', $movie_title)

@section('content')
	<input type="hidden" id="movieId" value='{{$movieId}}'>
	<input type="hidden" id="slide_index" value='{{$slide_index}}'>
	<input type="hidden" id="current_city_id" value='{{$current_city_id}}'>
	<input type="hidden" id="current_city_name" value='{{$current_city_name}}'>
	<header class='header_movie'>
		<img src="{{Config::get('app.url')}}images/iconReturn@2x.png" alt="返回" class="goback_movie">
		<span id="account_Movie_Name"></span>
		<!-- <img src="{{Config::get('app.url')}}images/iconSearch@2x.png" alt="搜索" class="search_movie"> -->
	</header>
	<div id="account_movie_box">

	</div>
	<!-- <div id="account_movie_cover">
		<img src="{{Config::get('app.url')}}images/影片图@2x.png" alt="背景" class="movie_background">
		<figure>
			<img src="{{Config::get('app.url')}}images/影片图@2x.png" alt="封面" class="film_cover">
			<div class="movie_info">
				<figcaption>火星救援</figcaption><span>3D IMAX</span>
				<p class="movie_english_name">The Martian</p>
				<p class="icon_star"></p>=
				<p class="movie_director">导演:<span>雷德利·斯科特</span>	</p>
				<p class="movie_scriptwriter">编剧:<span>德鲁·高达 /安迪·威尔</span></p>
				<p class="movie_starring">主演:<span>马特·达蒙/杰西卡·查斯坦克/里斯汀·韦格</span></p>
				<p class="movie_type">类型:<span>动作/冒险/科幻</span></p>
				<p class="movie_film_length">片长:<span>144分钟</span></p>
				<p class="movie_released">上映日期:<span>2015-11-25</span></p>
			</div>

		</figure>
		<div class="movie_film_icon">
			<img src="{{Config::get('app.url')}}images/iconLike@2x.png" alt="喜欢" class="movie_film_like">
			<img src="{{Config::get('app.url')}}images/iconShare@2x.png" alt="分享" class="movie_film_share">
		</div>
	</div>
	<div class="account_movie_story_box">
		<div class="account_movie_story">
			<p class="movie_story_intro">剧情简介</p>
			<p class="movie_story_details">    在一次人类登陆火星的任务中，宇航员马克·沃特尼（马特·达蒙 Matt Damon 饰）经历了一场恶劣的风暴后，与他的机组成员失联，所有人都认为他在这次任务中丧生。然而，马克却幸运地活了下来，然而他发现自己孤单地置身于异星球。面对贫乏的生命补给，马克必须用他的聪明才智和顽强的精神存活下来，并找寻向地球发出“他还活着”求救信号的方法，而地球上的人也面临着是否前往火星去拯救他的分歧。
	影片改编自安迪·威尔的同名科幻小说。</p>
		</div>
		<img src="{{Config::get('app.url')}}images/参考框@2x.png" alt="更多" class="movie_story_details_more">
	</div> -->
	<!-- <div class="account_movie_stills_box">
		<p class="account_movie_stills">剧照</p>
		<img src="{{Config::get('app.url')}}images/影片图@2x.png" alt="剧照图">
	</div> -->
	<img src="{{Config::get('app.url')}}images/loading@2x.png" alt="加载" id="uploadMore">
	<button class="account_movie_buy_tickets">购票</button>
@stop

@section('js')
<script src="{{Config::get('app.url')}}js/stackblur.js"></script>
@stop

@section('script')
    var BASEURL = "{{Config::get('app.url')}}";
    $(document).ready(function() {
        movie.init();
        movie.initAccount();
    });
@stop
