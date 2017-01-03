@extends('index.mobile.master')

@section('title', $_GET['title'])

@section('content')
	<input type="hidden" value="<?php echo $_GET['title']; ?>" id="hidden_title">
    <div class="search_header">
		<img src="{{Config::get('app.url')}}/images/logoVoiceinBlack@2x.png" alt="logo">
		<div class="search_header_search">
			<input type="text" class="search_input" id="search_input" placeholder="输入关键词">
			<span class="demoSpan1">
		</div>
	</div>	
	<div class="search_content">
		<div id="search_main">
			<!-- <figure>
				<img src=""/ class="images">
				<figcaption>黄浦江上的卢浦大桥</figcaption>
				<p class="search_update">更新至:<a href="">32集</a></p>
				<p class="search_desc">美国喜剧中心制作的一部剪纸百拍动画剧集国喜剧中心制作的一部剧集国喜剧中心制作的一部剪纸百拍动画剧集，由和创作。1997年首播，至今已播到第14季。 主角为那个这个这个那个谁谁…</p>
			</figure> -->
		</div>
	</div>
	<img src="{{Config::get('app.url')}}/images/iconNoData@2x.png" alt="" id="iconNoData">
	<p id="noFindSomeThing">没有找到相应的目标</p>
@stop

@section('script')
	var BASEURL = "{{Config::get('app.url')}}";
    $(document).ready(function() {
        mobile.init();
        mobile.initSearchList();
    });
@stop