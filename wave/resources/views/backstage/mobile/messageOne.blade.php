@extends('backstage.mobile.header')
@section('title', '广告详情')
@section('css')
    <link rel="stylesheet" href="{{Config::get('app.mobileUrl')}}css/mobiscroll.custom-2.17.1.min.css">
@stop
@section('content')
    <div class="message-one-module">
        <div class="message-basic-info">
            <p class="message-details">详情</p>
            @foreach($messages as $message)
            <p class="message-name">广告名称:&nbsp;&nbsp;&nbsp;<span>{{$message->shop_name}}</span> <span>已上线</span> </p>
            <p class="message-create-time">创建时间:&nbsp;&nbsp;&nbsp;<span>{{date('Y.m.d',$message->ctime)}}</span></p>
            <p class="message-push-content">推送内容:&nbsp;&nbsp;&nbsp;<span id="push-content">{{$message->content}}</span> <span id="go-into-push-content">进入链接</span></p>
            <p class="message-push-price">推送单价:&nbsp;&nbsp;&nbsp;<span>¥{{$message->push_price}}</span> </p>
            @endforeach
        </div>

        <div class="message-basic-KPI">
            <p>基本指标 (昨日)</p>
            <div class="message-statistics-data">
                <div class="message-push-num">
                    <p class="KPI-key">推送次数</p>
                    <p class="push-num KPI-value"> <span></span>次</p>
                </div>
                <div class="message-browse-num">
                    <p class="KPI-key">浏览次数</p>
                    <p class="browse-num KPI-value"><span></span>次</p>
                </div>
                <div class="message-browse-time">
                    <p class="KPI-key">平均浏览时长</p>
                    <p class="browse-time KPI-value"></p>
                </div>
                <div class="message-conversion-rate">
                    <p class="KPI-key">平均转化率</p>
                    <p class="conversion-rate KPI-value"><span></span>%</p>
                </div>
            </div>
        </div>
        <div class="user-draw-report">
            <p class="show-title-guide">用户画像报表</p>
            <div id="date_select">
                <p class="diff_date" id="profile_yesterday">昨日</p>
                <p id="profile_week">7日</p>
                <p id="profile_month">30日</p>
            </div>
        </div>

        <div id="search_by_date">
            <div class="search_con">
                <div id="date_set">
                    <div id="start_time" class="chioce_time">
                        <input id="start_time_input" placeholder="选择日期">
                    </div>
                    <div id="stop_time" class="chioce_time">
                        <input type="text" id="stop_time_input" placeholder="">
                    </div>
                </div>
                <span id="search_data"></span>
            </div>
        </div>

        <div id="data_by_user">
            <div class="column">
                <!-- <div id="providerChart" class="pie_style"></div>
                <div id="networkChart" class="pie_style" ></div>
                <div id="systemChart" class="pie_style" ></div>
                <div id="sexChart" class="pie_style"></div>
                <div id="ageChart" class="pie_style" ></div>
                <div id="hobbyChart" class="pie_style" ></div>
                <div id="incomeChart" class="pie_style"></div>
                <div id="shopChart" class="pie_style" ></div>
                <div id="marryChart" class="pie_style" ></div> -->
            </div>
        </div>


    </div>



@stop
@section('js')
    <script src="{{Config::get('app.mobileUrl')}}js/mobiscroll.custom-2.17.1.min.js"></script>

    <script type="text/javascript">
        var BASEURL = "{{Config::get('app.mobileUrl')}}";
        $(document).ready(function() {
            mobile.init();

            console.log({{ $messageID }});
            mobile.initMessageDetails('{{ $messageID }}');
        })
    </script>
@stop









