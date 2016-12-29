@extends('backstage.mobile.header')
@section('title', '财务中心')
@section('content')
    <div class="finance-center-module">
       <div id="finance-data-report">
            <p id="finance-data-header">财务报表</p>
            <div id="finance-data-show">
                <div id="yesterday-income">
                    <p>昨日支出</p>
                    <p>¥&nbsp; <span id="yesterday-income-num"></span></p>
                </div>
                <div id="partition-line"></div>
                <div id="total-income">
                    <p>余额</p>
                    <p>¥&nbsp; <span id="total-income-num"></span></p>
                </div>
            </div>
        </div>
        <div class="cut-apart-line"></div>
        <div class="finance-bill-list">
            <p>账单</p>
            <div class="bill-list-detail">
                <ul class="bill-list-params">
                    <li class="trade-id">交易号</li>
                    <li class="trade-time">时间</li>
                    <li class="trade-detail">明细</li>
                    <li class="trade-status">状态</li>
                    <li class="trade-num">金额</li>
                </ul>
            </div>
            <button class="get-more">查看更多</button>
        </div>
    </div>

@stop
@section('js')
    <script type="text/javascript">
        var BASEURL = "{{Config::get('app.mobileUrl')}}";
        $(document).ready(function() {
            mobile.init();
            mobile.initFinanceCenter();
        })
    </script>
@stop









