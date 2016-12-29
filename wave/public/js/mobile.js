var mobile = {};

var myreg_email = function(email) {
    var reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    return reg.test(email);
};

var checkTel = function(tel) {
    var reg = /^0?1[34578][0-9]\d{8}$/;
    return reg.test(tel);
};




function financeReport(){
    $.ajax({
        url: BASEURL + 'admin/api/totalIncome',
        type: 'GET',
        dataType: 'json',
        data: {
            },
    })
    .done(function(data) {
        console.log(data);
        if (data.success) {
            $('#yesterday-income-num').html(data.yesterdaySalary);
            $('#total-income-num').html(data.totalSalary);
        }
    })
    .fail(function(data) {
        console.log("error");
    })
}

var dateSelect = function (argument) {
    $(function () {
        $('#start_time_input').mobiscroll().range({
            theme: 'mobiscroll',
            lang: 'zh',
            display: 'bottom',
            controls: ['calendar'],
            defaultValue: [ new Date(), new Date() ],
            startInput: '#start_time_input',
            endInput: '#stop_time_input'
        });
    });
}

var navGuide = function(nav, url) {
    $('.guide-nav .' + nav).on('click',function(event) {
        event.preventDefault();
        /* Act on the event */
        $('.guide-nav').animate({right: '-4rem'}, 500, function() {
            $(this).hide();
        });
        // $('body').animate({left:0},500, function() {
            /* stuff to do after animation is complete */

            $(this).unbind('touchmove');

            $('.body-shadow').fadeOut();
        // });
        window.location.href = BASEURL + url;
    });
}

var switchNav = function(){
    // $('.guide-nav').css('height', window.screen.availHeight);
    $('#message-list-header').on('click', function(event) {
        $('.guide-nav').show().animate({ right: '0' }, 500, function() {});
        // $('body').animate({ left:'-4rem' }, 500, function() {

            $('body').bind('touchmove', function (event) {
                event.preventDefault();
            });

            $('.body-shadow').fadeIn();
        // });

        $('.body-shadow').on('click',  function(event) {
            $('.guide-nav').animate({right: '-4rem'}, 500, function() {
                $(this).hide();
            });
            $('body').animate({left:0},500, function() {
                /* stuff to do after animation is complete */

                $(this).unbind('touchmove');

                $('.body-shadow').fadeOut();
            });
        });
    });
    navGuide('backstage-index','admin/turnIndex');
    navGuide('message-list','admin/m/message/list');
    navGuide('finance-center','admin/m/finance/center');
    navGuide('personal-center','admin/m/person/center');
    navGuide('layout','admin/api/mobileLogout');

    $('.guide-nav .notice-center').on('click', function(event) {
        event.preventDefault();
        /* Act on the event */
        $('.body-shadow').unbind('click');
        $('.guide-nav').animate({right: '-4rem'}, 500, function() {
            $(this).hide();
            $('.notice-center-module').fadeIn();
        });
    });

    $('.notice-center-module .cancel-message').on('click',function(event) {
        event.preventDefault();
        /* Act on the event */
        $('.body-shadow').fadeOut();
        $('.notice-center-module').fadeOut();
    });
}



mobile.init = function(){

    switchNav();

    resizeHtml();
    window.onresize = function(){
        resizeHtml();
    };

    //利用javasscript根据当前屏幕宽度动态设置适配的font-size;
    function resizeHtml(){
        //set <html> font-size for rem
        document.getElementsByTagName('html')[0].style.fontSize = window.innerWidth / 10 + 'px';
    }
}


mobile.initIndex = function() {
    //获取财务数据
    financeReport();

    $('#search_data').on('click', function(event) {
        event.preventDefault();
        var startdate = $('#start_time_input').val();
        var enddate = $('#stop_time_input').val();
        // var startdate = '2015-03-01';
        // var enddate = '2016-07-09';
        DateCharts(startdate,enddate);
    });

    DateCharts();

    Date.prototype.format = function(format) {
        var date = {
            "M+": this.getMonth() + 1,
            "d+": this.getDate(),
            "h+": this.getHours(),
            "m+": this.getMinutes(),
            "s+": this.getSeconds(),
            "q+": Math.floor((this.getMonth() + 3) / 3),
            "S+": this.getMilliseconds()
        };
        if (/(y+)/i.test(format)) {
            format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        for (var k in date) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
            }
        }
        return format;
    }

    $("#date_select p").on('click', function(event) {
        $(this).addClass('diff_date').siblings().removeClass('diff_date');
    });

    $('#profile_yesterday').click(function(event) {
        DateCharts();
    });
    $('#profile_week').click(function(event) {
        var date = new Date();
        var currentDate = date.format('yyyy-MM-dd');
        var weekago = new Date(date.getTime() - 7 * 24 * 3600 * 1000).format('yyyy-MM-dd');
        DateCharts(weekago, currentDate);
    });
    $('#profile_month').click(function(event) {
        var date = new Date();
        var currentDate = date.format('yyyy-MM-dd');
        var monthago = new Date(date.getTime() - 30 * 24 * 3600 * 1000).format('yyyy-MM-dd');
        DateCharts(monthago, currentDate);
    });

    dateSelect();
}

function getMessageListForMobile(pageOne,sort) {
    $.ajax({
        url: BASEURL + 'admin/m/api/mobileMessageList',
        type: 'POST',
        dataType: 'json',
        data: {
            pageOne: pageOne,
            sort:sort,
        },
    })
    .done(function(data) {
        console.log(data);
        if(data.success) {
            var messages = data.messages;
            if(messages.length > 0) {
                console.log(messages[0].id);
                for (var i = 0, j = messages.length;  i < j; i++) {
                    $('#messages-contains ul').append(
                        '<li data-id="'+ messages[i].id +'">'+
                            '<div class="messages-basic-info">'+
                                '<p class="messages-name">'+ messages[i].shop_name +'</p>'+
                                '<p>'+
                                    '<span class="messages-time">'+ messages[i].cdate.substr(0,10) +'</span>'+
                                    '<span class="messages-type"></span>'+
                                '</p>'+
                            '</div>'+
                            '<div class="messages-status-info">'+
                                '<span class="messages-status">已上线</span>'+
                                '<span></span>'+
                            '</div>'+
                        '</li>'
                    );
                }
            }
            if (messages.length < 10){
                $('.get-more').fadeOut(1000);
            }
            if(messages.length <= 0) {
                $('#messages-contains ul').remove();
                $('#messages-contains').html("<p class='messages_empty'>暂无数据</p>");
            }
        }

        $('.loading-area').fadeOut(1000);

    })
    .fail(function() {
        console.log("error");
    })
}

mobile.initMessageList = function () {
    $("body").css('background-color', '#fcfcfc');
    $('.loading-area').fadeOut(1000);

    var pageOne = 0;

    $('.messages-list-module .messages-choose-button button').on('click',  function(event) {
        $('.loading-area').fadeIn(1000);
        $('.get-more').fadeIn(1000);

        $(this).addClass('select-button').siblings().removeClass('select-button');
        var sort = $(this).attr('identify');
        console.log(sort);
        pageOne = 0;
        $('#messages-contains ul').empty();
        getMessageListForMobile(pageOne,sort);
    });

    getMessageListForMobile();

    $('.get-more').on('click',function(event) {
        event.preventDefault();
        /* Act on the event */
        pageOne++;
        $('.loading-area').fadeIn(1000);
        getMessageListForMobile(pageOne);
    });

    $('#messages-contains').on('click', 'li', function(event) {
        event.preventDefault();
        /* Act on the event */
        window.location.href = BASEURL + 'admin/m/message/one?messageID=' + $(this).attr('data-id');

    });
}

mobile.initMessageDetails = function (messageID) {
    $('.loading-area').fadeOut(1000);
    $('#go-into-push-content').on('click',function(event) {
        var result = $('#push-content').text();
        window.location.href = result;
    });
    dateSelect();
    console.log(messageID);
    $.ajax({
        url: BASEURL + 'admin/api/getBusinessStatisticInfo',
        type: 'POST',
        dataType: 'json',
        data: {
            mid: messageID
        },
    })
    .done(function(data) {
        console.log(data);
        if (data.success) {
            var rate = data.result.conversion_rate*100;
            var duration = Math.round(data.result.yesterdayDuration);
            $('.message-statistics-data .push-num span').html(data.result.yesterdayPushTimes);
            $('.message-statistics-data .browse-num span').html(data.result.yesterdayViewTimes);
            $('.message-statistics-data .browse-time').html(Math.floor(duration/60)+'分'+Math.floor(duration%60)+'秒');
            $('.message-statistics-data .conversion-rate span').html(rate);
        }
    })
    .fail(function() {
        console.log("error");
    })
}

mobile.initPersonalCenter = function () {
    $('.loading-area').fadeOut(1000);
    $('footer').hide();

    $('.personal-info-guide div').on('click',function(event) {
        event.preventDefault();
        /* Act on the event */
        $(this).addClass('setting-select').siblings().removeClass('setting-select');
    });

    $('.basic-setting-guide').on('click',function(event) {
        event.preventDefault();
        /* Act on the event */
        $('.basic-info-setting').show();
        $('.safe-info-setting').hide();
        $('.forget-password').hide();
        $('.save-setting').removeClass('safe-setting-save');
    });

    $('.safe-setting-guide').on('click',function(event) {
        event.preventDefault();
        /* Act on the event */
        $('.safe-info-setting').show();
        $('.basic-info-setting').hide();
        $('.forget-password').show();
        $('.save-setting').addClass('safe-setting-save');
    });

    $('.modify-phone').on('click', function(event) {
        event.preventDefault();
        /* Act on the event */
        $('.body-shadow').unbind('click');
        $('.body-shadow').fadeIn();
        $('.body-shadow, .modify-phone-module').bind('touchmove', function (event) {
            event.preventDefault();
        });
        $('.modify-phone-module').fadeIn();
    });

    $('.cancel-modify').on('click', function(event) {
        event.preventDefault();
        /* Act on the event */
        $('.modify-phone-module').fadeOut();
        $('.body-shadow').fadeOut();
    });


    /**
     * [description]验证码
     * @param  {[type]} ) {                   if ($('.input-phone').val() [description]
     * @return {[type]}   [description]
     */
    $(".modify-phone-content button").on("click", function() {
        if ($('.input-phone').val() == '' || !checkTel($(".input-phone").val())) {
            alert("请输入正确的手机号码");
            return;
        }

        $(this).attr("disabled", "disabled").html("发送中");

        var _this = this;
        $.ajax({
            url: BASEURL + 'admin/api/verifyMessage',
            type: "POST",
            dataType: 'json',
            data: {
                phone: $('.input-phone').val()
            }
        }).done(function(data) {
            console.log(data);
            if (data.status === 0) {
                $(_this).html("已发送");
                var timer = 60;
                setTimeout(function(){
                    var times = setInterval(function(){
                        timer--;
                        $(_this).html(timer + "秒");
                        if (timer < 0){
                            $(_this).removeAttr('disabled').html("获取验证码");
                            $(_this).css({
                                "background-color": "#e9e9e9",
                                'color': "#999",
                                'cursor': 'pointer'
                            });
                            clearInterval(times);
                        }
                    },1000);
                },1000);
                $(_this).css({
                    "background-color": "#6799ff",
                    color: "#fff",
                    'cursor': 'default'
                });
            } else {
                alert(data.errMsg);
            }
        }).fail(function() {
            alert('服务器错误,请重试');
        });
    });


    /**
     * [description]修改手机号
     * @param  {[type]} event) {                                  event.preventDefault();                                           if ($('.input-phone').val() [description]
     * @param  {[type]} code:  $('.input-verifycode').val()                                   }        }).done(function(data) {                                                   console.log(data);            if(data.status [description]
     * @return {[type]}        [description]
     */
    $('.enter-modify').on('click', function(event) {
        event.preventDefault();
        /* Act on the event */
        if ($('.input-phone').val() == '' || !checkTel($(".input-phone").val())) {
            alert("请输入正确的手机号码");
            return;
        }
        if ($('.input-verifycode').val() == '') {
            alert("请输入正确的验证码");
            return;
        }

        $.ajax({
            url: BASEURL + 'admin/api/modifyPhone',
            type: 'POST',
            dataType: 'json',
            data: {
                phone: $('.input-phone').val(),
                code: $('.input-verifycode').val()
            }
        }).done(function(data) {
            console.log(data);
            if(data.status == -1){
                alert('未生成验证码');
                return false;
            } else if(data.status == -2){
                alert('验证码失效');
                return false;
            } else if(data.status == -3){
                alert('验证码错误');
                return false;
            } else if(data.status == 0){
                alert('修改成功');
                $('.modify-phone-module').fadeOut();
                $('.body-shadow').fadeOut();
            }
        }).fail(function() {
            $(".modify_phone_box .error").html("服务器错误").css('opacity', 1);
            $('.modify_phone_box .submit_phone').html("确定");
        });
    });

    /**
     * [description]修改密码
     * @param  {[type]} event) {                   event.preventDefault();        if ($('.safe-setting-guide').hasClass('setting-select')) {            if (!$(".current-password").val()) {                alert("请输入旧密码!");                return;            }            if (!$(".new-password").val()) {                alert("请输入新密码!");                return;            }            if ($(".new-password").val().length < 8) {                alert("密码长度必须大于或等于八位");                return;            }            if (!$(".enter-password").val()) {                alert("请确认新密码!");                return;            }            if ($(".new-password").val() ! [description]
     * @return {[type]}        [description]
     */
    $(".save-setting").on('click', function(event) {
        event.preventDefault();
        if ($('.safe-setting-guide').hasClass('setting-select')) {
            if (!$(".current-password").val()) {
                alert("请输入旧密码!");
                return;
            }

            if (!$(".new-password").val()) {
                alert("请输入新密码!");
                return;
            }

            if ($(".new-password").val().length < 8) {
                alert("密码长度必须大于或等于八位");
                return;
            }

            if (!$(".enter-password").val()) {
                alert("请确认新密码!");
                return;
            }

            if ($(".new-password").val() != $(".enter-password").val()) {
                alert("新密码两次输入不相等,请重新输入");
                return;
            }

            $.ajax({
                url: BASEURL + 'admin/api/updatePasswd',
                type: 'POST',
                dataType: 'json',
                data: {
                    oldPw: $(".current-password").val(),
                    newPw: $(".new-password").val(),
                },
            })
            .done(function(data) {
                if (data.success) {
                    alert("更新成功");
                    window.location = BASEURL + 'admin/m/person/center';
                } else {
                    alert('请输入正确的旧密码');
                }
            })
            .fail(function() {
                console.log("error");
            })
        }
    });

    /**
     * [description]保存个人信息
     * @param  {[type]} event) {                                           event.preventDefault();                                      if ($('.basic-setting-guide').hasClass('setting-select')) {                              if ($(".email-addr").val() [description]
     * @param  {[type]} addr:  $(".contact-addr").val() [description]
     * @param  {[type]} qq:    $(".qq-code").val()      [description]
     * @param  {[type]} }     [description]
     * @param  {[type]} })                                                                           .done(function(data) {                                                                          if (data.success) {                                                          alert("保存成功!");                    window.location [description]
     * @return {[type]}        [description]
     */
    $('.save-setting').on('click',function(event) {
        event.preventDefault();
        /* Act on the event */
        if ($('.basic-setting-guide').hasClass('setting-select')) {
            if ($(".email-addr").val() == '' || !myreg_email($(".email-addr").val())) {
                alert("邮箱为必填选项,请输入正确的邮箱");
                return;
            }
            $.ajax({
                url: BASEURL + 'admin/api/setInfo',
                type: 'POST',
                dataType: 'json',
                data: {
                    email: $(".email-addr").val(),
                    addr: $(".contact-addr").val(),
                    qq: $(".qq-code").val(),
                },
            })
            .done(function(data) {
                if (data.success) {
                    alert("保存成功!");
                    window.location = BASEURL + 'admin/m/person/center';
                } else {
                    alert("保存失败,请重新保存!");
                }
            })
            .fail(function() {
                console.log("error");
            })
        }
    });

    /**
     * [description]忘记密码
     * @param  {[type]} event) {                   event.preventDefault();                window.location.href [description]
     * @return {[type]}        [description]
     */
    $('.forget-password').on('click',function(event) {
        event.preventDefault();
        /* Act on the event */
        console.log('dd');
        window.location.href = BASEURL + 'admin/api/mobileLogout?f=true'
    });
}

function getBillListForMobile(page) {
    $.ajax({
        url: BASEURL + 'admin/m/api/mobileFinanceBill',
        type: 'POST',
        dataType: 'json',
        data: {
            page: page,
        },
    })
    .done(function(data) {
        console.log(data);
        if(data.success) {
            if(data.finance.length > 0) {
                for (var i = 0,j = data.finance.length; i < j; i++) {
                    $('.bill-list-detail').append(
                        '<ul class="bill-list-value">'+
                            '<li class="trade-id">'+ data.finance[i].id +'</li>'+
                            '<li class="trade-time">'+ data.finance[i].cdate.substr(0,10) +'</li>'+
                            '<li class="trade-detail">提现</li>'+
                            '<li class="trade-status">已完成</li>'+
                            '<li class="trade-num">'+ data.finance[i].moeny +'</li>'+
                        '</ul>'
                    );
                }
            }
            if (data.finance.length < 10) {
                $('.get-more').fadeOut(1000);
            }
        }
        $('.loading-area').fadeOut(1000);
    })
    .fail(function() {
        console.log("error");
    })
}

mobile.initFinanceCenter = function() {
    $('.loading-area').fadeOut(1000);
    financeReport();

    var pageOne = 0;
    getBillListForMobile(pageOne);

    $('.get-more').on('click', function(event) {
        event.preventDefault();
        /* Act on the event */
        pageOne++;
        $('.loading-area').fadeIn(1000);
        getBillListForMobile(pageOne);
    });
}


function initPadData() {
    require.config({
        paths: {
            echarts: BASEURL + 'js'
        }
    });
    var id;
    /** loading */
    $('.loading-area').fadeIn();
    /**
     * [options: style options for echart]
     * @type {Object}
     */
    var options = {
        color: ['#cb9afe', '#fccd95', '#9acdff', '#43ca81', '#a10000'],
        title: {
            x: '70',
            y: 'bottom',
            textStyle: {
                fontSize: '16',
                color: '#000',
                align: 'left',
                fontFamily: 'Helvetica Neue, Helvetica, 微软雅黑, HiraginoSansGB, Arial, sans-serif, 冬青黑体',
                fontWeight: 'normal'
            }
        },
        toolTip: {
            format: '{a} <br/>{b}',
            textStyle: {
                fontSize: '12',
                color: '#fff',
                fontFamily: 'Helvetica Neue, Helvetica, 微软雅黑, HiraginoSansGB, Arial, sans-serif, 冬青黑体',
                align: 'left',
                fontWeight: 'normal'
            }
        },
        legend: {
            x: 200,
            y: 'center',
            textStyle: {
                color:'#333',
                fontSize: '12',
                fontFamily: 'Helvetica Neue, Helvetica, 微软雅黑, HiraginoSansGB, Arial, sans-serif, 冬青黑体',
                align: 'left',
                fontWeight: 'normal'
            }
        },
        series: {
            center: [100, 90]
        }
    }

    // console.log(startdate + ', ' + enddate);
    /*provider*/
    $.ajax({
            url: BASEURL + 'admin/m/api/userProfileForPad',
            type: 'POST',
            dataType: 'json',
            data: {
                chip_code: $('#chip_code').val(),
            },
    })
    .done(function(data) {
        // console.log(data);
        if (data.success) {
            if (data.provider.length > 0) {
                $('#providerChart').show();
                $('#providerChart').css({
                    'margin-top':'0'
                });
                $('#providerChart').css('background', '#fff');
                require(
                    [
                        'echarts',
                        'echarts/chart/pie',
                    ],
                    function(ec) {
                        var providerChart = ec.init(document.getElementById('providerChart'));
                        var option = {
                            title: {
                                show: true,
                                text: '通讯类型',
                                x: options.title.x,
                                y: options.title.y,
                                textStyle: options.title.textStyle
                            },
                            tooltip: {
                                show: true,
                                formatter: options.toolTip.format,
                                textStyle: options.toolTip.textStyle
                            },
                            color: options.color,
                            legend: {
                                x: options.legend.x,
                                y: options.legend.y,
                                orient: 'vertical',
                                data: data.provider,
                                textStyle: options.legend.textStyle
                            },
                            series: [{
                                center: options.series.center,
                                name: '通讯类型',
                                type: 'pie',
                                radius: ['70%', '50%'],
                                avoidLabelOverlap: false,
                                itemStyle: {
                                    normal: {
                                        label: {
                                            show: false
                                        },
                                        labelLine: {
                                            show: false
                                        }
                                    }
                                },
                                label: {
                                    normal: {
                                        show: false,
                                        position: 'left'
                                    },
                                    emphasis: {
                                        show: false,
                                        textStyle: {
                                            fontSize: '20',
                                            fontWeight: 'bold'
                                        }
                                    }
                                },
                                labelLine: {
                                    normal: {
                                        show: false
                                    }
                                },
                                data: data.provider
                            }]
                        };
                          providerChart.setOption(option);
                    });
            } else {
                $('#providerChart').hide();
                $('#providerChart').html('');
                $('#providerChart').css({
                    'background-repeat': 'no-repeat',
                    'background-size': 'contain',
                    'background-position': 'center'
                });
            }
            //provider
            if (data.network.length > 0) {
                $('#networkChart').show();
                $('#networkChart').css('background', '#fff');
                require(
                    [
                        'echarts',
                        'echarts/chart/pie',
                    ],
                    function(ec) {
                        var networkChart = ec.init(document.getElementById('networkChart'));
                        var option = {
                            title: {
                                show: true,
                                text: '网络类型',
                                x: options.title.x,
                                y: options.title.y,
                                textStyle: options.title.textStyle
                            },
                            tooltip: {
                                show: true,
                                formatter: options.toolTip.format,
                                textStyle: options.toolTip.textStyle
                            },
                            color: options.color,
                            legend: {
                                x: options.legend.x,
                                y: options.legend.y,
                                orient: 'vertical',
                                data: data.network,
                                textStyle: options.legend.textStyle
                            },
                            series: [{
                                center: options.series.center,
                                name: '网络类型',
                                type: 'pie',
                                x: 'right',
                                radius: ['70%', '50%'],
                                avoidLabelOverlap: false,
                                itemStyle: {
                                    normal: {
                                        label: {
                                            show: false
                                        },
                                        labelLine: {
                                            show: false
                                        }
                                    }
                                },
                                label: {
                                    normal: {
                                        show: false,
                                        position: 'center'
                                    },
                                    emphasis: {
                                        show: false,
                                        textStyle: {
                                            fontSize: '20',
                                            fontWeight: 'bold'
                                        }
                                    }
                                },
                                labelLine: {
                                    normal: {
                                        show: false
                                    }
                                },
                                data: data.network
                            }]
                        };
                        networkChart.setOption(option);
                    }
                );
            } else {
                $('#networkChart').html('');
                $('#networkChart').hide();

                $('#networkChart').css({
                    'background-repeat': 'no-repeat',
                    'background-size': 'contain',
                    'background-position': 'center'
                });
            }
            if (data.system.length > 0) {
                $('#systemChart').show();
                $('#systemChart').css('background', '#fff');
                require(
                    [
                        'echarts',
                        'echarts/chart/pie',
                    ],
                    function(ec) {
                        var systemChart = ec.init(document.getElementById('systemChart'));
                        var option = {
                            title: {
                                show: true,
                                text: '系统类型',
                                x: options.title.x,
                                y: options.title.y,
                                textStyle: options.title.textStyle
                            },
                            tooltip: {
                                show: true,
                                formatter: options.toolTip.format,
                                textStyle: options.toolTip.textStyle
                            },
                            color: options.color,
                            legend: {
                                x: options.legend.x,
                                y: options.legend.y,
                                orient: 'vertical',
                                data: data.system,
                                textStyle: options.legend.textStyle
                            },
                            series: [{
                                center: options.series.center,
                                name: '系统类型',
                                type: 'pie',
                                x: 'right',
                                radius: ['70%', '50%'],
                                avoidLabelOverlap: false,
                                itemStyle: {
                                    normal: {
                                        label: {
                                            show: false
                                        },
                                        labelLine: {
                                            show: false
                                        }
                                    }
                                },
                                label: {
                                    normal: {
                                        show: false,
                                        position: 'center'
                                    },
                                    emphasis: {
                                        show: false,
                                        textStyle: {
                                            fontSize: '20',
                                            fontWeight: 'bold'
                                        }
                                    }
                                },
                                labelLine: {
                                    normal: {
                                        show: false
                                    }
                                },
                                data: data.system
                            }]
                        };
                        systemChart.setOption(option);
                    }
                );
            } else {
                $('#systemChart').hide();

                $('#systemChart').html('');
                $('#systemChart').css({
                    'background-repeat': 'no-repeat',
                    'background-size': 'contain',
                    'background-position': 'center'
                });
            }
        } else {
            $('#providerChart').html('');
            $('#providerChart').css({
                'background-image': 'url(./../../images/empty.jpg)',
                'background-repeat': 'no-repeat',
                'background-size': 'contain',
                'background-position': 'center'
            });
        }
        /** disappear loading */
        $('.loading-area').fadeOut();
    })
    .fail(function() {
        console.log("error");
    });

    $.ajax({
        url: BASEURL + 'admin/api/usersTestData',
        type: 'POST',
        dataType: 'json',
    })
    .done(function(data) {
        // console.log(data);
        if(data.success){
            if (data.sex.length > 0) {
                $('#sexChart').show();
                $('#sexChart').css({
                    'margin-top':'0'
                });
                $('#sexChart').css('background', '#fff');
                require(
                    [
                        'echarts',
                        'echarts/chart/pie',
                    ],
                    function(ec) {
                        var sexChart = ec.init(document.getElementById('sexChart'));
                        var option = {
                            title: {
                                show: true,
                                text: '性别分析',
                                x: options.title.x,
                                y: options.title.y,
                                textStyle: options.title.textStyle
                            },
                            tooltip: {
                                show: true,
                                formatter: options.toolTip.format,
                                textStyle: options.toolTip.textStyle
                            },
                            color: options.color,
                            legend: {
                                x: options.legend.x,
                                y: options.legend.y,
                                orient: 'vertical',
                                data: data.sex,
                                textStyle: options.legend.textStyle
                            },
                            series: [{
                                center: options.series.center,
                                name: '性别分析',
                                type: 'pie',
                                radius: ['70%', '50%'],
                                avoidLabelOverlap: false,
                                itemStyle: {
                                    normal: {
                                        label: {
                                            show: false
                                        },
                                        labelLine: {
                                            show: false
                                        }
                                    }
                                },
                                label: {
                                    normal: {
                                        show: false,
                                        position: 'left'
                                    },
                                    emphasis: {
                                        show: false,
                                        textStyle: {
                                            fontSize: '20',
                                            fontWeight: 'bold'
                                        }
                                    }
                                },
                                labelLine: {
                                    normal: {
                                        show: false
                                    }
                                },
                                data: data.sex
                            }]
                        };
                          sexChart.setOption(option);
                    });
            } else {
                $('#sexChart').hide();
                $('#sexChart').html('');
                $('#sexChart').css({
                    // 'background-image': 'url(./../../images/empty.jpg)',
                    'background-repeat': 'no-repeat',
                    'background-size': 'contain',
                    'background-position': 'center'
                });
            }
            if (data.age.length > 0) {
                $('#ageChart').show();
                $('#ageChart').css('background', '#fff');
                require(
                    [
                        'echarts',
                        'echarts/chart/pie',
                    ],
                    function(ec) {
                        var ageChart = ec.init(document.getElementById('ageChart'));
                        var option = {
                            title: {
                                show: true,
                                text: '年龄分布',
                                x: options.title.x,
                                y: options.title.y,
                                textStyle: options.title.textStyle
                            },
                            tooltip: {
                                show: true,
                                formatter: options.toolTip.format,
                                textStyle: options.toolTip.textStyle
                            },
                            color: options.color,
                            legend: {
                                x: options.legend.x,
                                y: options.legend.y,
                                orient: 'vertical',
                                data: data.age,
                                textStyle: options.legend.textStyle
                            },
                            series: [{
                                center: options.series.center,
                                name: '年龄分布',
                                type: 'pie',
                                x: 'right',
                                radius: ['70%', '50%'],
                                avoidLabelOverlap: false,
                                itemStyle: {
                                    normal: {
                                        label: {
                                            show: false
                                        },
                                        labelLine: {
                                            show: false
                                        }
                                    }
                                },
                                label: {
                                    normal: {
                                        show: false,
                                        position: 'center'
                                    },
                                    emphasis: {
                                        show: false,
                                        textStyle: {
                                            fontSize: '20',
                                            fontWeight: 'bold'
                                        }
                                    }
                                },
                                labelLine: {
                                    normal: {
                                        show: false
                                    }
                                },
                                data: data.age
                            }]
                        };
                        ageChart.setOption(option);
                    }
                );
            } else {
                $('#ageChart').html('');
                $('#ageChart').hide();
                $('#ageChart').css({
                    // 'background-image': 'url(./../../images/empty.jpg)',
                    'background-repeat': 'no-repeat',
                    'background-size': 'contain',
                    'background-position': 'center'
                });
            }
            if (data.hobby.length > 0) {
                $('#hobbyChart').show();
                $('#hobbyChart').css('background', '#fff');
                require(
                    [
                        'echarts',
                        'echarts/chart/pie',
                    ],
                    function(ec) {
                        var hobbyChart = ec.init(document.getElementById('hobbyChart'));
                        var option = {
                            title: {
                                show: true,
                                text: '爱好分析',
                                x: options.title.x,
                                y: options.title.y,
                                textStyle: options.title.textStyle
                            },
                            tooltip: {
                                show: true,
                                formatter: options.toolTip.format,
                                textStyle: options.toolTip.textStyle
                            },
                            color: options.color,
                            legend: {
                                x: options.legend.x,
                                y: options.legend.y,
                                orient: 'vertical',
                                data: data.hobby,
                                textStyle: options.legend.textStyle
                            },
                            series: [{
                                center: options.series.center,
                                name: '爱好分析',
                                type: 'pie',
                                x: 'right',
                                radius: ['70%', '50%'],
                                avoidLabelOverlap: false,
                                itemStyle: {
                                    normal: {
                                        label: {
                                            show: false
                                        },
                                        labelLine: {
                                            show: false
                                        }
                                    }
                                },
                                label: {
                                    normal: {
                                        show: false,
                                        position: 'center'
                                    },
                                    emphasis: {
                                        show: false,
                                        textStyle: {
                                            fontSize: '20',
                                            fontWeight: 'bold'
                                        }
                                    }
                                },
                                labelLine: {
                                    normal: {
                                        show: false
                                    }
                                },
                                data: data.hobby
                            }]
                        };
                        hobbyChart.setOption(option);
                    }
                );
            } else {
                $('#hobbyChart').hide();

                $('#hobbyChart').html('');
                $('#hobbyChart').css({
                    // 'background-image': 'url(./../../images/empty.jpg)',
                    'background-repeat': 'no-repeat',
                    'background-size': 'contain',
                    'background-position': 'center'
                });
            }
            if (data.income.length > 0) {
                $('#incomeChart').show();
                $('#incomeChart').css('background', '#fff');
                require(
                    [
                        'echarts',
                        'echarts/chart/pie',
                    ],
                    function(ec) {
                        var incomeChart = ec.init(document.getElementById('incomeChart'));
                        var option = {
                            title: {
                                show: true,
                                text: '收入水平',
                                x: options.title.x,
                                y: options.title.y,
                                textStyle: options.title.textStyle
                            },
                            tooltip: {
                                show: true,
                                formatter: options.toolTip.format,
                                textStyle: options.toolTip.textStyle
                            },
                            color: options.color,
                            legend: {
                                x: options.legend.x,
                                y: options.legend.y,
                                orient: 'vertical',
                                data: data.income,
                                textStyle: options.legend.textStyle
                            },
                            series: [{
                                center: options.series.center,
                                name: '收入水平',
                                type: 'pie',
                                x: 'right',
                                radius: ['70%', '50%'],
                                avoidLabelOverlap: false,
                                itemStyle: {
                                    normal: {
                                        label: {
                                            show: false
                                        },
                                        labelLine: {
                                            show: false
                                        }
                                    }
                                },
                                label: {
                                    normal: {
                                        show: false,
                                        position: 'center'
                                    },
                                    emphasis: {
                                        show: false,
                                        textStyle: {
                                            fontSize: '20',
                                            fontWeight: 'bold'
                                        }
                                    }
                                },
                                labelLine: {
                                    normal: {
                                        show: false
                                    }
                                },
                                data: data.income
                            }]
                        };
                        incomeChart.setOption(option);
                    }
                );
            } else {
                $('#incomeChart').hide();

                $('#incomeChart').html('');
                $('#incomeChart').css({
                    // 'background-image': 'url(./../../images/empty.jpg)',
                    'background-repeat': 'no-repeat',
                    'background-size': 'contain',
                    'background-position': 'center'
                });
            }
            if (data.shop.length > 0) {
                $('#shopChart').show();
                $('#shopChart').css('background', '#fff');
                require(
                    [
                        'echarts',
                        'echarts/chart/pie',
                    ],
                    function(ec) {
                        var shopChart = ec.init(document.getElementById('shopChart'));
                        var option = {
                            title: {
                                show: true,
                                text: '消费水平',
                                x: options.title.x,
                                y: options.title.y,
                                textStyle: options.title.textStyle
                            },
                            tooltip: {
                                show: true,
                                formatter: options.toolTip.format,
                                textStyle: options.toolTip.textStyle
                            },
                            color: options.color,
                            legend: {
                                x: options.legend.x,
                                y: options.legend.y,
                                orient: 'vertical',
                                data: data.shop,
                                textStyle: options.legend.textStyle
                            },
                            series: [{
                                center: options.series.center,
                                name: '消费水平',
                                type: 'pie',
                                x: 'right',
                                radius: ['70%', '50%'],
                                avoidLabelOverlap: false,
                                itemStyle: {
                                    normal: {
                                        label: {
                                            show: false
                                        },
                                        labelLine: {
                                            show: false
                                        }
                                    }
                                },
                                label: {
                                    normal: {
                                        show: false,
                                        position: 'center'
                                    },
                                    emphasis: {
                                        show: false,
                                        textStyle: {
                                            fontSize: '20',
                                            fontWeight: 'bold'
                                        }
                                    }
                                },
                                labelLine: {
                                    normal: {
                                        show: false
                                    }
                                },
                                data: data.shop
                            }]
                        };
                        shopChart.setOption(option);
                    }
                );
            } else {
                $('#shopChart').hide();

                $('#shopChart').html('');
                $('#shopChart').css({
                    // 'background-image': 'url(./../../images/empty.jpg)',
                    'background-repeat': 'no-repeat',
                    'background-size': 'contain',
                    'background-position': 'center'
                });
            }
            if (data.marry.length > 0) {
                $('#marryChart').show();
                $('#marryChart').css('background', '#fff');
                require(
                    [
                        'echarts',
                        'echarts/chart/pie',
                    ],
                    function(ec) {
                        var marryChart = ec.init(document.getElementById('marryChart'));
                        var option = {
                            title: {
                                show: true,
                                text: '婚姻状况',
                                x: options.title.x,
                                y: options.title.y,
                                textStyle: options.title.textStyle
                            },
                            tooltip: {
                                show: true,
                                formatter: options.toolTip.format,
                                textStyle: options.toolTip.textStyle
                            },
                            color: options.color,
                            legend: {
                                x: options.legend.x,
                                y: options.legend.y,
                                orient: 'vertical',
                                data: data.marry,
                                textStyle: options.legend.textStyle
                            },
                            series: [{
                                center: options.series.center,
                                name: '婚姻状况',
                                type: 'pie',
                                x: 'right',
                                radius: ['70%', '50%'],
                                avoidLabelOverlap: false,
                                itemStyle: {
                                    normal: {
                                        label: {
                                            show: false
                                        },
                                        labelLine: {
                                            show: false
                                        }
                                    }
                                },
                                label: {
                                    normal: {
                                        show: false,
                                        position: 'center'
                                    },
                                    emphasis: {
                                        show: false,
                                        textStyle: {
                                            fontSize: '20',
                                            fontWeight: 'bold'
                                        }
                                    }
                                },
                                labelLine: {
                                    normal: {
                                        show: false
                                    }
                                },
                                data: data.marry
                            }]
                        };
                        marryChart.setOption(option);
                    }
                );
            } else {
                $('#marryChart').hide();

                $('#marryChart').html('');
                $('#marryChart').css({
                    // 'background-image': 'url(./../../images/empty.jpg)',
                    'background-repeat': 'no-repeat',
                    'background-size': 'contain',
                    'background-position': 'center'
                });
            }
        }
        $('.loading-area').fadeOut();
    })
    .fail(function() {
        console.log("error");
    })
}

mobile.initPad = function () {
    const userAgent = window.navigator.userAgent.toLowerCase();

    if (userAgent.indexOf('ie') >= 0) {
        $('#index-video').height(document.documentElement.clientHeight / 2);
        $('.user-info-list').height(document.documentElement.clientHeight / 2);
    } else if (userAgent.indexOf('firefox') >= 0) {
        $('#index-video').height(document.documentElement.clientHeight / 2);
        $('.user-info-list').height(document.documentElement.clientHeight / 2);
    } else if (userAgent.indexOf('opera') >= 0) {
        $('#index-video').height(document.documentElement.clientHeight / 2);
        $('.user-info-list').height(document.documentElement.clientHeight / 2);
    } else {
        $('#index-video').height(window.screen.availHeight / 2);
        $('.user-info-list').height(window.screen.availHeight / 2);
    }

    initPadData();
};

mobile.initProgramedIO = function (chipCode) {
    /**
     * init the post addr
     */
    comet.init(BASEURL + 'api/watchUserChange/vi');

    /** init post data */
    var postData = {
        'chipNo': chipCode,
    };

    /** count */
    var count = 0;

    /** post and bind callback function */
    comet.subscribe(postData, function(data) {
        /** image arr */
        var image = [
            'http://share.soundtooth.cn/blue-buck-l.jpg',
            'http://share.soundtooth.cn/Phoenix-l.jpg',
            'http://share.soundtooth.cn/Buffalo-l1.jpg',
            'http://share.soundtooth.cn/Agralot-FC-l.jpg',
            'http://share.soundtooth.cn/Handbrella-l.jpg',
            'http://share.soundtooth.cn/Project-Care-l.jpg',
            'http://share.soundtooth.cn/souce-l.jpg',
            'http://share.soundtooth.cn/Tornicka-Bobija-l.png',
            'http://share.soundtooth.cn/Sync-Zone-l.jpg',
            'http://share.soundtooth.cn/Sparks-SA-l.jpg',
            'http://share.soundtooth.cn/The-Modern-History-of-Football-Uniform-Design-l.png',
            'http://share.soundtooth.cn/All-Star-Cheer-Championship-l.jpg',
            'http://share.soundtooth.cn/125-Colors-l.jpg',
            'http://share.soundtooth.cn/Boat-l.jpg',
            'http://share.soundtooth.cn/Grand-Rapids-Griffins-l.jpg',
            'http://share.soundtooth.cn/Design-Foundry-l.jpg',
            'http://share.soundtooth.cn/Immobiliere-Lormont-l.jpg',
            'http://share.soundtooth.cn/Pexinxas-24-l.jpg'
        ];

        /** update scanning status- */
        $('.user-info .user-info-list p.scan').fadeOut(400);
        setTimeout(function() {
            $('.user-info .user-info-list p.scan').fadeIn(400);
        }, 400);

        if (data.users.length > 0) {
            /** clear active */
            $('.user-info .user-info-list p.active').removeClass('active');

            /** clear content if the number has been greater than 15 */
            $pLists = $('.user-info .user-info-list p.mac-addr');

            if ($pLists.length > 15) {
                $pLists.eq(0).remove();
            }

            $pLists.unbind('click');

            /** update image */
            var index = Math.floor(Math.random() * (image.length - 1));
            $('.lower-container').children('img').eq(count).css({ 'opacity': 0 });
            setTimeout(function () {
                $('.lower-container').children('img').eq(count).attr('src', image[index]);

                setTimeout(function () {
                    $('.lower-container').children('img').eq(count).css({ 'opacity': 1 });
                    count = (++count % 3);

                    if (count == 2) {
                        /** update data */
                        initPadData();
                    }
                }, 400);
            }, 200);

            /** show Info */
            for (var item in data.users) {
                $info = $('.user-info');
                if (data.users[item].cli_mac != '') {
                    $('.user-info .user-info-list').append('<p class="mac-addr active" data=' + JSON.stringify(data.users[item].userInfo) + '>' + data.users[item].cli_mac + '</p>');
                }
                $info.scrollTop($info[0].scrollHeight);
            }

            $('.user-info .user-info-list p.mac-addr').bind('click', function(event) {
                /* Act on the event */
                $('.dialog .main-title').text($(this).text());
                const $notice = $('.dialog .notice');
                const data = JSON.parse($(this).attr('data'));

                var service_provider = {
                    "1": "其他",
                    "2": "中国联通",
                    "3": "中国移动",
                    "4": "中国电信"
                };

                var network_type = {
                    "1": "其他",
                    "2": "2G",
                    "3": "3G",
                    "4": "4G",
                    "5": "Wifi"
                };

                var terminal_system_type = {
                    "1": "其他",
                    "2": "iOS",
                    "3": "Android"
                };

                $notice.children('div').remove();

                for (var item in data) {
                    if (item == 'service_provider_id') {
                        var reserved = data[item] == '' ? '未知' : service_provider[data[item]];
                        item = '网络运营商';
                        data[item] = reserved;
                    }

                    if (item == 'network_type_id') {
                        var reserved = data[item] == '' ? '未知' : network_type[data[item]];
                        item = '网络类型';
                        data[item] = reserved;
                    }

                    if (item == 'terminal_system_id') {
                        var reserved = data[item] == '' ? '未知' : terminal_system_type[data[item]];
                        item = '终端系统';
                        data[item] = reserved;
                    }

                    if (item == 'terminal_name') {
                        var reserved = data[item] == '' ? '未知' : data[item];
                        item = '系统版本号';
                        data[item] = reserved;
                    }

                    if (item == 'terminal_version') {
                        var reserved = data[item] == '' ? '未知' : data[item];
                        item = '系统版本';
                        data[item] = reserved;
                    }

                    if (item == 'machine_type') {
                        var reserved = data[item] == '' ? '未知' : data[item];
                        item = '手机型号';
                        data[item] = reserved;
                    }

                    $notice.append('<div class="item">\
                        <div class="name">' + item + '</div>\
                        <div class="value">' + data[item] + '</div>\
                    </div>');
                }

                $('#trigger-btn').click();
            });
        }

        /** refresh to listen */
        comet._refresh();
    });

    /** start to listen */
    comet.run();
}

mobile.initDialog = function () {
    var dlgtrigger = document.querySelector('[data-dialog]');
    if (dlgtrigger) {
        var somedialog = document.getElementById(dlgtrigger.getAttribute('data-dialog'));
        var dlg = new DialogFx(somedialog);
        dlgtrigger.addEventListener('click', function() {
            dlg.toggle.bind(dlg)();
        });
    }
}
