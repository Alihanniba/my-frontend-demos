<!DOCTYPE html>
<html>
<head>
	<title>声牙分众平台</title>
	<link rel="stylesheet" type="text/css" href="{{Config::get('app.mobileUrl')}}css/pad.css">
    <link rel="shortcut icon" href="{{Config::get('app.mobileUrl')}}images/soundTooth.ico">
    <link rel="stylesheet" type="text/css" href="{{Config::get('app.mobileUrl')}}css/dialog_don.css">
</head>
<body>
    <div id="trigger-btn" data-dialog="somedialog" class="trigger"></div>
    <div id="somedialog" class="dialog">
        <div class="dialog__overlay"></div>
        <div id="main" class="dialog__content shown">
            <div class="main-title"></div>
            <div class="notice"></div>
            <div class="action close-btn" data-dialog-close></div>
        </div>
    </div>

	<div class="upper-container">
	   <video src="http://7xl1kb.com2.z0.glb.qiniucdn.com/144428803107j5v7m1bn.mp4" controls="" id="index-video" autoplay="autoplay"></video>
	   <div class="user-info">
            <div class="user-info-list">
                <p class="scan">[scanning]</p>
            </div>
       </div>
    </div>
	<div class="lower-container">
        <img src="http://share.soundtooth.cn/Phoenix-l.jpg" alt="">
        <img src="http://share.soundtooth.cn/Handbrella-l.jpg" alt="">
        <img src="http://share.soundtooth.cn/Project-Care-l.jpg" alt="">
    </div>
    <div class="show-user-data">

    </div>

    <div class="donut_group">
        <div class="column">
            <div id="providerChart" class="pie_style"></div>
            <div id="networkChart" class="pie_style" ></div>
            <div id="systemChart" class="pie_style" ></div>
            <div id="sexChart" class="pie_style"></div>
            <div id="ageChart" class="pie_style" ></div>
            <div id="hobbyChart" class="pie_style" ></div>
            <div id="incomeChart" class="pie_style"></div>
            <div id="shopChart" class="pie_style" ></div>
            <div id="marryChart" class="pie_style" ></div>
        </div>
    </div>
    <input type="hidden" value="{{ $chip_code }}" id="chip_code">
    <script src="{{Config::get('app.mobileUrl')}}js/modernizr.custom.js"></script>
    <script src="{{Config::get('app.mobileUrl')}}js/classie.js"></script>
    <script src="{{Config::get('app.mobileUrl')}}js/dialogFx.js"></script>
	<script src="{{Config::get('app.mobileUrl')}}js/jquery-2.1.4.min.js"></script>
    <script src="{{Config::get('app.mobileUrl')}}js/echarts.js"></script>
    <script src="{{Config::get('app.mobileUrl')}}js/mobile.js"></script>
    <script type="text/javascript" src="{{Config::get('app.mobileUrl')}}js/mediain/comet.js"></script>
	<script type="text/javascript">
        var chip_code = '{{ $chip_code }}';
        var BASEURL = "{{Config::get('app.mobileUrl')}}";
        $(document).ready(function() {
            mobile.initPad();
            mobile.initProgramedIO(chip_code);
            mobile.initDialog();
            // window.WebViewFunc.getMasterCode(chip_code);
        });
    </script>
</body>
</html>
