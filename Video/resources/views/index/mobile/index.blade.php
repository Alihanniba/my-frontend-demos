@extends('index.mobile.master')

@section('title', 'https://www.alihanniba.com/')

@section('content')
<!--     <p>首页</p>
 -->
    <input type="hidden" id="pagepart">
    <input type="hidden" id="page">
    <input type="hidden" id="last_postid">
    <div class="m-index-background" >
    	<div class="m-index-logo"></div>
    	<p id="index-subscribe">最新精彩电影美剧全网搜索</p>
    	<div class="m-index-searchbar">
			<input type="text" name="title" id="index-input-url" autocomplete="Off" placeholder="请输入关键词">
			<input type="button" id="index-search-submit">
    	</div>
    </div>
    <div class="index_movie_select">
        <div class="index_movie_nav">
            <p id="brotherss_isters" class="selected_nav">电影美剧</p>
            <p id="recommended_station">站长推荐</p>
            <p id="Feature">精选视频</p>
            <p id="look_around">随便看看</p>
        </div>
    </div>
    <div class="index_selected_box">
        <div class="index_selected_show">
            <!-- <figure>
                <img src=""/ class="images">
                <figcaption>黄浦江上的卢浦大桥</figcaption>
                <p class="search_update">更新至:<a>32集</a></p>
                <p class="search_desc">美国喜剧中心制作的一部剪纸百拍动画剧集国喜剧中心制作的一部剧集国喜剧中心制作的一部剪纸百拍动画剧集，由和创作。1997年首播，至今已播到第14季。 主角为那个这个这个那个谁谁…</p>
            </figure> -->
        </div>
        <div class="short_film_selected_show">

        </div>
        <div id="uploadMore_box">
            <div id="uploadMore"></div>
        </div>
        <p id="noSomeThing">已经没有啥了</p>
        <div id="load_spacing_interval"></div>
    </div>

@stop

@section('script')
    var BASEURL = "{{Config::get('app.url')}}";
    $(document).ready(function() {
        mobile.init();
        mobile.initIndex();
    });
@stop

