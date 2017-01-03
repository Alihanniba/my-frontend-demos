/*jslint browser: true*/
/*global $, FileReader, alert, initializePlayer, BASEURL*/
/*Created by Zhangjd on 15-10-13.*/

var business = {};
business.init = function () {
    BASEURL = BASEURL || "";
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $(".header-right-account").on("click", function () {
        window.location.href = BASEURL + "business/account";
    });
    $("#header-my-videos").on("click", function () {
        window.location.href = BASEURL + "business/list";
    });
    
};
business.initIndex = function () {
    var checkTel = function (tel) {
        var reg = /^0?1[3|4|5|8][0-9]\d{8}$/;
        return reg.test(tel);
    };
    $(".index-container .switch div").on("click", function () {
        if (!$(this).hasClass("active")) {
            if ($(".index-login-container").css("display") === "block") {
                $(".index-login-container").hide();
                $(".index-register-container").show();
            } else {
                $(".index-login-container").show();
                $(".index-register-container").hide();
            }
        }
    });
    $(".index-form-forget").on("click", function () {
        $(".index-login-container").hide();
        $(".index-find-password-container").show();
    });
    $("#find-step1-button").on("click", function () {
        if (!checkTel($("#find-phone").val())) {
            $("#find-error-1").html("请输入正确的手机号").show();
            return;
        }
        if (!$("#find-verfication").val()) {
            $("#find-error-1").html("请输入验证码").show();
            return;
        }
        $.ajax({
            url: BASEURL + 'business/api/resetPasswordAuth',
            type: 'POST',
            dataType: 'json',
            data: {
                "phone": $("#find-phone").val(),
                "code": $("#find-verfication").val()
            },
        }).done(function (data) {
            if (data.status === 0) {
                $(".index-find-password-container .step1").hide();
                $(".index-find-password-container .step2").show();
            } else {
                $("#find-error-1").html(data.errMsg).show();
            }
        }).fail(function () {
            $("#find-error-1").html("服务器错误").show();
        });
    });
    $("#find-step2-button").on("click", function () {
        if (!$("#find-password").val()) {
            $("#find-error-2").html("请输入密码").show();
            return;
        }
        if ($("#find-password").val().length < 6) {
            $("#find-error-2").html("密码太短").show();
            return;
        }
        if ($("#find-password").val() !== $("#find-confirm-password").val()) {
            $("#find-error-2").html("两次密码不一致").show();
            return;
        }
        $.ajax({
            url: BASEURL + 'business/api/resetPassword',
            type: 'POST',
            dataType: 'json',
            data: {
                'password': $("#find-password").val(),
                'password_confirmation': $("#find-confirm-password").val(),
            },
        }).done(function (data) {
            if (data.status === 0) {
                $(".index-find-password-container .step2").hide();
                $(".index-find-password-container .tips").show();
                setTimeout(function () {
                    $(".index-find-password-container .tips").hide();
                    $(".index-find-password-container .step1").show();
                    $(".index-find-password-container").hide();
                    $(".index-login-container").show();
                }, 2000);
            } else {
                $("#find-error-2").html(data.errMsg).show();
            }
        }).fail(function () {
            $("#find-error-2").html("服务器错误").show();
        });
    });
    $("#login-button").on("click", function () {
        if (!checkTel($("#login-phone").val())) {
            $("#index-error").html("请输入正确的手机号").show();
            return;
        }
        $("#index-error").hide();
        $(this).addClass("index-form-submit-on-progress").html("登录中...");
        var _this = this;
        $.ajax({
            url: BASEURL + 'business/api/login',
            type: 'POST',
            dataType: 'json',
            data: {
                "phone": $("#login-phone").val(),
                "password": $("#login-password").val()
            },
        }).done(function (data) {
            if (data.status === 0) {
                $.ajax({
                    url: BASEURL + 'sell/goIn',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        "phone": $("#login-phone").val(),
                    },
                })
                .done(function(data) {
                    console.log(data);
                    // var phone = $("#login-phone").val();
                    if(data.status===0){
                        window.location.href = BASEURL + 'sell/index?level='+data.level;
                    }else{
                        window.location.href = BASEURL + "business/list";
                    }
                })
                .fail(function() {
                    console.log("error");
                })
                .always(function() {
                    // console.log("complete");
                });
                
                // window.location.href = BASEURL + "business/list";
            } else {
                $("#index-error").html(data.errMsg).show();
                $(_this).removeClass("index-form-submit-on-progress").html("登录");
            }
        }).fail(function () {
            $("#index-error").html("服务器错误").show();
            $(_this).removeClass("index-form-submit-on-progress").html("登录");
        });
    });
    $('#login-password').on('keyup', function (event) {
        if (event.keyCode === 13) {
            $('#login-button').trigger('click');
        }
    });
    $("#register-button").on("click", function () {
        if (!checkTel($("#register-phone").val())) {
            $("#reg-error").html("请输入正确的手机号").show();
            return;
        }
        $("#reg-error").hide();
        $(this).addClass("index-form-submit-on-progress").html("提交中...");
        var _this = this;
        $.ajax({
            url: BASEURL + 'business/api/register',
            type: 'POST',
            dataType: 'json',
            data: {
                "phone": $("#register-phone").val(),
                "password": $("#register-password").val(),
                "code": $("#register-code").val()
            },
        }).done(function (data) {
            console.log(data);
            if (data.status === 0) {
                $(".index-register-container .main").hide();
                $(".index-register-container .tips").show();
                setTimeout(function () {
                    $(".index-register-container .tips").hide();
                    $(".index-register-container .main").show();
                    $(".index-register-container").hide();
                    $(".index-login-container").show();
                }, 2000);
            } else {
                $("#reg-error").html(data.errMsg).show();
                $(_this).removeClass("index-form-submit-on-progress").html("注册");
            }
        }).fail(function () {
            $("#reg-error").html("服务器错误").show();
            $(_this).removeClass("index-form-submit-on-progress").html("注册");
        });
    });
    $(".close-button").on("click", function () {
        if ($(this).hasClass('return-to-login')) {
            $(".index-find-password-container").hide();
            $(".index-find-password-container .step1").show();
            $(".index-find-password-container .step2").hide();
            $(".index-find-password-container .tips").hide();
            $(".index-login-container").show();
        }
    });
    $("#get-register-code").on("click", function () {
        if (!checkTel($("#register-phone").val())) {
            $("#reg-error").html("请输入正确的手机号").show();
            return;
        }
        var _this = this;
        $.ajax({
            url: BASEURL + 'business/api/verifyMessage',
            type: "POST",
            dataType: 'json',
            data: {phone: $("#register-phone").val()},
        }).done(function (data) {
            console.log(data);
            if (data.status === 0) {
                $(_this).html("已发送").attr("disabled", "disabled");
                $(_this).css({
                    "border": "none",
                    "background-color": "#ccc",
                    "color": "#fff",
                });
            } else {
                $("#reg-error").html(data.errMsg).show();
            }
        }).fail(function () {
        });
    });
    $("#find-get-code-button").on("click", function () {
        if (!checkTel($("#find-phone").val())) {
            $("#find-error-1").html("请输入正确的手机号").show();
            return;
        }
        var _this = this;
        $.ajax({
            url: BASEURL + 'business/api/verifyMessage',
            type: "POST",
            dataType: 'json',
            data: {phone: $("#find-phone").val()},
        }).done(function (data) {
            console.log(data);
            if (data.status === 0) {
                $(_this).html("已发送").attr("disabled", "disabled");
                $(_this).css({
                    "border": "none",
                    "background-color": "#ccc",
                    "color":"#fff",
                });
            } else {
                $("#find-error-1").html(data.errMsg).show();
            }
        }).fail(function () {
            $("#find-error-1").html("服务器错误").show();
        });
    });
};
business.initValueChange = function() {
    var level = '';
    var bg = 0;
    $("#s_area").change(function() {
        if($("#s_area").val()!=="区域"){
            $("#enter-button").removeAttr('disabled');
            $("#enter-button").on('click', function() {
                var s_area = $("#s_area").val();
                var s_province = $("#s_province").val();
                var s_city = $("#s_city").val();
                var s_county = $("#s_county").val();
                $("#chio-your-area").css("display","none");
                $("#enter-area-cash").css("display","block");
                $("#area-place").html(s_area);
                if (s_province=="省份") {
                    $("#pay-money").html("￥9999");
                    $("#discount").html("89.4");
                    level = 'A';
                }
                if(s_province!=="省份"){
                    $("#province-place").html(s_province);
                    if(s_city=="地级市"){
                        $("#pay-money").html("￥7999");
                        $("#discount").html("104.3");
                        level = 'B';
                    }
                }
                if(s_city!=="地级市"){
                    $("#city-place").html(s_city);
                    if(s_county=="市、县级市"){
                        $("#pay-money").html("￥4999");
                        $("#discount").html("119.2");
                        level = 'C';
                    }
                }
                if(s_county!=="市、县级市"){
                    $("#county-place").html(s_county);
                    $("#pay-money").html("￥1999");
                    $("#discount").html("134.1");
                    level = 'D';
                }
    });
        }
    });
    
    $(".pay-now").on('click',function(event) {
        /* Act on the event */
        $(".pay-now").css('background', '#43A747');
        $(".pay-later").css('background', '#999');
        bg = 1;
    });
    $(".pay-later").on('click',function(event) {
        /* Act on the event */
        $(".pay-later").css('background', '#43A747');
        $(".pay-now").css('background', '#999');
        bg = 0;
    });

    /*
    点击进入表单
     */
    $("#goIn").on('click',  function() {
        var area = $("#area-place").html()+$("#province-place").html()+$("#city-place").html()+$("#county-place").html();
        $.ajax({
            url: BASEURL + 'sell/save',
            type: 'POST',
            dataType: 'json',
            data: {
                "phone": $(".tel").html(),
                "name" : $("#inputPhone").val(),
                "purchase_price" : $("#discount").html(),
                "level": level,
                "pay"  : bg,
                "area" : area,
                "deposit":$("#pay-money").html(),
            },
        })
        .done(function(data) {
            if(data.status==0){
                window.location.href = BASEURL + 'sell/index?level='+level;
            }
        })
        .fail(function() {
            console.log("error");
        })
        .always(function() {
            // console.log("complete");
        });
        
    });

    // $("#s_province").change(function(){
    //     $("#province-place").html($("#s_province").val());
    // });
    // $("#s_city").change(function(){
    //     $("#city-place").html($("#s_city").val());
    // });
    // $("#s_county").change(function(){
    //     $("#county-place").html($("#s_county").val());
    // });
}
business.initSellInfo = function(){
    var my_level = $(".my-level").html();
    var purchase_price = '';
    var profit = '';
    var back_cash = '';

    $("#product-list").on('click',function() {
        /* Act on the event */
        $("#sell-info").show();
        $("#business-info").hide();
        $("#my_profit").hide();
    });
    $.ajax({
        url: BASEURL + 'sell/list',
        type: 'POST',
        dataType: 'json',
        data: {},
    })
    .done(function(data) {
        // console.log(data);
        count = data.count;
        if (data.info == null){
            return false;
        }
        switch(my_level){
            case 'A':
                purchase_price = 89.4;
                profit = count*(298-purchase_price);
                $("#sell_profit").html(parseFloat(profit).toFixed(2));
                break;
            case 'B':
                purchase_price = 104.3;
                profit = count*(298-purchase_price);
                $("#sell_profit").html(parseFloat(profit).toFixed(2));
                break;
            case 'C':
                purchase_price = 119.2;
                profit = count*(298-purchase_price);
                $("#sell_profit").html(parseFloat(profit).toFixed(2));
                break;
            case 'D':
                purchase_price = 134.1;
                profit = count*(298-purchase_price);
                $("#sell_profit").html(parseFloat(profit).toFixed(2));
                break;
            default:
                break;
        }

        if(count<50){
            back_cash = 0;
            $("#back_cash").html(back_cash);
        }else{
            if(count<300){
                back_cash = count*14.9;
                $("#back_cash").html(back_cash.toFixed(2));
            }else{
                if(count<500){
                    back_cash = count*29.8;
                    $("#back_cash").html(back_cash.toFixed(2));
                }else{
                    if(count<1000){
                        back_cash = count*44.7;
                        $("#back_cash").html(back_cash.toFixed(2));
                    }else{
                        back_cash = count*59.6;
                        $("#back_cash").html(back_cash.toFixed(2));
                    }
                }
            }
        }
        var len = data.info.length;
        if(data.status==0){
            //动态生成列表
            for(var i = len-1; i >=0; i--){
                var price = data.info[i].totalprice;
                var pay_status = data.info[i].pay_status;
                var time = data.info[i].time;
                var product = $.parseJSON(data.info[i].cartdata)[0].name;
                var address = data.info[i].address;
                var phone = data.info[i].phone;
                var consignee = data.info[i].shouhuoname;

                 /* <tr> */
                var trow = document.createElement('tr');   //<tr>
                document.getElementById('list').appendChild(trow);
                
                /* price */
                var sprice = document.createElement('td');   //<td>
                sprice.setAttribute('align', 'center');
                sprice.innerHTML = price;
                trow.appendChild(sprice);
                /* pay_status */
                var spay_status = document.createElement('td');   //<td>
                spay_status.setAttribute('align', 'center');
                spay_status.innerHTML = pay_status;
                trow.appendChild(spay_status);
                /* time */
                var stime = document.createElement('td');   //<td>
                stime.setAttribute('align', 'center');
                stime.innerHTML = time;
                trow.appendChild(stime);
                /* product */
                var sproduct = document.createElement('td');   //<td>
                sproduct.setAttribute('align', 'center');
                sproduct.innerHTML = product;
                trow.appendChild(sproduct);
                /* address */
                var saddress = document.createElement('td');   //<td>
                saddress.setAttribute('align', 'center');
                saddress.innerHTML = address;
                trow.appendChild(saddress);
                /* phone */
                var sphone = document.createElement('td');   //<td>
                sphone.setAttribute('align', 'center');
                sphone.innerHTML = phone;
                trow.appendChild(sphone);
                /* consignee */
                var sconsignee = document.createElement('td');   //<td>
                sconsignee.setAttribute('align', 'center');
                sconsignee.innerHTML = consignee;
                trow.appendChild(sconsignee);
            
            
            }
        }
    })
    .fail(function() {
        console.log("error");
    })
    .always(function() {
        // console.log("complete");
    });
    $.ajax({
        url: BASEURL + 'sell/businessList',
        type: 'POST',
        dataType: 'json',
        data: {},
        })
        .done(function(data) {
            // console.log(data);
            if (data.info == null){
                return false;
            }
            // console.log(data.info);
            var len = data.info.length;
            if(data.status==0){
                //动态生成列表
                for(var i = len-1; i >=0; i--){
                    var name = data.info[i].name;
                    var phone = data.info[i].phone;
                    var area = data.info[i].area;
                    var purchase_price = data.info[i].purchase_price;
                    var level = data.info[i].level;
                    var shipment = data.info[i].shipment;
                    var range = '';
                    var Total_range = 0;

                    switch(level) {
                        case 'D': 
                            switch(my_level) {
                                case 'A':
                                    range = (44.7*shipment).toFixed(2);
                                    break;
                                case 'B':
                                    range = (29.8*shipment).toFixed(2);
                                    break;
                                case 'C':
                                    range = (14.9*shipment).toFixed(2);
                                    break;
                                default:
                                    range = 0;
                            }
                            break;
                        case 'C':
                            switch(my_level) {
                                case 'A':
                                    range = (29.8*shipment).toFixed(2);
                                    break;
                                case 'B':
                                    range = (14.9*shipment).toFixed(2);
                                    break;
                                default:
                                    range = 0;
                            }
                            break;
                        case 'B':
                            switch(my_level) {
                                case 'A':
                                    range = (14.9*shipment).toFixed(2);
                                    break;
                                default:
                                    range = 0;
                            }
                            break;
                        default:
                            range = 0;
                    }

                    Total_range =Total_range+parseFloat(range);

                     /* <tr> */
                    var trow = document.createElement('tr');   //<tr>
                    document.getElementById('business-list').appendChild(trow);
                    
                    /* name */
                    var sname = document.createElement('td');   //<td>
                    sname.setAttribute('align', 'center');
                    sname.innerHTML = name;
                    trow.appendChild(sname);
                    /* level */
                    var slevel = document.createElement('td');   //<td>
                    slevel.setAttribute('align', 'center');
                    slevel.innerHTML = level;
                    trow.appendChild(slevel);
                    /* phone */
                    var sphone = document.createElement('td');   //<td>
                    sphone.setAttribute('align', 'center');
                    sphone.innerHTML = phone;
                    trow.appendChild(sphone);
                    /* purchase_price */
                    var spurchase_price = document.createElement('td');   //<td>
                    spurchase_price.setAttribute('align', 'center');
                    spurchase_price.innerHTML = purchase_price;
                    trow.appendChild(spurchase_price);
                    /* area */
                    var sarea = document.createElement('td');   //<td>
                    sarea.setAttribute('align', 'center');
                    sarea.innerHTML = area;
                    trow.appendChild(sarea);
                    /* shipment */
                    var sshipment = document.createElement('td');   //<td>
                    sshipment.setAttribute('align', 'center');
                    sshipment.innerHTML = shipment;
                    trow.appendChild(sshipment);
                    /* range */
                    var srange = document.createElement('td');
                    srange.setAttribute('align','center');
                    srange.innerHTML = range;
                    trow.appendChild(srange);
                }
                $("#range_profit").html(Total_range.toFixed(2));

            }
        })
        .fail(function() {
            console.log("error");
        })
        .always(function() {
            // console.log("complete");
        });

        setTimeout(function(){
            Total_range = $("#range_profit").html();
            profit = $("#sell_profit").html();
            back_cash = $("#back_cash").html();
            $("#gross_profit").html((parseFloat(Total_range)+parseFloat(profit)+parseFloat(back_cash)).toFixed(2))

        },1000);
}

function addClass(data){
    $(data).addClass('add-class');
    $(data).siblings().removeClass('add-class');
    $(data).siblings().css('background', '#999');
}
business.initBusinessInfo = function(){
    $("#belong-area").on('click',function() {
        $("#sell-info").hide();
        $("#business-info").show();
        $("#my_profit").hide();
    });

    $("#profit").on('click', function(event) {
        $("#sell-info").hide();
        $("#business-info").hide();
        $("#my_profit").show();
    });
    
}
business.initAccountInfo = function () {
    $("#account-update-nickname").on("click", function () {
        $.ajax({
            url: BASEURL + 'business/api/updateNickname',
            type: "POST",
            dataType: 'json',
            data: {nickname: $('#account-new-nickname').val()},
            async: false
        }).done(function (data) {
            if (data.status === 0) {
                alert('保存成功');
            } else {
                alert(data.errMsg);
            }
        }).fail(function () {
            alert('保存失败');
        });
    });

};



