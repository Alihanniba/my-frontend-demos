<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="renderer" content="webkit">
    <meta name="keywords" content="果维素经销系统-声牙出品">
    <meta name="description" content="果维素经销系统-声牙出品">
    <meta name="csrf-token" content="{{ csrf_token() }}" />
    <title>果维素经销系统</title>
    <link rel="stylesheet" href="{{Config::get('app.url')}}css/normalize.css">
    <link rel="stylesheet" href="{{Config::get('app.url')}}css/business.css">
</head>
<body class="index-body">
    <header class="business-header clear-fix">
        <span id="guo-logo">果维素</span>
        <span class="header-left-text">经销版</span>
        <div class="header-right-account">
            <div style="float:left">
                <div>等级</div>
                <div class="my-level">{{ $level }}</div>
            </div>
            <div style="float:left">
                <div>账号</div>
                <div class="tel">{{ $phone }}</div>
            </div>
        </div>
    </header>
    <div class="sell-nav">
        <button class="nav-button" id="product-list" onclick="addClass(this)">产品列表</button>
        <button class="nav-button" id="belong-area" onclick="addClass(this)">所在区域</button>
        <button class="nav-button" id="profit" onclick="addClass(this)">利润</button>
    </div>
    <input type="hidden" id="list_count">
    <div class="list-container" id="show-list">
        <table id="sell-info" class="info-list">
            <thead>
                <tr>
                    <th>价格</th>
                    <th>是否支付</th>
                    <th>时间</th>
                    <th>产品</th>
                    <th>地址</th>
                    <th>电话</th>
                    <th>收货人</th>
                </tr>
            </thead>
            <tbody id="list"></tbody>
        </table>
        <table id="business-info" class="info-list">
            <thead>
                <tr>
                    <td>姓名</td>
                    <td>等级</td>
                    <td>电话</td>
                    <td>进货价</td>
                    <td>地址</td>
                    <td>出货量</td>
                    <td>极差</td>
                </tr>
            </thead>
            <tbody id="business-list">

            </tbody>
        </table>
        <div id="my_profit">
            <div class="chio-level my_profit_structure">我的经销利润</div>
            <div class="chio-area my_profit_structure">
                <p id="sell_profit"></p>
            </div>
            <div class="chio-level my_profit_structure">我的返佣</div>
            <div class="chio-area my_profit_structure">
                <p id="back_cash"></p>
            </div>
            <div class="chio-level my_profit_structure">我的极差利润</div>
            <div class="chio-area my_profit_structure">
                <p id="range_profit"></p>
            </div>
            <div class="chio-level my_profit_structure">总利润</div>
            <div class="chio-area my_profit_structure">
                <p id="gross_profit"></p>
            </div>
        </div>
    </div>
    <script src="{{Config::get('app.url')}}js/jquery-2.1.4.min.js"></script>
    <script src="{{Config::get('app.url')}}js/business.js"></script>
    <!--<script type="text/javascript">_init_area();</script>-->
    <script type="text/javascript">
    var BASEURL = "{{Config::get('app.url')}}";
    $(document).ready(function() {
        business.init();
        business.initSellInfo();
        business.initBusinessInfo();
    });
    </script>
</body>
</html>
