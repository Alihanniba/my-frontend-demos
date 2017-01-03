@extends('index.mobile.master')

@section('title', '')

@section('content')
	<input type="hidden" id="video_id" value="{{$id}}">
	<div id="video_box">
    	@include('player.player', $set = array('info' => false, 'qrcode' => false, 'interact' => false))
	</div>
@stop
@section('script')
	var BASEURL = "{{Config::get('app.url')}}";
    $(document).ready(function() {
        mobile.init();
        mobile.initGoToPlay();
    });
@stop