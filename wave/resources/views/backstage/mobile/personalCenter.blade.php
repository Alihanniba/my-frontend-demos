@extends('backstage.mobile.header')
@section('title', '个人中心')
@section('content')
    <div class="personal-center-module">
        <p class="personal-center-head">个人中心</p>
        <div class="personal-infor-setting">
            <div class="personal-info-guide">
                <div class="basic-setting-guide setting-select">基本信息设置</div>
                <div class="safe-setting-guide">安全信息设置</div>
            </div>
            <div class="basic-info-setting">
                <div class="mobile-phone">注册手机号:  <p>{{ isset($userInfo->phone) ? $userInfo->phone : '' }}</p> <span class="modify-phone">修改手机号</span></div>
                <div class="basic-info-one">
                    <p>邮箱地址:</p>
                    <input type="email"  class="email-addr" value="{{ isset($userInfo->email) ? $userInfo->email : '' }}">
                </div>
                <div class="basic-info-one">
                    <p>联系地址</p>
                    <input type="text"  class="contact-addr" value="{{ isset($userInfo->addr) ? $userInfo->addr : '' }}">
                </div>
                <div class="basic-info-one">
                    <p>QQ</p>
                    <input type="text"  class="qq-code" value="{{ isset($userInfo->qq_id) ? $userInfo->qq_id : '' }}">
                </div>
                <div class="modify-phone-module">
                    <p>修改手机号</p>
                    <div class="modify-phone-content">
                        <input type="text" placeholder="输入手机号" class="input-phone">
                        <input type="text" placeholder="验证码" class="input-verifycode">
                        <button>获取验证码</button>
                    </div>
                    <div class="enter-cancel-modify">
                        <div class="cancel-modify">取消</div>
                        <div class="enter-modify">确定</div>
                    </div>
                </div>
            </div>
            <div class="safe-info-setting">
                <div class="safe-info-one">
                    <p>当前密码:</p>
                    <input type="password"  class="current-password">
                </div>
                <div class="safe-info-one">
                    <p>新密码:</p>
                    <input type="password"  class="new-password" placeholder="6位以上数字或字母">
                </div>
                <div class="safe-info-one">
                    <p>确认密码:</p>
                    <input type="password"  class="enter-password">
                </div>
            </div>
        </div>
        <p class="forget-password">忘记密码?</p>
        <button class="save-setting">保存</button>
    </div>

@stop
@section('js')

    <script type="text/javascript">
        var BASEURL = "{{Config::get('app.mobileUrl')}}";
        $(document).ready(function() {
            mobile.init();
            mobile.initPersonalCenter();

        })
    </script>
@stop









