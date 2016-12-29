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
            <div>账号</div>
            <div class="tel">{{ $phone }}</div>
        </div>
    </header>

    <div class="list-container">
        <div id="chio-your-area">
            <div class="chio-level">请选择大区</div>
            <div class="chio-area">
                <select name="s_area" id="s_area"></select>
                <!-- <select id="Area" name="请选择大区" value="">
                    <option value="">请选择大区</option>
                    <option value="华南地区">华南地区</option>
                    <option value="华北地区">华北地区</option>
                    <option value="东北地区">东北地区</option>
                    <option value="西部地区">西部地区</option>
                </select>   -->
            </div>
            <div class="chio-level">请选择省份</div>
            <div class="chio-area">
                <select id="s_province"  name="s_province"></select>  
            </div>
            <div class="chio-level">请选择市级</div>
            <div class="chio-area">
                <select id="s_city"  name="s_city" ></select>  
            </div>
            <div class="chio-level">请选择县级/区</div>
            <div class="chio-area">
                <select id="s_county"  name="s_county"></select>
            </div>
            <div class="chio-level"></div>

            <div class="chio-level enter-area">
                <button type="button" id="enter-button" disabled="disabled">确定</button>
            </div>
        </div>
        <div id="enter-area-cash">
            <div class="chio-level your-area-pay">您选择的经销区域为</div>
            <div class="chio-area" id="area-enjoyplay">
                <div id="first-area">
                    <p class="final-area" id="area-place"></p>
                    <p class="final-area" id="province-place"></p>
                    <p class="final-area" id="city-place"></p>
                    <p class="final-area" id="county-place"></p>
                </div>
            </div>
            <div class="chio-level your-area-pay">您需支付的保证金为</div>
            <div class="chio-area">
                <p id="pay-money"></p>
                <div id="pay-two-button">
                    <button class="pay-button pay-now" >现在支付</button>
                    <button class="pay-button pay-later" >稍后支付</button>
                </div>
            </div>
            <div class="chio-level your-area-pay">您拿到的进货价为</div>
            <div class="chio-area">
                <p id="discount"></p>
            </div>
            <div class="chio-level your-area-pay"></div>
            <div class="chio-area">
                <input type="text" id="inputPhone" placeholder="请输入您的姓名">
                <button type="button" id="goIn">进入</button>
            </div>
        </div>
    </div>

   
    <script class="resources library" src="{{Config::get('app.url')}}js/area.js" type="text/javascript"></script>
    <script src="{{Config::get('app.url')}}js/jquery-2.1.4.min.js"></script>
    <script src="{{Config::get('app.url')}}js/business.js"></script>
    <script type="text/javascript">_init_area();</script>
    <script type="text/javascript">
    var BASEURL = "{{Config::get('app.url')}}";
    $(document).ready(function() {
        business.init();
        business.initValueChange();
    });
    </script>
    <script type="text/javascript">
        var Gid  = document.getElementById ;
        var showArea = function(){
            Gid('show').innerHTML = "<h3>区域"+Gid('s_area').value+"- 省" + Gid('s_province').value + " - 市" +    
            Gid('s_city').value + " - 县/区" + 
            Gid('s_county').value + "</h3>"
                                    }
        // Gid('s_county').setAttribute('onchange','showArea()');
    
</script>
</body>
</html>