<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <meta name="keywords" content="">
    <meta name="description" content="">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <meta name="csrf-token" content="{{ csrf_token() }}" />
    <title>用户登录</title>
    <link rel="shortcut icon" href="{{Config::get('app.mobileUrl')}}images/soundTooth.ico">
    <link rel="stylesheet" href="{{Config::get('app.mobileUrl')}}css/mobile.css">
    <script>
        var _hmt = _hmt || [];
        (function() {
          var hm = document.createElement("script");
          hm.src = "//hm.baidu.com/hm.js?4b01d2b2a7a52c41065c6feb59092d19";
          var s = document.getElementsByTagName("script")[0];
          s.parentNode.insertBefore(hm, s);
        })();
    </script>
    <script type="text/javascript" src="http://youzikuwebfont.oss-cn-beijing.aliyuncs.com/api.lib.min.js"></script>
</head>
<body style="background: #6799ff;">
    <!-- <div style="width: 100%;height: 100%;position: absolute;"> -->
        <div class="container" id="login-container">
            <div class="login-logo">
                <img src="{{Config::get('app.mobileUrl')}}images/m_logo.png" alt="logo">
                <span>广告主</span>
            </div>
            <!-- 登录注册 -->
            <div class="loginRegister">
                <!-- 登录框 -->
                <div id="index-login" class="index-container nav-tab-content index-login-container">
                    <div class="switch">
                        <div class="two_button">
                            <div class="active btn-no-select">登录</div>
                            <div class="btn-no-select">注册</div>
                        </div>
                    </div>
                    <div class="content">
                        <div class="index-form-input">
                            <input type="text" placeholder="输入手机号" id="login-phone" name="phone" value="{{ old('phone') }}">
                        </div>
                        <div class="index-form-input">
                            <input type="password" placeholder="密码" id="login-password" name="password">
                        </div>

                        <div class="index-form-forget btn-no-select">忘记密码?</div>
                        <div class="index-form-submit btn-no-select" id="login-button">登录</div>
                    </div>
                </div>

                <!-- 注册框 -->
                <div id="index-register" class="index-container nav-tab-content index-register-container">
                    <div class="switch">
                        <div class="two_button">
                            <div class="btn-no-select">登录</div>
                            <div class="active btn-no-select">注册</div>
                        </div>
                    </div>
                    <div class="content">
                        <div class="index-form-input">
                            <input type="text" placeholder="输入手机号" id="register-phone">
                        </div>
                        <div class="index-form-input">
                            <input type="text" placeholder="验证码" class="register-verfication" id="register-code">
                            <button class="verify-code-button btn-no-select" id="get-register-code">获取验证码</button>
                        </div>
                        <div class="index-form-input">
                            <input type="password" placeholder="密码 (至少6个字符)" id="register-password">
                        </div>
                        <div class="index-form-input">
                            <input type="text" placeholder="芯片码" id="login-serial" name="serial">
                        </div>
                        <div class="index-form-submit btn-no-select" id="register-button">注册</div>
                    </div>
                    <!-- <div class="tips">
                        <div class="title">找回密码</div>
                        <div class="content">
                            <div class="content-main">注册成功!</div>
                            <div class="content-subtitle">正在跳转页面…</div>
                        </div>
                    </div> -->
                </div>

                <!-- 找回密码 -->
                <div class="index-container index-find-password-container" >
                    <div class="step1">
                        <div class="title">找回密码</div>
                        <div class="content">
                            <div class="index-form-input">
                                <input type="text" placeholder="输入手机号" id="find-phone">
                            </div>
                            <div class="index-form-input">
                                <input type="text" placeholder="验证码" id="find-verfication">
                                <button class="verify-code-button btn-no-select" id="find-get-code-button">获取验证码</button>
                            </div>
                            <div class="index-form-input">
                                <input type="password" placeholder="重设密码 (至少6个字符)" id="find-confirm-password">
                            </div>
                            <div class="index-form-submit" id="find-step1-button">确定</div>
                            <div class="index-form-submit" id="exit-step1-button">取消</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    <!-- </div> -->
    <p id="auto_login">正在自动登陆...</p>
    <input type="hidden" value="{{ isset($cookie)?$cookie:0 }}" id="delete_cookie_key">
    <script src="{{Config::get('app.mobileUrl')}}js/jquery-2.1.4.min.js"></script>
    <script src="{{Config::get('app.mobileUrl')}}js/mobile_index.js"></script>
    <script src="{{Config::get('app.mobileUrl')}}js/mobile.js"></script>
    <!-- jQuery Include -->

    <!-- Mobiscroll JS and CSS Includes -->

    <script type="text/javascript">
        var BASEURL = "{{Config::get('app.mobileUrl')}}";
        $(document).ready(function() {
            login.init();
            login.initIndex();
            login.initAutoLogin();
            if ('{{ isset($f) ? $f : false }}' === 'true') {
                $(".index-form-forget").click();
            }
        })
    </script>
</body>
</html>
