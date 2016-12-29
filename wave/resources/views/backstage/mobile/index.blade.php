@extends('backstage.mobile.header')
@section('title', '用户画像报表')
@section('css')
    <link rel="stylesheet" href="{{Config::get('app.mobileUrl')}}css/mobiscroll.custom-2.17.1.min.css">
@stop
@section('content')

    <div id="user_portrayal_report">
        <div id="finance-data-report">
            <p id="finance-data-header">财务报表</p>
            <div id="finance-data-show">
                <div id="yesterday-income">
                    <p>昨日收入</p>
                    <p>¥&nbsp; <span id="yesterday-income-num">0</span></p>
                </div>
                <div id="partition-line"></div>
                <div id="total-income">
                    <p>总收入</p>
                    <p>¥&nbsp; <span id="total-income-num">0</span></p>
                </div>
            </div>
        </div>
        <div id="yesterday_data_report">
            <p id="data_report_nav">数据报表 (昨日)</p>
            <div id="data_report_info">
                <div class="line">
                    <span class="font-1">接受人数 </span>
                    <div class="progress_ful"><div id="acceptbar_act"></div></div>
                    <span id="acceptnum_act" class="font-1" style="float: right;"> 0人</span>
                </div>
                <div class="line">
                    <span class="font-1">点击人数 </span>
                    <div class="progress_ful"><div id="clickbar_act"></div></div>
                    <span id="clicknum_act" class="font-1" style="float: right;"> 0人</span>
                </div>
                <div class="line">
                    <span class="font-1">转化人数 </span>
                    <div class="progress_ful"><div id="turnratebar_act"></div></div>
                    <span id="ratenum_act" class="font-1" style="float: right;"> 0人</span>
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
                <div id="providerChart" class="pie_style"></div>
                <div id="networkChart" class="pie_style" ></div>
                <div id="systemChart" class="pie_style" ></div>
                <!-- <div id="sexChart" class="pie_style"></div>
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
    <script src="{{Config::get('app.mobileUrl')}}js/echarts.js"></script>
    <script src="{{Config::get('app.mobileUrl')}}js/mobile_index.js"></script>

    <script type="text/javascript">
        var chip_code = '{{ $chip_code }}';
        console.log('{{ $user_phone }}');

        var BASEURL = "{{Config::get('app.mobileUrl')}}";
        $(document).ready(function() {
            mobile.init();
            mobile.initIndex();
            window.WebViewFunc.getMasterCode(chip_code);
        })
    </script>
@stop

