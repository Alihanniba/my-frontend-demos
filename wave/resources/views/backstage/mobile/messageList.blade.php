@extends('backstage.mobile.header')
@section('title', '广告列表')
@section('content')
    <div class="messages-list-module">
        <p class="messages-list-header">广告列表</p>
        <div class="messages-choose-button">
            <button class="messages-choose-time select-button" identify="time">时间</button>
            <button class="messages-choose-status" identify="type">状态</button>
        </div>
        <div class="messages-search-input">
            <input type="text" placeholder="输入关键字">
            <span></span>
        </div>
        <div id="messages-contains">
            <ul>
            </ul>
        </div>
        <button class="get-more">查看更多</button>
    </div>
@stop
@section('js')
    <script type="text/javascript">
        var BASEURL = "{{Config::get('app.mobileUrl')}}";
        $(document).ready(function() {
            mobile.init();
            mobile.initMessageList();
        })
    </script>
@stop









