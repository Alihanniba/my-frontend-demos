@extends('index.mobile.master')

@section('title', $title)

@section('content')
	<div id="transpond_cover_box">
		<img src="" alt="" id="transpond_cover" > 
	</div>
	<input type="hidden" id="hidden_t" value='{{$k}}'>
	<input type="hidden" id="hidden_index" value='{{$index}}'>
	<input type="hidden" id="hidden_id" value='{{$id}}'>
	<input type="hidden" id="hidden_selectedChannel">
	<input type="hidden" id="selectionVideoPreload">
	<div class="search_header">
		<img src="{{Config::get('app.url')}}/images/logoVoiceinBlack@2x.png" alt="logo">
		<div class="search_header_search">
			<input type="text" class="search_input" id="search_input" placeholder="输入关键词">
			<span class="demoSpan1"></span>
		</div>
	</div>
	<img src="{{Config::get('app.url')}}/images/iconNoData@2x.png" alt="" id="iconNoData">
	<p id="noFindSomeThing">没有找到相应的目标</p>	
@stop
@section('script')
	var BASEURL = "{{Config::get('app.url')}}";
    $(document).ready(function() {
        mobile.init();
        mobile.initPlay();
    });
@stop