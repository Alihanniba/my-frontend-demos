@extends('front.layout')
@section('title', '声牙-SDK-404')
@section('css')
@stop
	@section('content')
		<div class="notFound">
			<img src="{{Config::get('app.url')}}/images/404.jpg">
			<p>抱歉，你要查看的数据不存在或已被删除。</p>
		</div>
	@stop
	@section('js')
	<script src="{{Config::get('app.url')}}js/index.js"></script>
	<script type="text/javascript">
	var BASEURL = "{{Config::get('app.url')}}";
	$(document).ready(function() {
	    login.init();
	    $('body').css({
	    	backgroundColor: '#fff',
	    	overflow: 'hidden'
	    });
	});
	</script>
	@stop
