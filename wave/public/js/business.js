var checkName = function(name) {
    var reg = /^[\u4e00-\u9fa5]{2,10}$/;
    return reg.test(name);
};

var myreg_email = function(email) {
    var reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    return reg.test(email);
};

var checkTel = function(tel) {
    var reg = /^0?1[34578][0-9]\d{8}$/;
    return reg.test(tel);
};

var checkUri = function(str) {
    var RegUrl = new RegExp();
    RegUrl.compile("^[A-Za-z]+://[A-Za-z0-9-_]+\\.[A-Za-z0-9-_%&\?\/.=]+$");

    if (!RegUrl.test(str)) {
        return false;
    }

    return true;
};

var urlencode = function(str) {
    str = str.toString();
    return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').
    replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');
};

function luhmCheck(bankno){
    if (bankno.length < 16 || bankno.length > 19) {
        //$("#banknoInfo").html("银行卡号长度必须在16到19之间");
        return false;
    }
    var num = /^\d*$/;  //全数字
    if (!num.exec(bankno)) {
        return false;
    }
    //开头6位
    var strBin="10,18,30,35,37,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,58,60,62,65,68,69,84,87,88,94,95,98,99";
    if (strBin.indexOf(bankno.substring(0, 2))== -1) {
        //$("#banknoInfo").html("银行卡号开头6位不符合规范");
        return false;
    }
    var lastNum=bankno.substr(bankno.length-1,1);//取出最后一位（与luhm进行比较）

    var first15Num=bankno.substr(0,bankno.length-1);//前15或18位
    var newArr=new Array();
    for(var i=first15Num.length-1;i>-1;i--){    //前15或18位倒序存进数组
        newArr.push(first15Num.substr(i,1));
    }
    var arrJiShu=new Array();  //奇数位*2的积 <9
    var arrJiShu2=new Array(); //奇数位*2的积 >9

    var arrOuShu=new Array();  //偶数位数组
    for(var j=0;j<newArr.length;j++){
        if((j+1)%2==1){//奇数位
            if(parseInt(newArr[j])*2<9)
            arrJiShu.push(parseInt(newArr[j])*2);
            else
            arrJiShu2.push(parseInt(newArr[j])*2);
        }
        else //偶数位
        arrOuShu.push(newArr[j]);
    }

    var jishu_child1=new Array();//奇数位*2 >9 的分割之后的数组个位数
    var jishu_child2=new Array();//奇数位*2 >9 的分割之后的数组十位数
    for(var h=0;h<arrJiShu2.length;h++){
        jishu_child1.push(parseInt(arrJiShu2[h])%10);
        jishu_child2.push(parseInt(arrJiShu2[h])/10);
    }

    var sumJiShu=0; //奇数位*2 < 9 的数组之和
    var sumOuShu=0; //偶数位数组之和
    var sumJiShuChild1=0; //奇数位*2 >9 的分割之后的数组个位数之和
    var sumJiShuChild2=0; //奇数位*2 >9 的分割之后的数组十位数之和
    var sumTotal=0;
    for(var m=0;m<arrJiShu.length;m++){
        sumJiShu=sumJiShu+parseInt(arrJiShu[m]);
    }

    for(var n=0;n<arrOuShu.length;n++){
        sumOuShu=sumOuShu+parseInt(arrOuShu[n]);
    }

    for(var p=0;p<jishu_child1.length;p++){
        sumJiShuChild1=sumJiShuChild1+parseInt(jishu_child1[p]);
        sumJiShuChild2=sumJiShuChild2+parseInt(jishu_child2[p]);
    }
    //计算总和
    sumTotal=parseInt(sumJiShu)+parseInt(sumOuShu)+parseInt(sumJiShuChild1)+parseInt(sumJiShuChild2);

    //计算Luhm值
    var k= parseInt(sumTotal)%10==0?10:parseInt(sumTotal)%10;
    var luhm= 10-k;

    if(lastNum==luhm){
        return true;
    }
    else{
        return false;
    }
}

function IdentityCodeValid(code) {
    var city={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "};
    var tip = "";
    var pass= true;

    if(!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)){
        tip = "身份证号格式错误";
        pass = false;
    }

   else if(!city[code.substr(0,2)]){
        tip = "地址编码错误";
        pass = false;
    }
    else{
        //18位身份证需要验证最后一位校验位
        if(code.length == 18){
            code = code.split('');
            //∑(ai×Wi)(mod 11)
            //加权因子
            var factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
            //校验位
            var parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
            var sum = 0;
            var ai = 0;
            var wi = 0;
            for (var i = 0; i < 17; i++)
            {
                ai = code[i];
                wi = factor[i];
                sum += ai * wi;
            }
            var last = parity[sum % 11];
            if(parity[sum % 11] != code[17]){
                tip = "校验位错误";
                pass =false;
            }
        }
    }
    return pass;
}

function trimStr(str){
    return str.replace(/(^\s*)|(\s*$)/g,"");
}

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





var business = {};
business.init = function() {
    BASEURL = BASEURL || "";
    var service_provider = {
        "1": "other",
        "2": "China Unicom",
        "3": "China Mobile",
        "4": "China Telecom"
    };
    var network_type = {
        "1": "other",
        "2": "2G",
        "3": "3G",
        "4": "4G",
        "5": "wifi"
    };
    var user_type = {
        "1": "other",
        "2": "business",
        "3": "App Developer"
    };
    var terminal_type = {
        "1": "other",
        "2": "IOS",
        "3": "Android"
    }; // console.log(service_provider);

    $(document).on("keydown", function(event) {
        var userAgent = navigator.userAgent.toLowerCase();
        var keycode;

        if (userAgent.indexOf('firefox') >= 0 || userAgent.indexOf('ie') >= 0) {
            keycode = event.which;
        } else {
            var ev = (event === undefined) ? window.event : event;
            keycode = ev.keyCode;
        }

        if (keycode === 13 && document.activeElement.id === "search-messages") {
            window.location.href = BASEURL + 'admin/messageList?sort=' + $('.message_list_total_module .message_list_by_classify .button_backgro').attr('type') +  '&kw=' + urlencode($('#search-messages').val());
        }
    });

    /*Setting the front-family of "冬青黑体简体中文"*/
    // $youzikuapi.asyncLoad("http://api.youziku.com/webfont/FastJS/yzk_2FD52A6452820DD6", function () {
    //     $youziku.load(".supporter_navigation", "74516d893acb422cb21e8868366d491b", "SansGBW3");
    //     $youziku.load(".container", "74516d893acb422cb21e8868366d491b", "SansGBW3");
    //     $youziku.draw();
    // });
}
business.initHeader = function() {
    var isOverMessageSection = false;
    var isOverIndividualSection = false;
    var isOverUserPhone = false;

    $('ul.nav_container .messages_section').hover(function() {
        /* Stuff to do when the mouse enters the element */
        isOverMessageSection = true;
        $('#nav_ads_menu').show();
    }, function() {
        /* Stuff to do when the mouse leaves the element */
        isOverMessageSection = false;
        setTimeout(function() {
            if (!isOverMessageSection) {
                $('#nav_ads_menu').hide();
            }
        }, 200);
    });
    //判断操作系统
    // 获取终端的相关信息
    var Terminal = {
        // 辨别移动终端类型
        platform : function(){
            var u = navigator.userAgent, app = navigator.appVersion;
            return {
                // 是否为windows
                windows: u.indexOf('Windows NT') > -1 ,
                // 是否为mac
                mac: u.indexOf('Mac')
            };
        }(),
        // 辨别移动终端的语言：zh-cn、en-us、ko-kr、ja-jp...
        language : (navigator.browserLanguage || navigator.language).toLowerCase()
    }
    if(Terminal.platform.windows){
        $('html').addClass('windows').removeClass('mac');
    }else if(Terminal.platform.mac){
        $('html').addClass('mac').removeClass('windows');
    }else{
        $('html').removeClass('windows').removeClass('mac');
    }
    // 导航菜单
    var now_url = window.location.href;
    if (now_url.indexOf("supporter") > 0) {
        $(".nav_container li#index>a").addClass("current");
    }
    else if (now_url.indexOf("messageList") > 0 || now_url.indexOf("messageInfo") > 0) {
        $(".nav_container li#app>a").addClass("current");
    }
    else if (now_url.indexOf("financeCenter") > 0) {
        $(".nav_container li#finance>a").addClass("current");
    }
    else if (now_url.indexOf("individual") > 0) {
        $(".nav_container li#individual>a").addClass("current");
    }
    else if (now_url.indexOf("download") > 0) {
        $(".nav_container li#download>a").addClass("current");
    }
    else if (now_url.indexOf("help") > 0) {
        $(".nav_container li#helpcenter>a").addClass("current");
    }

    $('#nav_ads_menu').hover(function() {
        /* Stuff to do when the mouse enters the element */
        isOverMessageSection = true;
        $('#nav_ads_menu').show();
    }, function() {
        /* Stuff to do when the mouse leaves the element */
        isOverMessageSection = false;
        $('#nav_ads_menu').hide();
    });

    $('.nav_addmessage').hover(function() {
        $('.nav_addmessage').attr('src', "./../images/addapphover.png");
        $('#nav_add_tip').show();
    }, function() {
        $('.nav_addmessage').attr('src', "./../images/addapp.png");
        $('#nav_add_tip').hide();
    });

    // $(".message_center .user_notify").hover(function() {
    //     $('.user_notify').attr('src', "./../images/newshover.png");
    //     $(".message_center_show").fadeIn();
    // }, function() {
    //     $('.user_notify').attr('src', "./../images/news.png");
    //     $(".message_center_show").fadeOut();
    // });
    $(".message_center").mouseover(function() {
        //$('.user_notify').attr('src', "./../images/newshover.png");
        $(".message_center_show").show();
    }).mouseout(function() {
        $(".message_center_show").hide();
    });
    // $(".message_center_show").hover(function() {
    //     $('.user_notify').attr('src', "./../images/newshover.png");
    //     $(".message_center_show").fadeIn();
    // }, function() {
    //     $('.user_notify').attr('src', "./../images/news.png");
    //     $(".message_center_show").fadeOut();
    // });

    $('ul.nav_container .individual_section').hover(function() {
        /* Stuff to do when the mouse enters the element */
        isOverIndividualSection = true;
        $('#nav_finance_menu').show();
    }, function() {
        /* Stuff to do when the mouse leaves the element */
        isOverIndividualSection = false;
        setTimeout(function() {
            if (!isOverIndividualSection) {
                $('#nav_finance_menu').hide();
            }
        }, 200);
    });
    $('#nav_finance_menu').hover(function() {
        /* Stuff to do when the mouse enters the element */
        isOverIndividualSection = true;
        $('#nav_finance_menu').show();
    }, function() {
        /* Stuff to do when the mouse leaves the element */
        isOverIndividualSection = false;
        $('#nav_finance_menu').hide();
    });

    $('#nav_user_quit').on('click', '.user_quit', function(event) {
        event.preventDefault();
        window.location.href = BASEURL + 'admin/api/logout';
    });

    $('.nav_userId').hover(function() {
        isOverUserPhone = true;
        $('#nav_user_quit').show();
    }, function() {
        isOverUserPhone = false;
        setTimeout(function() {
            if (!isOverUserPhone) {
                $('#nav_user_quit').hide();
            }
        }, 200);
    });

    // $(".message_center .user_notify").hover(function() {
    //     $(".message_center_show").fadeIn();
    // }, function() {
    //     $(".message_center_show").fadeOut();
    // });

    // $(".message_center_show").hover(function() {
    //     $(".message_center_show").fadeIn();
    // }, function() {
    //     $(".message_center_show").fadeOut();
    // });



    $('.user_phone').click(function(event) {
        isOverUserPhone = true;
        $('#nav_user_quit').show();
    });

    /**
     * Application Center
     */
    $('.supporter_nav_menu .message-add').click(function(event) {
        /* Act on the event */
        $('.nav_addmessage').attr('handleType', 'addMessage').click();
    });

    $('.supporter_nav_menu .message-modify').click(function(event) {
        /* Act on the event */
        $('.nav_addmessage').attr('handleType', 'editMessage').click().attr('handleType', 'addMessage');
    });

    function showHover(temp) {
        $('.supporter_nav_menu .' + temp + '').hover(function() {
            /* Stuff t'o do when the mouse enters the element */
            $('.menu_arrow em').css({
                'border-bottom': '5px solid #679aff'
            });
        }, function() {
            /* Stuff to do when the mouse leaves the element */
            $('.menu_arrow em').css({
                'border-bottom': '5px solid #fff'
            });
        });
    }

    // showHover('message-add');
    // showHover('individual_baseset');
    // showHover('user_quit');
    /**
     * Individual Center
     */
    $('.supporter_nav_menu .individual_baseset').click(function(event) {
        /* Act on the event */
        window.location.href = BASEURL + 'admin/individual';
    });

    $('.supporter_nav_menu .individual_financeset').click(function(event) {
        /* Act on the event */
        window.location.href = BASEURL + 'admin/individual?go=financeSet';
    });

    $('.supporter_nav_menu .individual_securityset').click(function(event) {
        /* Act on the event */
        window.location.href = BASEURL + 'admin/individual?go=securitySet';
    });

    /**
     * Initiate the app adding page
     */
    business.initAddMessage();
};

business.initBusinesser = function() {
    this.leftMenu();//左侧菜单方法
    getChipInfo();
    $("#all-data").on("click", function() {
        $("#chip_no_form").submit();
    });

    function getChipInfo() {
        $.ajax({
            url: BASEURL + 'admin/api/getChipTagByUser',
            type: 'POST',
            dataType: 'json'
        })
        .done(function(data) {console.log(data);
            var html = "";
            var result = data.result;
            for(var i = 0, len = result.length; i < len; i++) {
                var chipInfo = result[i];
                html += "<li id='cid-"+ chipInfo.id +"' data-chipno='" + chipInfo.chip_no + "'>" + chipInfo.chip_name + "</li>";
            }
            $(".list-children").html(html);
            $(".list-header").on("click", function() {
                $(".select_msg .currentMsg_name").hide();
                $(".release_advertise").hide();
                $("#caiwu_balance").show();
                //get right data
                //getAllMessage
                DateCharts(2);
                getClickCount();
            });
            $(".list-children>li").on("click", function() {
                $(".select_msg .currentMsg_name").show();
                $(".release_advertise").show();
                $("#caiwu_balance").hide();
                //get right data
                //$("#all-data").attr("href", "chipPortraits?chip_no="+$(this).data("chipno"));
                //getAllMessage
                getMessageByChipID($(this).attr("id").replace("cid-",""));
                getClickCount($(this).attr("data-chipno"));
            });

            var chipNo = $(".business_content>input").val();
            if(chipNo == ""){
                $(".list-header")[0].click();
            } else {
                $(".list-children>li[data-chipno="+chipNo+"]")[0].click();
            }
            business.chipSearch();
        })
        .fail(function() {
            console.log("error");
        });
    }

    var isOverAppSeletion = false;

    $('.content_report .release_advertise').on('click', function(event) {
        event.preventDefault();
        /* Act on the event */
        window.location.href = BASEURL + 'admin/addAd';
    });



    $('.select_date').on('click', '.rage_button', function(event) {
        $(this).siblings('.rage_button').removeClass('rage_button_active');
        $(this).addClass('rage_button_active');
    });
    $('.nav_help').click(function(event) {
        window.location.href = BASEURL + "admin/help";
    });
    $('.basedata_yesterday').click(function(event) {
        var currentMsg_id = $('.currentMsg_name').attr('data-msgID');
        dateStatistic(currentMsg_id);
    });
    $('.basedata_week').click(function(event) {
        var date = new Date();
        var currentDate = date.format('yyyy-MM-dd');
        var weekago = new Date(date.getTime() - 7 * 24 * 3600 * 1000).format('yyyy-MM-dd');
        var currentMsg_id = $('.currentMsg_name').attr('data-msgID');
        dateStatistic(currentMsg_id, weekago, currentDate);
    });
    $('.basedata_month').click(function(event) {
        var date = new Date();
        var currentDate = date.format('yyyy-MM-dd');
        var monthago = new Date(date.getTime() - 30 * 24 * 3600 * 1000).format('yyyy-MM-dd');
        var currentMsg_id = $('.currentMsg_name').attr('data-msgID');
        dateStatistic(currentMsg_id, monthago, currentDate);
    });

    $('.profile_yesterday').click(function(event) {
        var currentMsg_id = $('.currentMsg_name').attr('data-msgID');
        DateCharts(2, currentMsg_id);
    });
    $('.profile_week').click(function(event) {
        var date = new Date();
        var currentDate = date.format('yyyy-MM-dd');
        var weekago = new Date(date.getTime() - 7 * 24 * 3600 * 1000).format('yyyy-MM-dd');
        var currentMsg_id = $('.currentMsg_name').attr('data-msgID');
        DateCharts(2, currentMsg_id, weekago, currentDate);
    });
    $('.profile_month').click(function(event) {
        var date = new Date();
        var currentDate = date.format('yyyy-MM-dd');
        var monthago = new Date(date.getTime() - 30 * 24 * 3600 * 1000).format('yyyy-MM-dd');
        var currentMsg_id = $('.currentMsg_name').attr('data-msgID');
        DateCharts(2, currentMsg_id, monthago, currentDate);
    });
    
    $('.date_rage').on('click', '.submitTime', function(event) {
        event.preventDefault();
        var startdate = $(this).parent().find("#timeStart").val();
        console.log(startdate);
        var enddate = $(this).parent().find("#timeEnd").val();
        var currentMsg_id = $('.currentMsg_name').attr('data-msgID');
        DateCharts(2, currentMsg_id, startdate, enddate);
    });
    $('#finance_phoneCheck').click(function(event) {
        if (_loading == 0) {
            if ($('.finance_phone').val() == '' || !checkTel($('.finance_phone').val())) {
                alert("预留手机为必填选项,请输入正确的手机号码！");
                return;
            } else {
                $('#finance_phoneCheck').html('60秒');
                $(this).addClass('finance_phoneCheck_active');
                var second = 60;
                setInterval(function() {
                    if (second == 0) {
                        $('#finance_phoneCheck').removeClass('finance_phoneCheck_active').text('获取验证码');
                        return;
                    }

                    second = second - 1;
                    $('#finance_phoneCheck').text(second + '秒');
                }, 1000);
                _loading = 1;
            }
        } else {
            return;
        }
    });
    //废弃 由getMessageByChipID()替代 wz 2016-05-23
    function list_allmessageName() {
        $('.supporter_list_menu').find('a').remove();
        $.ajax({
                url: BASEURL + 'admin/api/showMessageList',
                type: 'GET',
                dataType: 'json'
            })
            .done(function(data) {
                if (data.success) {
                    var Result = data.result;
                    for (var i = 0; i < Result.length; i++) {
                        $('.supporter_list_menu').append('<a data-msgID="' + Result[i].id + '">' + Result[i].shop_name + '</a>');
                    }
                }
                $('.currentMsg_name').html($('.supporter_list_menu a:first').html());
                var initmsgID  = $('.supporter_list_menu a:first').attr('data-msgID');
                $('.currentMsg_name').attr('data-msgID', initmsgID);
                dateStatistic(initmsgID);
                DateCharts(2, initmsgID);
                // $('.supporter_list_menu').find('a').eq(0).hover(function() {
                //     /* Stuff to do when the mouse enters the element */
                //     $('.list_menu_arrow em').css({
                //         'border-bottom': '5px solid #679aff'
                //     });
                // }, function() {
                //     /* Stuff to do when the mouse exits the element */
                //     $('.list_menu_arrow em').css({
                //         'border-bottom': '5px solid #fff'
                //     });
                // });
            })
            .fail(function() {
                console.log("error");
            });
    }

    function dateStatistic(id, startdate, enddate) {
        var id;
        var startdate, enddate;
        if (id == null) {
            return false;
        };
        $.ajax({
                url: BASEURL + 'admin/api/showMessageInfo',
                type: 'POST',
                dataType: 'json',
                data: {
                    mid: id,
                    startdate: startdate,
                    enddate: enddate
                },
            })
            .done(function(data) {
                // console.log(data);
                var rate = data.result.conversion_rate * 100;
                $('#acceptnum_act').html(data.result.receive_num+ '人');
                $('#clicknum_act').html(data.result.view_num + '人');
                $('#ratenum_act').html(0 + '人');
                $('#turnratebar_act').css('width', '1%');
                if (data.result.receive_num != 0) {
                    $('#acceptbar_act').css('width', '70%');
                }
                else{
                    $('#acceptbar_act').css('width', '1%');
                }
                moveBar(Math.round(rate));
            })
            .fail(function() {
                console.log("error");
            })
        function moveBar(percent) {
            var clickbar = $('#clickbar_act');
            if (percent == 0) {
                clickbar.css('width', '' + 1 + '%');
            }else{
                clickbar.css('width', '' + percent + '%');
            }
        }
    }

    function financeReport(){
        $.ajax({
            url: BASEURL + 'admin/api/totalOutcome',
            type: 'GET',
            dataType: 'json',
        })
        .done(function(data) {
            console.log(data);
            $('.finance_today .finance_amount').html('￥'+data.yesterdaySalary);
            $('.finance_total .finance_amount').html('￥'+data.yesterdaySalary);
        })
        .fail(function() {
            console.log("error");
        })
    }

    function getMessageByChipID(chip_id) {
        $.ajax({
            url: BASEURL + 'admin/api/getMessageByChipID',
            type: 'POST',
            data: {
                chip_id: chip_id
            },
            dataType: 'json',
        })
        .done(function(data) {
            //console.log(data);
            if(data.success) {
                var messages = data.messages;
                var html = "";
                for (var i = 0, len = messages.length; i < len; i++) {
                    html += "<a data-msgID='"+messages[i].id+"'>"+messages[i].title+"</a>";
                }
                $(".supporter_list_menu").html(html);
                $('.currentMsg_name').html("按广告");
                var initmsgID = $('.supporter_list_menu>a').eq(0).attr('data-msgID');
                $('.currentMsg_name').attr('data-msgID', initmsgID);
                dateStatistic(initmsgID);
                DateCharts(2, initmsgID);
            } else {
                $(".supporter_list_menu").html("");
                $('.currentMsg_name').html("暂无数据");
                DateCharts(2);
            }
        })
        .fail(function() {
            console.log("error");
        })
    }

    function getClickCount(chip_no) {
        $.ajax({
            url: BASEURL + 'admin/api/TotalMessagesExposureAndClickNum',
            type: 'POST',
            data: {
                chip_no: chip_no
            },
            dataType: 'json',
        })
        .done(function(data) {
            if(data.success) {
                $("#acceptnum_act").html(data.exposureRate+"人");
                $("#clicknum_act").html(data.clickRate+"人");
                if(data.exposureRate == 0) {
                    $("#acceptbar_act").css("width","1%");
                } else {
                    $("#acceptbar_act").css("width","100%");
                }

                var percent = data.exposureRate == 0 ? 0 : Math.round(data.clickRate / data.exposureRate * 100);
                if (percent == 0) {
                    $("#clickbar_act").css('width', '1%');
                } else if (percent > 100){
                    $("#clickbar_act").css('width', '100%');
                } else {
                    $("#clickbar_act").css('width', percent + '%');
                }
            } else {
                $("#acceptnum_act").html("0人");
                $("#clicknum_act").html("0人");
                $("#acceptbar_act").css('width', '1%');
                $("#clickbar_act").css('width', '1%');
            }
        })
        .fail(function() {
            console.log("error");
        })
    }

/*    function getAllChart() {}
    function getChatByChipId() {}*/

    function renderListMenu() {
        $('.currentMsg_name').click(function(event) {
            $('#msg_listMenu').show();
        });
        $('.select_msg').hover(function() {
            isOverAppSeletion = true;
            $('#msg_listMenu').show();
        }, function() {
            isOverAppSeletion = false;
            setTimeout(function() {
                if (!isOverAppSeletion) {
                    $('#msg_listMenu').hide();
                }
            }, 500)
        });
        $('#msg_listMenu').on('click', '.supporter_list_menu>a', function(event) {
            $('.currentMsg_name').html($(this).html());
            $('#msg_listMenu').hide();
            var this_option = $(this).attr('data-msgID');
            $('.currentMsg_name').attr('data-msgID', this_option);
            $('.rage_button').removeClass('rage_button_active');
            //$('.profile_yesterday').addClass('rage_button_active');
            //$('.basedata_yesterday').addClass('rage_button_active');
        });
    }
    renderListMenu();


    //list_allmessageName();
    setBetweenTime();
    // financeReport();
}



business.initIndividual = function() {
    var _loading = 0;
    var bank_type_id;

    /** initiate the first page */
    $('.individual_input').hide();
    $($('.individual_li_active').attr('href')).fadeIn();

    //个人中心_INDIVIDUAL
    $('ul.individual_titleTab li a').click(function(event) {
        $('.individual_tab').removeClass('individual_li_active');
        $(this).addClass('individual_li_active');
        $('.individual_input').hide();
        var activeTab = $(this).attr("href");
        $(activeTab).fadeIn();
        $("#bank_card").focus();
        return false;
    });

    // 修改手机号
    // 打开窗口
    $('#mb_dialog').on('click', function(event) {
        $(".withdraw_shadow").fadeIn('fast');
        $(".modify_phone_box").fadeIn('fast');
        $("#mobilephone").focus();
    });
    // 点击关闭按钮关闭窗口
    $(".modify_phone_box .close_btn").on('click',  function(event) {
        $(this).parent().fadeOut();
        $(".withdraw_shadow").fadeOut('fast');
    });
    // 点击遮罩关闭窗口
    $("#modify_phone_module .withdraw_shadow").on('click',  function(event) {
        $(".modify_phone_box").fadeOut();
        $(".withdraw_shadow").fadeOut('fast');
    });
    //发送验证码
    $("#get_modifycode").on("click", function() {
        if (!checkTel($("#mobilephone").val())) {
            $(".modify_phone_box .error").html('请输入正确的手机号').css('opacity', 1);
            $("#mobilephone").focus();
            return;
        }

        $(this).attr("disabled", "disabled").html("发送中");

        var _this = this;
        $.ajax({
            url: BASEURL + 'admin/api/verifyMessage',
            type: "POST",
            dataType: 'json',
            data: {
                phone: $("#mobilephone").val()
            }
        }).done(function(data) {
            // console.log(data);
            if (data.status === 0) {
                $(_this).html("已发送");
                $("#mobile_code").focus();
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
                },500);
                $(_this).css({
                    "background-color": "#6799ff",
                    color: "#fff",
                    'cursor': 'default'
                });
            } else {
                $(".modify_phone_box .error").html(data.errMsg).css('opacity', 1);
            }
        }).fail(function() {
            $(".modify_phone_box .error").html("服务器错误").css('opacity', 1);
        });
    });
    // 提交修改
    $(".modify_phone_box .submit_phone").on('click', function(event) {
        event.preventDefault();
        if (!checkTel($("#mobilephone").val())) {
            $(".modify_phone_box .error").html('请输入正确的手机号').css('opacity', 1);
            $("#mobilephone").focus();
            return;
        }
        if($("#mobile_code").val() == ""){
            $(".modify_phone_box .error").html('请输入验证码').css('opacity', 1);
            $("#mobile_code").focus();
            return;
        }
        $(".modify_phone_box .error").css('opacity', 0);
        $(this).html("提交中");
        $.ajax({
                url: BASEURL + 'admin/api/modifyPhone',
                type: 'POST',
                dataType: 'json',
                data: {
                    phone: $("#mobilephone").val(),
                    code: $("#mobile_code").val()
                }
            }).done(function(data) {
                //console.log(data);
                if(data.status == -1){
                    $(".modify_phone_box .error").html("未生成验证码").css('opacity', 1);
                    return false;
                } else if(data.status == -2){
                    $(".modify_phone_box .error").html("验证码失效").css('opacity', 1);
                    return false;
                } else if(data.status == -3){
                    $(".modify_phone_box .error").html("验证码错误").css('opacity', 1);
                    return false;
                } else if(data.status == 0){
                    $(".modify_phone_box .error").html("验证成功").css('opacity', 1);
                    return false;
                }
                $(".modify_phone_box").fadeOut();
                $(".withdraw_shadow").fadeOut('fast');
            }).fail(function() {
                $(".modify_phone_box .error").html("服务器错误").css('opacity', 1);
                $('.modify_phone_box .submit_phone').html("确定");
            });
    });
    /**
     * initiate types of id_card_type and bank_card_type
     */
    $('.input_finance_info  .id_card_type').find('input').each(function(index, el) {
        if ($(this).val() === id_card_type_id) {
            $(this).attr('checked', 'checked');
            $(this).parent().addClass('on_radio');
        }
    });

    // $('.input_finance_info  .bank_card_type').find('input').each(function(index, el) {
    //     if ($(this).val() === bank_card_type_id) {
    //         $(this).attr('checked', 'checked');
    //         $(this).parent().addClass('on_radio');
    //     }
    // });

    $('.id_card_type .radioClass').click(function(event) {
        $(this).parent().parent().children('.radio_style').removeClass('on_radio');
        $(this).parent().addClass('on_radio');
    });

    /*forget password*/
    $('#input_security_info').on('click', '.forget_password', function(event) {
        window.location.href = BASEURL + 'findback';
    });

    //修改密码
    $("#input_security_info .submit_button").on('click', function(event) {
        event.preventDefault();
        if (!$("#change_old_password").val()) {
            alert("请输入旧密码!");
            return;
        }

        if (!$("#change_new_password").val()) {
            alert("请输入新密码!");
            return;
        }

        if ($("#change_new_password").val().length < 8) {
            alert("密码长度必须大于或等于八位");
            return;
        }

        if (!$("#enter_new_password").val()) {
            alert("请确认新密码!");
            return;
        }

        if ($("#change_new_password").val() != $("#enter_new_password").val()) {
            alert("新密码两次输入不相等,请重新输入");
            return;
        }

        $.ajax({
                url: BASEURL + 'admin/api/updatePasswd',
                type: 'POST',
                dataType: 'json',
                data: {
                    oldPw: $("#change_old_password").val(),
                    newPw: $("#change_new_password").val(),
                },
            })
            .done(function(data) {
                if (data.success) {
                    alert("更新成功");
                    $('.Tolist_all').click();
                    window.location = BASEURL + 'admin/individual';
                } else {
                    alert('请输入正确的旧密码');
                }
            })
            .fail(function() {
                console.log("error");
            })
    });

    //保存用户基本信息
    $("#input_basic_info .submit_button").on('click', function(event) {
        event.preventDefault();
        if ($("#basic_info_email").val() == '' || !myreg_email($("#basic_info_email").val())) {
            alert("邮箱为必填选项,请输入正确的邮箱");
            return;
        }
        $.ajax({
                url: BASEURL + 'admin/api/setInfo',
                type: 'POST',
                dataType: 'json',
                data: {
                    email: $("#basic_info_email").val(),
                    addr: $("#basic_info_addr").val(),
                    weibo: $("#basic_info_weibo").val(),
                    qq: $("#basic_info_qq").val(),
                    nickname: $('#basic_info_nickname').val()
                },
            })
            .done(function(data) {
                if (data.success) {
                    alert("保存成功!");
                    $('.Tolist_all').click();
                    window.location = BASEURL + 'admin/individual';
                } else {
                    alert("保存失败,请重新保存!");
                }
            })
            .fail(function() {
                console.log("error");
            })
    });

    var bank_card_type_from_data = $("#input_finance_info .bank_card_type").attr('bank-card-type');
    if( bank_card_type_from_data != ''){
        $(".input_finance_info .bank_card_type input[value='"+bank_card_type_from_data+"']").parent().addClass('on_radio').siblings().removeClass('on_radio');
    }

    $('#finance_phoneCheck').click(function(event) {
        if (_loading == 0) {
            if ($('.finance_phone').val() == '' || !checkTel($('.finance_phone').val())) {
                // alert("预留手机为必填选项,请输入正确的手机号码！");
                $(".finance_phone_warn .warning").show();
                return;
            } else {
                $('#finance_phoneCheck').html('60秒');
                $(this).addClass('finance_phoneCheck_active');
                var second = 60;
                setInterval(function() {
                    if (second == 0) {
                        $('#finance_phoneCheck').removeClass('finance_phoneCheck_active').text('获取验证码');
                        return;
                    }
                    second = second - 1;
                    $('#finance_phoneCheck').text(second + '秒');
                }, 1000);
                _loading = 1;
                $(".finance_phone_warn .warning").hide();
            }

            $.ajax({
                url: BASEURL + 'admin/api/verifyMessage',
                type: 'POST',
                dataType: 'json',
                data: {
                    phone: $('.finance_phone').val()
                },
            })
            .done(function(data) {
                //console.log(data);
            })
            .fail(function() {
                console.log("error");
            })
        } else {
            return;
        }
    });

    $("#input_finance_info #bank_card").keyup(function(ev) {
        $("#input_finance_info #changing_bank_card").text($("#bank_card").val());
        if($("#bank_card").val() != ''){
            $("#input_finance_info #changing_bank_card").show();
        }else{
            $("#input_finance_info #changing_bank_card").hide();
        }
        // var oW = $("#input_finance_info #changing_bank_card").text();
        // var oEvent = ev || event;
        // if(oEvent.keycode == 8){
        //     if(oW){
        //         for (var i = 0; i < oW.length; i++) {
        //             var newStr = oW.replace(/\s$/g,'');
        //         }
        //         $("#input_finance_info #changing_bank_card").text(newStr);
        //     }
        // }else{
        //     var arr;
        //     for (var i = 0; i < oW.length; i++) {
        //         arr = oW.split('');
        //         if((i+1)%5 == 0){
        //             arr.splice(i,0,'');
        //         }
        //     }
        //     $("#input_finance_info #changing_bank_card").text(arr.join(''));
        // }
    });

    bank_type_id = $("#bank_card_create_addr").attr("bank-type-id");
    $("#bank_card").blur(function(event) {
        if(!$("#bank_card").val() || $("#bank_card").val() == '' || !luhmCheck($("#bank_card").val())){
            // alert("银行卡号为必填选项,请输入您的真实银行卡号!");
            $(".bank_card_warn .warning").show();
            $("#bank_card").focus();
            return;
        }
        $("#input_finance_info #changing_bank_card").hide();

        var bank_card = $("#bank_card").val();
        var bankList = [
            '',
            '',
            '中国银行',
            '中国农业银行',
            '中国工商银行',
            '中国建设银行',
            '招商银行',
            '汇丰银行',
            '中国人民银行',
            '兴业银行',
            '北京银行',
            '交通银行',
            '中国光大银行',
            '中信银行',
            '广东发展银行',
            '上海浦东发展银行',
            '深圳发展银行',
            '国家开发银行',
            '华夏银行',
            '平安银行',
            '中国民生银行',
            '杭州银行',
            '上海银行',
            '宁波银行',
            '中国邮政储蓄银行',
            '银行'
        ];
        var bankCardType = {
            "621098": 2,
            "622150": 2,
            "622151": 2,
            "622181": 2,
            "622188": 2,
            "955100": 2,
            "621095": 2,
            "620062": 2,
            "621285": 2,
            "621798": 2,
            "621799": 2,
            "621797": 2,
            "620529": 3,
            "622199": 2,
            "621096": 2,
            "62215049": 2,
            "62215050": 2,
            "62215051": 2,
            "62218850": 2,
            "62218851": 2,
            "62218849": 2,
            "621622": 2,
            "623219": 2,
            "621674": 2,
            "623218": 2,
            "621599": 2,
            "370246": 3,
            "370248": 3,
            "370249": 3,
            "427010": 3,
            "427018": 3,
            "427019": 3,
            "427020": 3,
            "427029": 3,
            "427030": 3,
            "427039": 3,
            "370247": 3,
            "438125": 3,
            "438126": 3,
            "451804": 3,
            "451810": 3,
            "451811": 3,
            "45806": 3,
            "458071": 3,
            "489734": 3,
            "489735": 3,
            "489736": 3,
            "510529": 2,
            "427062": 3,
            "524091": 3,
            "427064": 3,
            "530970": 3,
            "53098": 3,
            "530990": 3,
            "558360": 3,
            "620200": 2,
            "620302": 2,
            "620402": 2,
            "620403": 2,
            "620404": 2,
            "524047": 3,
            "620406": 2,
            "620407": 2,
            "525498": 3,
            "620409": 2,
            "620410": 2,
            "620411": 2,
            "620412": 2,
            "620502": 2,
            "620503": 2,
            "620405": 2,
            "620408": 2,
            "620512": 2,
            "620602": 2,
            "620604": 2,
            "620607": 2,
            "620611": 2,
            "620612": 2,
            "620704": 2,
            "620706": 2,
            "620707": 2,
            "620708": 2,
            "620709": 2,
            "620710": 2,
            "620609": 2,
            "620712": 2,
            "620713": 2,
            "620714": 2,
            "620802": 2,
            "620711": 2,
            "620904": 2,
            "620905": 2,
            "621001": 2,
            "620902": 2,
            "621103": 2,
            "621105": 2,
            "621106": 2,
            "621107": 2,
            "621102": 2,
            "621203": 2,
            "621204": 2,
            "621205": 2,
            "621206": 2,
            "621207": 2,
            "621208": 2,
            "621209": 2,
            "621210": 2,
            "621302": 2,
            "621303": 2,
            "621202": 2,
            "621305": 2,
            "621306": 2,
            "621307": 2,
            "621309": 2,
            "621311": 2,
            "621313": 2,
            "621211": 2,
            "621315": 2,
            "621304": 2,
            "621402": 2,
            "621404": 2,
            "621405": 2,
            "621406": 2,
            "621407": 2,
            "621408": 2,
            "621409": 2,
            "621410": 2,
            "621502": 2,
            "621317": 2,
            "621511": 2,
            "621602": 2,
            "621603": 2,
            "621604": 2,
            "621605": 2,
            "621608": 2,
            "621609": 2,
            "621610": 2,
            "621611": 2,
            "621612": 2,
            "621613": 2,
            "621614": 2,
            "621615": 2,
            "621616": 2,
            "621617": 2,
            "621607": 2,
            "621606": 2,
            "621804": 2,
            "621807": 2,
            "621813": 2,
            "621814": 2,
            "621817": 2,
            "621901": 2,
            "621904": 2,
            "621905": 2,
            "621906": 2,
            "621907": 2,
            "621908": 2,
            "621909": 2,
            "621910": 2,
            "621911": 2,
            "621912": 2,
            "621913": 2,
            "621915": 2,
            "622002": 2,
            "621903": 2,
            "622004": 2,
            "622005": 2,
            "622006": 2,
            "622007": 2,
            "622008": 2,
            "622010": 2,
            "622011": 2,
            "622012": 2,
            "621914": 2,
            "622015": 2,
            "622016": 2,
            "622003": 2,
            "622018": 2,
            "622019": 2,
            "622020": 2,
            "622102": 2,
            "622103": 2,
            "622104": 2,
            "622105": 2,
            "622013": 2,
            "622111": 2,
            "622114": 2,
            "622200": 2,
            "622017": 2,
            "622202": 2,
            "622203": 2,
            "622208": 2,
            "622210": 3,
            "622211": 3,
            "622212": 3,
            "622213": 3,
            "622214": 3,
            "622110": 2,
            "622220": 3,
            "622223": 3,
            "622225": 3,
            "622229": 3,
            "622230": 3,
            "622231": 3,
            "622232": 3,
            "622233": 3,
            "622234": 3,
            "622235": 3,
            "622237": 3,
            "622215": 3,
            "622239": 3,
            "622240": 3,
            "622245": 3,
            "622224": 3,
            "622303": 2,
            "622304": 2,
            "622305": 2,
            "622306": 2,
            "622307": 2,
            "622308": 2,
            "622309": 2,
            "622238": 3,
            "622314": 2,
            "622315": 2,
            "622317": 2,
            "622302": 2,
            "622402": 2,
            "622403": 2,
            "622404": 2,
            "622313": 2,
            "622504": 2,
            "622505": 2,
            "622509": 2,
            "622513": 2,
            "622517": 2,
            "622502": 2,
            "622604": 2,
            "622605": 2,
            "622606": 2,
            "622510": 2,
            "622703": 2,
            "622715": 2,
            "622806": 2,
            "622902": 2,
            "622903": 2,
            "622706": 2,
            "623002": 2,
            "623006": 2,
            "623008": 2,
            "623011": 2,
            "623012": 2,
            "622904": 2,
            "623015": 2,
            "623100": 2,
            "623202": 2,
            "623301": 2,
            "623400": 2,
            "623500": 2,
            "623602": 2,
            "623803": 2,
            "623901": 2,
            "623014": 2,
            "624100": 2,
            "624200": 2,
            "624301": 2,
            "624402": 2,
            "62451804": 3,
            "62451810": 3,
            "62451811": 3,
            "6245806": 3,
            "62458071": 3,
            "6253098": 3,
            "623700": 2,
            "628288": 3,
            "624000": 2,
            "9558": 2,
            "628286": 3,
            "622206": 3,
            "621225": 2,
            "526836": 3,
            "513685": 3,
            "543098": 3,
            "458441": 3,
            "620058": 2,
            "621281": 2,
            "622246": 3,
            "900000": 2,
            "544210": 3,
            "548943": 3,
            "370267": 3,
            "621558": 2,
            "621559": 2,
            "621722": 2,
            "621723": 2,
            "620086": 2,
            "621226": 2,
            "402791": 2,
            "427028": 2,
            "427038": 2,
            "548259": 2,
            "356879": 3,
            "356880": 3,
            "356881": 3,
            "356882": 3,
            "528856": 3,
            "621618": 2,
            "620516": 2,
            "621227": 2,
            "621721": 2,
            "900010": 2,
            "625330": 3,
            "625331": 3,
            "625332": 3,
            "623062": 2,
            "622236": 3,
            "621670": 2,
            "524374": 3,
            "550213": 3,
            "374738": 3,
            "374739": 3,
            "621288": 2,
            "625708": 3,
            "625709": 3,
            "622597": 3,
            "622599": 3,
            "360883": 3,
            "360884": 3,
            "625865": 3,
            "625866": 3,
            "625899": 3,
            "625929": 3,
            "621376": 2,
            "620054": 3,
            "620142": 3,
            "621423": 2,
            "625927": 3,
            "621428": 2,
            "625939": 3,
            "621434": 2,
            "625987": 3,
            "621761": 2,
            "621749": 2,
            "620184": 3,
            "625930": 3,
            "621300": 2,
            "621378": 2,
            "625114": 3,
            "622159": 3,
            "621720": 2,
            "625021": 3,
            "625022": 3,
            "625932": 3,
            "621379": 2,
            "620114": 3,
            "620146": 3,
            "622889": 3,
            "625900": 3,
            "622949": 2,
            "625915": 3,
            "625916": 3,
            "620030": 3,
            "620050": 3,
            "622944": 2,
            "625115": 3,
            "620101": 3,
            "623335": 3,
            "622171": 3,
            "621240": 2,
            "621724": 2,
            "625931": 3,
            "621762": 2,
            "625918": 3,
            "625113": 3,
            "621371": 2,
            "620143": 3,
            "620149": 3,
            "621730": 2,
            "625928": 3,
            "621414": 2,
            "625914": 3,
            "621375": 2,
            "620187": 3,
            "621734": 2,
            "621433": 2,
            "625986": 3,
            "621370": 2,
            "625925": 3,
            "622926": 2,
            "622927": 2,
            "622928": 2,
            "622929": 2,
            "622930": 2,
            "622931": 2,
            "621733": 2,
            "621732": 2,
            "620124": 3,
            "620183": 3,
            "620561": 3,
            "625116": 3,
            "622227": 3,
            "625921": 3,
            "621764": 2,
            "625926": 3,
            "621372": 2,
            "623034": 2,
            "625110": 3,
            "621464": 2,
            "625942": 3,
            "622158": 3,
            "625917": 3,
            "621765": 2,
            "620094": 3,
            "620186": 3,
            "621719": 2,
            "625922": 3,
            "621369": 2,
            "621763": 2,
            "625934": 3,
            "620046": 3,
            "621750": 2,
            "625933": 3,
            "621377": 2,
            "620148": 3,
            "620185": 3,
            "625920": 3,
            "621367": 2,
            "625924": 3,
            "621374": 2,
            "621731": 2,
            "621781": 2,
            "103": 2,
            "552599": 3,
            "6349102": 3,
            "6353591": 3,
            "623206": 2,
            "621671": 2,
            "620059": 2,
            "403361": 3,
            "404117": 3,
            "404118": 3,
            "404119": 3,
            "404120": 3,
            "404121": 3,
            "463758": 3,
            "49102": 3,
            "514027": 3,
            "519412": 3,
            "519413": 3,
            "520082": 3,
            "520083": 3,
            "53591": 3,
            "558730": 3,
            "621282": 2,
            "621336": 2,
            "621619": 2,
            "622821": 2,
            "622822": 2,
            "622823": 2,
            "622824": 2,
            "622825": 2,
            "622826": 2,
            "622827": 2,
            "622828": 2,
            "622836": 3,
            "622837": 3,
            "622840": 2,
            "622841": 2,
            "622843": 2,
            "622844": 2,
            "622845": 2,
            "622846": 2,
            "622847": 2,
            "622848": 2,
            "622849": 2,
            "623018": 2,
            "625996": 3,
            "625997": 3,
            "625998": 3,
            "628268": 3,
            "95595": 2,
            "95596": 2,
            "95597": 2,
            "95598": 2,
            "95599": 2,
            "625826": 3,
            "625827": 3,
            "548478": 3,
            "544243": 3,
            "622820": 3,
            "622830": 3,
            "622838": 3,
            "625336": 3,
            "628269": 3,
            "620501": 2,
            "621660": 2,
            "621661": 2,
            "621662": 2,
            "621663": 2,
            "621665": 2,
            "621667": 2,
            "621668": 2,
            "621669": 2,
            "621666": 2,
            "625908": 3,
            "625910": 3,
            "625909": 3,
            "356833": 3,
            "356835": 3,
            "409665": 3,
            "409666": 3,
            "409668": 3,
            "409669": 3,
            "409670": 3,
            "409671": 3,
            "409672": 3,
            "456351": 2,
            "512315": 3,
            "512316": 3,
            "512411": 3,
            "512412": 3,
            "514957": 3,
            "409667": 3,
            "518378": 3,
            "518379": 3,
            "518474": 3,
            "518475": 3,
            "518476": 3,
            "438088": 3,
            "524865": 3,
            "525745": 3,
            "525746": 3,
            "547766": 3,
            "552742": 3,
            "553131": 3,
            "558868": 3,
            "514958": 3,
            "622752": 3,
            "622753": 3,
            "622755": 3,
            "524864": 3,
            "622757": 3,
            "622758": 3,
            "622759": 3,
            "622760": 3,
            "622761": 3,
            "622762": 3,
            "622763": 3,
            "601382": 2,
            "622756": 3,
            "628388": 3,
            "621256": 2,
            "621212": 2,
            "620514": 3,
            "622754": 3,
            "622764": 3,
            "518377": 3,
            "622765": 3,
            "622788": 3,
            "621283": 2,
            "620061": 2,
            "621725": 2,
            "620040": 3,
            "558869": 3,
            "621330": 2,
            "621331": 2,
            "621332": 2,
            "621333": 2,
            "621297": 2,
            "377677": 3,
            "621568": 2,
            "621569": 2,
            "625905": 3,
            "625906": 3,
            "625907": 3,
            "628313": 3,
            "625333": 3,
            "628312": 3,
            "623208": 2,
            "621620": 2,
            "621756": 2,
            "621757": 2,
            "621758": 2,
            "621759": 2,
            "621785": 2,
            "621786": 2,
            "621787": 2,
            "621788": 2,
            "621789": 2,
            "621790": 2,
            "621672": 2,
            "625337": 3,
            "625338": 3,
            "625568": 3,
            "620025": 3,
            "620026": 3,
            "621293": 2,
            "621294": 2,
            "621342": 2,
            "621343": 2,
            "621364": 2,
            "621394": 2,
            "621648": 2,
            "621248": 2,
            "621215": 2,
            "621249": 2,
            "622750": 3,
            "622751": 3,
            "622771": 2,
            "622772": 2,
            "622770": 2,
            "625145": 3,
            "620531": 3,
            "620210": 3,
            "620211": 3,
            "622479": 3,
            "622480": 3,
            "622273": 2,
            "622274": 2,
            "620019": 3,
            "620035": 3,
            "621231": 2,
            "622789": 3,
            "621638": 2,
            "621334": 2,
            "625140": 3,
            "621395": 2,
            "620513": 3,
            "5453242": 3,
            "5491031": 3,
            "5544033": 3,
            "622725": 3,
            "622728": 3,
            "621284": 2,
            "421349": 2,
            "434061": 2,
            "434062": 2,
            "436728": 3,
            "436742": 2,
            "453242": 3,
            "491031": 3,
            "524094": 2,
            "526410": 2,
            "53242": 3,
            "53243": 3,
            "544033": 3,
            "552245": 2,
            "589970": 2,
            "620060": 2,
            "621080": 2,
            "621081": 2,
            "621466": 2,
            "621467": 2,
            "621488": 2,
            "621499": 2,
            "621598": 2,
            "621621": 2,
            "621700": 2,
            "622280": 2,
            "622700": 2,
            "622707": 3,
            "622966": 2,
            "622988": 2,
            "625955": 3,
            "625956": 3,
            "553242": 3,
            "621082": 2,
            "621673": 2,
            "623211": 2,
            "436742193": 2,
            "622280193": 2,
            "356896": 3,
            "356899": 3,
            "356895": 3,
            "436718": 3,
            "436738": 3,
            "436745": 3,
            "436748": 3,
            "489592": 3,
            "531693": 3,
            "532450": 3,
            "532458": 3,
            "544887": 3,
            "552801": 3,
            "557080": 3,
            "558895": 3,
            "559051": 3,
            "622166": 3,
            "622168": 3,
            "622708": 3,
            "625964": 3,
            "625965": 3,
            "625966": 3,
            "628266": 3,
            "628366": 3,
            "625362": 3,
            "625363": 3,
            "628316": 3,
            "628317": 3,
            "620021": 3,
            "620521": 3,
            "00405512": 2,
            "0049104": 3,
            "0053783": 3,
            "00601428": 2,
            "405512": 2,
            "434910": 3,
            "458123": 3,
            "458124": 3,
            "49104": 3,
            "520169": 3,
            "522964": 3,
            "53783": 3,
            "552853": 3,
            "601428": 2,
            "622250": 3,
            "622251": 3,
            "521899": 3,
            "622254": 3,
            "622255": 3,
            "622256": 3,
            "622257": 3,
            "622258": 2,
            "622259": 2,
            "622253": 3,
            "622261": 2,
            "622284": 3,
            "622656": 3,
            "628216": 3,
            "622252": 3,
            "66405512": 2,
            "6649104": 3,
            "622260": 2,
            "66601428": 2,
            "955590": 3,
            "955591": 3,
            "955592": 3,
            "955593": 3,
            "6653783": 3,
            "628218": 3,
            "622262": 2,
            "621069": 2,
            "620013": 2,
            "625028": 3,
            "625029": 3,
            "621436": 2,
            "621002": 2,
            "621335": 2,
            "433670": 2,
            "433680": 2,
            "442729": 2,
            "442730": 2,
            "620082": 2,
            "622690": 2,
            "622691": 2,
            "622692": 2,
            "622696": 2,
            "622698": 2,
            "622998": 2,
            "622999": 2,
            "433671": 2,
            "968807": 2,
            "968808": 2,
            "968809": 2,
            "621771": 2,
            "621767": 2,
            "621768": 2,
            "621770": 2,
            "621772": 2,
            "621773": 2,
            "620527": 2,
            "303": 2,
            "356837": 3,
            "356838": 3,
            "486497": 3,
            "622660": 2,
            "622662": 2,
            "622663": 2,
            "622664": 2,
            "622665": 2,
            "622666": 2,
            "622667": 2,
            "622669": 2,
            "622670": 2,
            "622671": 2,
            "622672": 2,
            "622668": 2,
            "622661": 2,
            "622674": 2,
            "90030": 2,
            "622673": 2,
            "620518": 2,
            "621489": 2,
            "621492": 2,
            "620535": 2,
            "623156": 2,
            "621490": 2,
            "621491": 2,
            "620085": 2,
            "623155": 2,
            "623157": 2,
            "623158": 2,
            "623159": 2,
            "999999": 2,
            "621222": 2,
            "623020": 2,
            "623021": 2,
            "623022": 2,
            "623023": 2,
            "622630": 2,
            "622631": 2,
            "622632": 2,
            "622633": 2,
            "622615": 2,
            "622616": 2,
            "622618": 2,
            "622622": 2,
            "622617": 2,
            "622619": 2,
            "415599": 2,
            "421393": 2,
            "421865": 2,
            "427570": 2,
            "427571": 2,
            "472067": 2,
            "472068": 2,
            "622620": 2,
            "621691": 2,
            "545392": 3,
            "545393": 3,
            "545431": 3,
            "545447": 3,
            "356859": 3,
            "356857": 3,
            "407405": 3,
            "421869": 3,
            "421870": 3,
            "421871": 3,
            "512466": 3,
            "356856": 3,
            "528948": 3,
            "552288": 3,
            "622600": 3,
            "622601": 3,
            "622602": 3,
            "517636": 3,
            "622621": 3,
            "628258": 3,
            "556610": 3,
            "622603": 3,
            "464580": 3,
            "464581": 3,
            "523952": 3,
            "545217": 3,
            "553161": 3,
            "356858": 3,
            "622623": 3,
            "625911": 3,
            "377152": 3,
            "377153": 3,
            "377158": 3,
            "377155": 3,
            "625912": 3,
            "625913": 3,
            "406365": 3,
            "406366": 3,
            "428911": 3,
            "436768": 3,
            "436769": 3,
            "487013": 3,
            "491032": 3,
            "491034": 3,
            "491035": 3,
            "491036": 3,
            "491037": 3,
            "491038": 3,
            "518364": 3,
            "520152": 3,
            "520382": 3,
            "548844": 3,
            "552794": 3,
            "622555": 3,
            "622556": 3,
            "622557": 3,
            "622558": 3,
            "622559": 3,
            "622560": 3,
            "622568": 2,
            "528931": 3,
            "9111": 2,
            "558894": 3,
            "625072": 3,
            "625071": 3,
            "628260": 3,
            "628259": 3,
            "621462": 2,
            "625805": 3,
            "625806": 3,
            "625807": 3,
            "625808": 3,
            "625809": 3,
            "625810": 3,
            "685800": 3,
            "620037": 3,
            "6858000": 3,
            "6858001": 2,
            "6858009": 2,
            "623506": 2,
            "412963": 2,
            "415752": 2,
            "415753": 2,
            "622535": 2,
            "622536": 2,
            "622538": 2,
            "622539": 2,
            "998800": 2,
            "412962": 2,
            "622983": 2,
            "620010": 2,
            "356885": 3,
            "356886": 3,
            "356887": 3,
            "356888": 3,
            "356890": 3,
            "402658": 2,
            "410062": 2,
            "439188": 3,
            "439227": 3,
            "468203": 2,
            "479228": 3,
            "479229": 3,
            "512425": 2,
            "521302": 3,
            "524011": 2,
            "356889": 3,
            "545620": 3,
            "545621": 3,
            "545947": 3,
            "545948": 3,
            "552534": 3,
            "552587": 3,
            "622575": 3,
            "622576": 3,
            "622577": 3,
            "622579": 3,
            "622580": 2,
            "545619": 3,
            "622581": 3,
            "622582": 3,
            "622588": 2,
            "622598": 2,
            "622609": 2,
            "690755": 2,
            "95555": 2,
            "545623": 3,
            "621286": 2,
            "620520": 3,
            "621483": 2,
            "621485": 2,
            "621486": 2,
            "628290": 3,
            "622578": 3,
            "370285": 3,
            "370286": 3,
            "370287": 3,
            "370289": 3,
            "439225": 3,
            "518710": 3,
            "518718": 3,
            "628362": 3,
            "439226": 3,
            "628262": 3,
            "625802": 3,
            "625803": 3,
            "621299": 2,
            "90592": 2,
            "966666": 2,
            "622909": 2,
            "622908": 2,
            "438588": 2,
            "438589": 2,
            "461982": 3,
            "486493": 3,
            "486494": 3,
            "486861": 3,
            "523036": 3,
            "451289": 3,
            "527414": 3,
            "528057": 3,
            "622901": 3,
            "622922": 3,
            "628212": 3,
            "451290": 3,
            "524070": 3,
            "625084": 3,
            "625085": 3,
            "625086": 3,
            "625087": 3,
            "548738": 3,
            "549633": 3,
            "552398": 3,
            "625082": 3,
            "625083": 3,
            "625960": 3,
            "625961": 3,
            "625962": 3,
            "625963": 3,
            "356851": 3,
            "356852": 3,
            "404738": 3,
            "404739": 3,
            "456418": 3,
            "498451": 3,
            "515672": 3,
            "356850": 3,
            "517650": 3,
            "525998": 3,
            "622177": 3,
            "622277": 3,
            "622516": 2,
            "622518": 2,
            "622520": 3,
            "622521": 2,
            "622522": 2,
            "622523": 2,
            "628222": 3,
            "84301": 2,
            "84336": 2,
            "84373": 2,
            "628221": 3,
            "84385": 2,
            "84390": 2,
            "87000": 2,
            "87010": 2,
            "87030": 2,
            "87040": 2,
            "84380": 2,
            "984301": 2,
            "984303": 2,
            "84361": 2,
            "87050": 2,
            "622176": 3,
            "622276": 3,
            "622228": 3,
            "621352": 2,
            "621351": 2,
            "621390": 2,
            "621792": 2,
            "625957": 3,
            "625958": 3,
            "621791": 2,
            "84342": 2,
            "620530": 3,
            "625993": 3,
            "622519": 3,
            "621793": 2,
            "621795": 2,
            "621796": 2,
            "622500": 3,
            "623078": 2,
            "622384": 2,
            "940034": 2,
            "6091201": 2,
            "940015": 2,
            "940008": 2,
            "622379": 2,
            "622886": 2,
            "622391": 2,
            "940072": 2,
            "622359": 2,
            "940066": 2,
            "622857": 2,
            "940065": 2,
            "621019": 2,
            "6223091100": 2,
            "6223092900": 2,
            "6223093310": 2,
            "6223093320": 2,
            "6223093330": 2,
            "6223093370": 2,
            "6223093380": 2,
            "6223096510": 2,
            "6223097910": 2,
            "621268": 2,
            "622884": 2,
            "621453": 2,
            "622684": 2,
            "621062": 2,
            "621063": 2,
            "625076": 3,
            "625077": 3,
            "625074": 3,
            "625075": 3,
            "622933": 2,
            "622938": 2,
            "623031": 2,
            "622946": 2,
            "622942": 2,
            "622994": 2,
            "621016": 2,
            "621015": 2,
            "622950": 2,
            "622951": 2,
            "621060": 2,
            "621072": 2,
            "621201": 2,
            "621077": 2,
            "621298": 2,
            "621213": 2,
            "621289": 2,
            "621290": 2,
            "621291": 2,
            "621292": 2,
            "621245": 2,
            "621328": 2,
            "621277": 2,
            "621651": 2,
            "623183": 2,
            "623185": 2,
            "621005": 2,
            "622172": 2,
            "622985": 2,
            "622987": 2,
            "622267": 2,
            "622278": 2,
            "622279": 2,
            "622468": 2,
            "622892": 2,
            "940021": 2,
            "621050": 2,
            "620522": 2,
            "356827": 3,
            "356828": 3,
            "356830": 3,
            "402673": 3,
            "402674": 3,
            "438600": 2,
            "486466": 3,
            "519498": 3,
            "520131": 3,
            "524031": 3,
            "548838": 3,
            "622148": 3,
            "622149": 3,
            "622268": 3,
            "356829": 3,
            "622300": 3,
            "628230": 3,
            "622269": 3,
            "625099": 3,
            "625953": 3,
            "625350": 3,
            "625351": 3,
            "625352": 3,
            "519961": 3,
            "625839": 3,
            "622393": 2,
            "6886592": 2,
            "940023": 2,
            "623019": 2,
            "621600": 2,
            "421317": 2,
            "602969": 2,
            "621030": 2,
            "621420": 2,
            "621468": 2,
            "623111": 2,
            "422160": 2,
            "422161": 2,
            "622388": 2,
            "621267": 2,
            "620043": 3,
            "623063": 2,
            "622865": 2,
            "940012": 2,
            "623131": 2,
            "622178": 3,
            "622179": 3,
            "628358": 3,
            "622394": 2,
            "940025": 2,
            "621279": 2,
            "622281": 2,
            "622316": 2,
            "940022": 2,
            "621418": 2,
            "512431": 3,
            "520194": 3,
            "621626": 2,
            "623058": 2,
            "602907": 2,
            "622986": 2,
            "622989": 2,
            "622298": 2,
            "622338": 2,
            "940032": 2,
            "623205": 2,
            "621977": 2,
            "603445": 2,
            "622467": 2,
            "940016": 2,
            "621463": 2,
            "990027": 2,
            "622325": 2,
            "623029": 2,
            "623105": 2,
            "622475": 2,
            "621244": 2,
            "623081": 2,
            "623108": 2,
            "566666": 2,
            "622455": 2,
            "940039": 2,
            "622466": 3,
            "628285": 3,
            "622420": 2,
            "940041": 2,
            "623118": 2,
            "622399": 2,
            "940043": 2,
            "628309": 3,
            "623151": 2,
            "603708": 2,
            "622993": 2,
            "623070": 2,
            "623069": 2,
            "623172": 2,
            "623173": 2,
            "622383": 3,
            "622385": 3,
            "628299": 3,
            "603506": 2,
            "622498": 2,
            "622499": 2,
            "940046": 2,
            "623000": 2,
            "603367": 2,
            "622878": 2,
            "623061": 2,
            "623209": 2,
            "628242": 3,
            "622595": 3,
            "621259": 2,
            "622596": 3,
            "622333": 2,
            "940050": 2,
            "621439": 2,
            "623010": 2,
            "940051": 2,
            "628204": 3,
            "622449": 2,
            "623067": 2,
            "622450": 3,
            "621751": 2,
            "628278": 3,
            "625502": 3,
            "625503": 3,
            "625135": 3,
            "622476": 3,
            "621754": 2,
            "622143": 2,
            "940001": 2,
            "622486": 2,
            "603602": 2,
            "623026": 2,
            "623086": 2,
            "628291": 3,
            "621532": 2,
            "621482": 2,
            "622135": 2,
            "622152": 2,
            "622153": 2,
            "622154": 2,
            "622996": 2,
            "622997": 2,
            "940027": 2,
            "622442": 2,
            "940053": 2,
            "623099": 2,
            "623007": 2,
            "940055": 2,
            "622397": 3,
            "622398": 2,
            "940054": 2,
            "622331": 2,
            "622426": 3,
            "625995": 3,
            "621452": 2,
            "628205": 3,
            "622421": 2,
            "940056": 2,
            "96828": 2,
            "628214": 3,
            "625529": 3,
            "622428": 3,
            "621529": 2,
            "622429": 2,
            "621417": 2,
            "623089": 2,
            "623200": 2,
            "622363": 2,
            "940048": 2,
            "621455": 2,
            "940057": 2,
            "622311": 2,
            "623119": 2,
            "622990": 2,
            "940003": 2,
            "622877": 2,
            "622879": 2,
            "621775": 2,
            "623203": 2,
            "603601": 2,
            "622137": 2,
            "622327": 2,
            "622340": 2,
            "622366": 2,
            "9896": 2,
            "622134": 2,
            "940018": 2,
            "623016": 2,
            "623096": 2,
            "940049": 2,
            "622425": 2,
            "621577": 2,
            "622133": 2,
            "888": 2,
            "621735": 2,
            "622170": 2,
            "622136": 2,
            "622981": 2,
            "60326500": 2,
            "60326513": 2,
            "622485": 2,
            "622415": 2,
            "940060": 2,
            "623098": 2,
            "628329": 3,
            "622139": 2,
            "940040": 2,
            "621242": 2,
            "621538": 2,
            "621496": 2,
            "623129": 2,
            "940006": 2,
            "621269": 2,
            "622275": 2,
            "621216": 2,
            "622465": 2,
            "940031": 2,
            "621252": 2,
            "622146": 2,
            "940061": 2,
            "621419": 2,
            "623170": 2,
            "622440": 2,
            "940047": 2,
            "69580": 2,
            "940017": 2,
            "622418": 2,
            "622162": 2,
            "623077": 2,
            "622413": 2,
            "940002": 2,
            "623188": 2,
            "621237": 2,
            "62249802": 2,
            "94004602": 2,
            "623003": 2,
            "622310": 2,
            "940068": 2,
            "622321": 3,
            "625001": 3,
            "622427": 2,
            "940069": 2,
            "623039": 2,
            "628273": 3,
            "940070": 2,
            "694301": 2,
            "940071": 2,
            "622368": 2,
            "621446": 2,
            "625901": 3,
            "622898": 3,
            "622900": 3,
            "628281": 3,
            "628282": 3,
            "628283": 3,
            "620519": 3,
            "621739": 2,
            "622967": 2,
            "940073": 2,
            "622370": 2,
            "683970": 2,
            "940074": 2,
            "621437": 2,
            "628319": 3,
            "622400": 2,
            "623177": 2,
            "990871": 2,
            "621415": 2,
            "622126": 2,
            "623166": 2,
            "622132": 2,
            "621340": 2,
            "621341": 2,
            "622140": 2,
            "623073": 2,
            "622141": 2,
            "621480": 2,
            "622147": 2,
            "621633": 2,
            "622301": 2,
            "623171": 2,
            "621266": 2,
            "62249804": 2,
            "94004604": 2,
            "621422": 2,
            "622335": 2,
            "622336": 2,
            "622165": 2,
            "628295": 3,
            "625950": 3,
            "621760": 2,
            "622337": 2,
            "622411": 2,
            "623102": 2,
            "622342": 2,
            "623048": 2,
            "622367": 2,
            "622392": 2,
            "623085": 2,
            "622395": 2,
            "622441": 2,
            "622448": 2,
            "622982": 2,
            "621413": 2,
            "622856": 2,
            "621037": 2,
            "621097": 2,
            "621588": 2,
            "62321601": 2,
            "623032": 2,
            "622644": 2,
            "623518": 2,
            "622860": 2,
            "622870": 2,
            "622866": 2,
            "622292": 2,
            "622291": 2,
            "621412": 2,
            "622880": 2,
            "622881": 2,
            "620118": 3,
            "623072": 2,
            "622897": 2,
            "628279": 3,
            "622864": 2,
            "621403": 2,
            "622561": 2,
            "622562": 2,
            "622563": 2,
            "622167": 2,
            "622508": 2,
            "622777": 2,
            "621497": 2,
            "622532": 2,
            "622888": 3,
            "628398": 3,
            "622868": 3,
            "622899": 3,
            "628255": 3,
            "625988": 3,
            "622566": 3,
            "622567": 3,
            "622625": 3,
            "622626": 3,
            "625946": 3,
            "628200": 3,
            "621076": 2,
            "504923": 2,
            "622173": 2,
            "622422": 2,
            "622447": 2,
            "622131": 2,
            "940076": 2,
            "621579": 2,
            "622876": 2,
            "622873": 2,
            "531659": 3,
            "622157": 3,
            "435744": 3,
            "435745": 3,
            "483536": 3,
            "622525": 3,
            "622526": 3,
            "998801": 3,
            "998802": 3,
            "528020": 3,
            "622155": 3,
            "622156": 3,
            "526855": 3,
            "356869": 3,
            "356868": 3,
            "625360": 3,
            "625361": 3,
            "628296": 3,
            "625825": 3,
            "625823": 3,
            "622962": 2,
            "622936": 2,
            "623060": 2,
            "622937": 2,
            "623101": 2,
            "621460": 2,
            "622939": 2,
            "622960": 2,
            "623523": 2,
            "621591": 2,
            "622961": 2,
            "628210": 3,
            "622283": 3,
            "625902": 3,
            "621010": 2,
            "622980": 2,
            "623135": 2,
            "621726": 2,
            "621088": 2,
            "620517": 3,
            "622740": 3,
            "625036": 3,
            "621014": 2,
            "621004": 2,
            "622972": 2,
            "623196": 2,
            "621028": 2,
            "623083": 2,
            "628250": 3,
            "622973": 2,
            "623153": 2,
            "623121": 2,
            "621070": 2,
            "622977": 2,
            "622978": 2,
            "628253": 3,
            "623093": 2,
            "628378": 3,
            "622979": 2,
            "621035": 2,
            "621200": 2,
            "623116": 2,
            "621038": 2,
            "621086": 2,
            "621498": 2,
            "621296": 2,
            "621448": 2,
            "621044": 2,
            "622945": 2,
            "621755": 2,
            "622940": 2,
            "623120": 2,
            "628355": 3,
            "621089": 2,
            "623161": 2,
            "621029": 2,
            "621766": 2,
            "623139": 2,
            "621071": 2,
            "623152": 2,
            "628339": 3,
            "621074": 2,
            "621515": 2,
            "623030": 2,
            "621345": 2,
            "621090": 2,
            "623178": 2,
            "621091": 2,
            "623168": 2,
            "621238": 2,
            "621057": 2,
            "623199": 2,
            "621075": 2,
            "623037": 2,
            "628303": 3,
            "621233": 2,
            "621235": 2,
            "621223": 2,
            "621780": 2,
            "621221": 2,
            "623138": 2,
            "628389": 3,
            "621239": 2,
            "623068": 2,
            "621271": 2,
            "628315": 3,
            "621272": 2,
            "621738": 2,
            "621273": 2,
            "623079": 2,
            "621263": 2,
            "621325": 2,
            "623084": 2,
            "621337": 2,
            "621327": 2,
            "621753": 2,
            "628331": 3,
            "623160": 2,
            "621366": 2,
            "621388": 2,
            "621348": 2,
            "621359": 2,
            "621360": 2,
            "621217": 2,
            "622959": 2,
            "621270": 2,
            "622396": 2,
            "622511": 2,
            "623076": 2,
            "621391": 2,
            "621339": 2,
            "621469": 2,
            "621625": 2,
            "623688": 2,
            "623113": 2,
            "621601": 2,
            "621655": 2,
            "621636": 2,
            "623182": 2,
            "623087": 2,
            "621696": 2,
            "627069": 2,
            "627068": 2,
            "627066": 2,
            "627067": 2,
            "622955": 2,
            "622478": 2,
            "940013": 2,
            "621495": 2,
            "621688": 2,
            "623162": 2,
            "622443": 2,
            "940029": 2,
            "623132": 2,
            "622462": 3,
            "628272": 3,
            "625101": 3,
            "622323": 2,
            "9400301": 2,
            "623071": 2,
            "603694": 2,
            "622128": 2,
            "622129": 2,
            "623035": 2,
            "623186": 2,
            "909810": 2,
            "940035": 2,
            "621522": 2,
            "622439": 2,
            "622271": 2,
            "940037": 2,
            "940038": 2,
            "985262": 2,
            "622322": 2,
            "621017": 2,
            "018572": 2,
            "622369": 2,
            "940042": 2,
            "623190": 2,
            "622412": 2,
            "621523": 2,
            "623055": 2,
            "621013": 2,
            "940044": 2,
            "622312": 2,
            "628381": 3,
            "622481": 3,
            "622341": 2,
            "940058": 2,
            "623115": 2,
            "622867": 2,
            "622885": 2,
            "940020": 2,
            "621258": 2,
            "621465": 2,
            "621528": 2,
            "900105": 2,
            "900205": 2,
            "622319": 2,
            "621521": 2,
            "621690": 2,
            "622320": 2,
            "62231902": 2,
            "90010502": 2,
            "90020502": 2,
            "622328": 2,
            "940062": 2,
            "625288": 3,
            "623038": 2,
            "625888": 3,
            "622332": 2,
            "940063": 2,
            "623123": 2,
            "622127": 2,
            "622184": 2,
            "621251": 2,
            "621589": 2,
            "623036": 2,
            "621701": 2,
            "622138": 2,
            "621066": 2,
            "621560": 2,
            "621068": 2,
            "620088": 2,
            "621067": 2,
            "625186": 3,
            "628336": 3,
            "625526": 3,
            "622531": 2,
            "622329": 2,
            "623103": 2,
            "622339": 2,
            "620500": 2,
            "621024": 2,
            "622289": 3,
            "622389": 3,
            "628300": 3,
            "622343": 2,
            "625516": 3,
            "621516": 2,
            "622345": 2,
            "622452": 2,
            "621578": 2,
            "622324": 2,
            "623066": 2,
            "622648": 3,
            "628248": 3,
            "622488": 2,
            "623110": 2,
            "622858": 2,
            "621058": 2,
            "621527": 2,
            "623091": 2,
            "622288": 3,
            "628280": 3,
            "622686": 3,
            "622855": 2,
            "621461": 2,
            "623521": 2,
            "622859": 2,
            "622869": 2,
            "623075": 2,
            "622882": 2,
            "622893": 2,
            "621590": 2,
            "622895": 2,
            "623125": 2,
            "622169": 2,
            "621519": 2,
            "621539": 2,
            "623090": 2,
            "622681": 2,
            "622682": 2,
            "622683": 2,
            "621592": 2,
            "622991": 2,
            "621585": 2,
            "623013": 2,
            "623059": 2,
            "621021": 2,
            "622358": 2,
            "623025": 2,
            "622506": 2,
            "621566": 2,
            "623027": 2,
            "623028": 2,
            "628323": 3,
            "622992": 2,
            "623133": 2,
            "628330": 3,
            "621008": 2,
            "621525": 2,
            "621287": 2,
            "622935": 2,
            "621531": 2,
            "623181": 2,
            "622947": 2,
            "621561": 2,
            "623095": 2,
            "621526": 2,
            "622953": 2,
            "621536": 2,
            "621036": 2,
            "621458": 2,
            "621517": 2,
            "621065": 2,
            "623017": 2,
            "628289": 3,
            "622477": 2,
            "622362": 2,
            "621018": 2,
            "621518": 2,
            "621728": 2,
            "622470": 2,
            "622976": 2,
            "621533": 2,
            "621362": 2,
            "621033": 2,
            "621099": 2,
            "621457": 2,
            "621459": 2,
            "621530": 2,
            "623201": 2,
            "628297": 3,
            "621061": 2,
            "621520": 2,
            "623065": 2,
            "628332": 3,
            "621449": 2,
            "621026": 2,
            "622968": 2,
            "621280": 2,
            "621580": 2,
            "623051": 2,
            "621073": 2,
            "623109": 2,
            "621228": 2,
            "621557": 2,
            "623516": 2,
            "621361": 2,
            "623033": 2,
            "623207": 2,
            "622891": 2,
            "621363": 2,
            "623189": 2,
            "623510": 2,
            "621056802": 2,
            "621056801": 2,
            "621056803": 2,
            "622995": 2,
            "6229756114": 2,
            "6229756115": 2,
            "62105913": 2,
            "62105916": 2,
            "62105915": 2,
            "62105905": 2,
            "62105901": 2,
            "62105900": 2,
            "621053": 2,
            "621260002": 2,
            "621260001": 2,
            "621092003": 2,
            "621092002": 2,
            "621092001": 2,
            "621092006": 2,
            "621092004": 2,
            "621092005": 2,
            "621230": 2,
            "621229": 2,
            "621250004": 2,
            "621250003": 2,
            "621250001": 2,
            "621250005": 2,
            "621250002": 2,
            "621241001": 2,
            "622218": 3,
            "628267": 3,
            "621346003": 2,
            "621346002": 2,
            "621346001": 2,
            "621326919": 2,
            "621326763": 2,
            "621338001": 2,
            "621353008": 2,
            "621353108": 2,
            "621353002": 2,
            "621353102": 2,
            "621353005": 2,
            "621353105": 2,
            "621353007": 2,
            "621353107": 2,
            "621353003": 2,
            "621353103": 2,
            "621353001": 2,
            "621353101": 2,
            "621356014": 2,
            "621356013": 2,
            "621356016": 2,
            "621356015": 2,
            "621356005": 2,
            "621356018": 2,
            "621356006": 2,
            "621356004": 2,
            "621356003": 2,
            "621356017": 2,
            "621356007": 2,
            "621356009": 2,
            "621356008": 2,
            "621356002": 2,
            "621356001": 2,
            "621356010": 2,
            "621356012": 2,
            "621356011": 2,
            "621347002": 2,
            "621347008": 2,
            "621347005": 2,
            "621347003": 2,
            "621347001": 2,
            "621347006": 2,
            "621347007": 2,
            "621350010": 2,
            "621350020": 2,
            "621350431": 2,
            "621350451": 2,
            "621350001": 2,
            "621350013": 2,
            "621350005": 2,
            "621350009": 2,
            "621350003": 2,
            "621350002": 2,
            "621350015": 2,
            "621350004": 2,
            "621350006": 2,
            "621350011": 2,
            "621350016": 2,
            "621350007": 2,
            "621350755": 2,
            "621350017": 2,
            "621350014": 2,
            "621350019": 2,
            "621350012": 2,
            "621350008": 2,
            "621350018": 2,
            "621350943": 2,
            "621392": 2,
            "621399017": 2,
            "621399008": 2,
            "621399001": 2,
            "621399012": 2,
            "621399025": 2,
            "621399026": 2,
            "621399023": 2,
            "621399024": 2,
            "621399002": 2,
            "621399018": 2,
            "621399010": 2,
            "621399009": 2,
            "621399011": 2,
            "621399013": 2,
            "621399005": 2,
            "621399006": 2,
            "621399021": 2,
            "621399019": 2,
            "621399027": 2,
            "621399020": 2,
            "621399022": 2,
            "621365006": 2,
            "621365001": 2,
            "621365005": 2,
            "621365004": 2,
            "621365003": 2,
            "621365002": 2,
            "621481": 2,
            "621393001": 2,
            "621623001": 2,
            "621397001": 2,
            "621627001": 2,
            "621627007": 2,
            "621627003": 2,
            "621627006": 2,
            "621627010": 2,
            "621635101": 2,
            "621635114": 2,
            "621635003": 2,
            "621635103": 2,
            "621635004": 2,
            "621635104": 2,
            "621635112": 2,
            "621635111": 2,
            "621635013": 2,
            "621635113": 2,
            "621635010": 2,
            "621635005": 2,
            "621635105": 2,
            "621635106": 2,
            "621650002": 2,
            "621650001": 2,
            "62163113": 2,
            "62163103": 2,
            "62163119": 2,
            "62163120": 2,
            "62163117": 2,
            "62163115": 2,
            "62163104": 2,
            "62163118": 2,
            "62163108": 2,
            "62163107": 2,
            "621310": 2,
            "62163101": 2,
            "62163102": 2,
            "62163109": 2,
            "62163110": 2,
            "62163111": 2,
            "621653002": 2,
            "621653004": 2,
            "621653005": 2,
            "621653007": 2,
            "621653006": 2,
            "621653001": 2,
            "62308299": 2,
            "621628660": 2,
            "621316001": 2,
            "62319801": 2,
            "62319806": 2,
            "62319802": 2,
            "62319803": 2,
            "621355002": 2,
            "621355001": 2,
            "621396": 2,
            "621656001": 2,
            "621659001": 2,
            "621659006": 2,
            "621398001": 2,
            "621676001": 2,
            "621676002": 2,
            "621676003": 2,
            "621680002": 2,
            "621680009": 2,
            "621680005": 2,
            "621680004": 2,
            "621680006": 2,
            "621680008": 2,
            "621680011": 2,
            "621681001": 2,
            "621682002": 2,
            "621682101": 2,
            "621682102": 2,
            "621682106": 2,
            "621682103": 2,
            "621682105": 2,
            "621682110": 2,
            "621682111": 2,
            "621682109": 2,
            "621682108": 2,
            "621682107": 2,
            "621682202": 2,
            "621682201": 2,
            "621682203": 2,
            "621682205": 2,
            "621682209": 2,
            "621682208": 2,
            "621682210": 2,
            "621682213": 2,
            "621682211": 2,
            "621682212": 2,
            "621682207": 2,
            "621682206": 2,
            "621682003": 2,
            "621682301": 2,
            "621682302": 2,
            "621682305": 2,
            "621682307": 2,
            "621682306": 2,
            "621682309": 2,
            "621682308": 2,
            "621682310": 2,
            "621682303": 2,
            "621682311": 2,
            "621687913": 2,
            "62169501": 2,
            "62169503": 2,
            "62352801": 2,
            "621697813": 2,
            "621697793": 2,
            "621697873": 2,
            "62311701": 2,
            "621689004": 2,
            "621689005": 2,
            "621689006": 2,
            "621689003": 2,
            "621387973": 2,
            "621382019": 2,
            "621382018": 2,
            "621382020": 2,
            "621382001": 2,
            "621382002": 2,
            "621382010": 2,
            "621382007": 2,
            "621382003": 2,
            "621382004": 2,
            "621382025": 2,
            "621382013": 2,
            "621382017": 2,
            "621382021": 2,
            "621382023": 2,
            "621382015": 2,
            "621382016": 2,
            "621382014": 2,
            "621382024": 2,
            "621382011": 2,
            "621382022": 2,
            "621382026": 2,
            "621383001": 2,
            "621278333": 2,
            "621386001": 2,
            "623678353": 2,
            "623608001": 2,
            "623608002": 2,
            "62351501": 2,
            "62168301": 2,
            "62168302": 2,
            "622372": 3,
            "622365": 2,
            "622471": 3,
            "622943": 2,
            "622472": 3,
            "623318": 2,
            "621411": 2,
            "622371": 3,
            "625091": 3,
            "622293": 3,
            "622295": 3,
            "622296": 3,
            "622297": 2,
            "622373": 3,
            "622375": 2,
            "622451": 3,
            "622294": 3,
            "625940": 3,
            "622489": 2,
            "622871": 2,
            "622958": 2,
            "622963": 2,
            "622957": 2,
            "622798": 3,
            "625010": 3,
            "622381": 3,
            "622675": 3,
            "622676": 3,
            "622677": 3,
            "622382": 2,
            "621487": 2,
            "621083": 2,
            "622487": 2,
            "622490": 2,
            "622491": 2,
            "622492": 2,
            "621744": 2,
            "621745": 2,
            "621746": 2,
            "621747": 2,
            "621034": 2,
            "622386": 3,
            "622952": 2,
            "625107": 3,
            "622387": 3,
            "622423": 3,
            "622971": 2,
            "622970": 2,
            "625062": 3,
            "625063": 3,
            "622360": 3,
            "622361": 3,
            "625034": 3,
            "625096": 3,
            "625098": 3,
            "622406": 2,
            "622407": 2,
            "621442": 2,
            "621443": 2,
            "625026": 3,
            "625024": 3,
            "622376": 3,
            "622378": 3,
            "622377": 3,
            "625092": 3,
            "622409": 2,
            "622410": 2,
            "621440": 2,
            "621441": 2,
            "623106": 2,
            "623107": 2,
            "622453": 3,
            "622456": 3,
            "622459": 2,
            "624303": 3,
            "623328": 2,
            "622272": 2,
            "622463": 2,
            "621087": 2,
            "625008": 3,
            "625009": 3,
            "625055": 3,
            "625040": 3,
            "625042": 3,
            "625141": 3,
            "625143": 3,
            "621741": 2,
            "623040": 2,
            "620202": 3,
            "620203": 3,
            "625136": 3,
            "621782": 2,
            "623309": 2,
            "625046": 3,
            "625044": 3,
            "625058": 3,
            "621743": 2,
            "623041": 2,
            "620208": 3,
            "620209": 3,
            "621042": 2,
            "621783": 2,
            "623308": 2,
            "625048": 3,
            "625053": 3,
            "625060": 3,
            "621742": 2,
            "623042": 2,
            "620206": 3,
            "620207": 3,
            "621043": 2,
            "621784": 2,
            "623310": 2,
            "622493": 3,
            "625198": 3,
            "625196": 3,
            "622547": 2,
            "622548": 2,
            "622546": 2,
            "625147": 3,
            "620072": 3,
            "620204": 3,
            "620205": 3,
            "621064": 2,
            "622941": 2,
            "622974": 2,
            "621084": 2,
            "622948": 2,
            "621740": 2,
            "622482": 3,
            "622483": 3,
            "622484": 3,
            "620070": 3,
            "620068": 3,
            "620107": 2,
            "623334": 3,
            "625842": 3,
            "6258433": 3,
            "6258434": 3,
            "622495": 2,
            "622496": 2,
            "620152": 3,
            "620153": 3,
            "622433": 3,
            "622861": 2,
            "622932": 2,
            "622862": 2,
            "622775": 3,
            "622785": 3,
            "622920": 3,
            "622434": 2,
            "622436": 2,
            "622435": 2,
            "621232": 2,
            "622432": 2,
            "621247": 2,
            "623043": 2,
            "623064": 2,
            "601100": 3,
            "601101": 3,
            "60112010": 3,
            "60112011": 3,
            "60112012": 3,
            "60112089": 3,
            "601121": 3,
            "601123": 3,
            "601124": 3,
            "601125": 3,
            "601126": 3,
            "601127": 3,
            "601128": 3,
            "6011290": 3,
            "6011291": 3,
            "6011292": 3,
            "6011293": 3,
            "60112013": 3,
            "6011295": 3,
            "601122": 3,
            "6011297": 3,
            "60112980": 3,
            "60112981": 3,
            "60112986": 3,
            "60112987": 3,
            "60112988": 3,
            "60112989": 3,
            "60112990": 3,
            "60112991": 3,
            "60112992": 3,
            "60112993": 3,
            "6011294": 3,
            "6011296": 3,
            "60112996": 3,
            "60112997": 3,
            "6011300": 3,
            "60113080": 3,
            "60113081": 3,
            "60113089": 3,
            "601131": 3,
            "601136": 3,
            "601137": 3,
            "601138": 3,
            "6011390": 3,
            "60112995": 3,
            "6011392": 3,
            "6011393": 3,
            "60113940": 3,
            "60113941": 3,
            "60113943": 3,
            "60113944": 3,
            "60113945": 3,
            "60113946": 3,
            "60113984": 3,
            "60113985": 3,
            "60113986": 3,
            "60113988": 3,
            "60112994": 3,
            "6011391": 3,
            "601140": 3,
            "601142": 3,
            "601143": 3,
            "601144": 3,
            "601145": 3,
            "601146": 3,
            "601147": 3,
            "601148": 3,
            "601149": 3,
            "601174": 3,
            "60113989": 3,
            "601178": 3,
            "6011399": 3,
            "601186": 3,
            "601187": 3,
            "601188": 3,
            "601189": 3,
            "644": 3,
            "65": 3,
            "6506": 3,
            "6507": 3,
            "6508": 3,
            "601177": 3,
            "601179": 3,
            "6509": 3,
            "60110": 3,
            "60112": 3,
            "60113": 3,
            "60114": 3,
            "60119": 3,
            "621253": 2,
            "621254": 2,
            "621255": 2,
            "625014": 3,
            "625016": 3,
            "622549": 2,
            "622550": 2,
            "622354": 3,
            "625017": 3,
            "625018": 3,
            "625019": 3,
            "621224": 2,
            "622954": 2,
            "621295": 2,
            "625124": 3,
            "625154": 3,
            "621049": 2,
            "622444": 3,
            "622414": 2,
            "620011": 2,
            "620027": 2,
            "620031": 2,
            "620039": 2,
            "620103": 2,
            "620106": 2,
            "620120": 2,
            "620123": 2,
            "620125": 2,
            "620220": 2,
            "620278": 2,
            "620812": 2,
            "621006": 2,
            "621011": 2,
            "621012": 2,
            "621020": 2,
            "621023": 2,
            "621025": 2,
            "621027": 2,
            "621031": 2,
            "620132": 2,
            "621039": 2,
            "621078": 2,
            "621220": 2,
            "625003": 3,
            "621003": 2,
            "625011": 3,
            "625012": 3,
            "625020": 3,
            "625023": 3,
            "625025": 3,
            "625027": 3,
            "625031": 3,
            "621032": 2,
            "625039": 3,
            "625078": 3,
            "625079": 3,
            "625103": 3,
            "625106": 3,
            "625006": 3,
            "625112": 3,
            "625120": 3,
            "625123": 3,
            "625125": 3,
            "625127": 3,
            "625131": 3,
            "625032": 3,
            "625139": 3,
            "625178": 3,
            "625179": 3,
            "625220": 3,
            "625320": 3,
            "625111": 3,
            "625132": 3,
            "625244": 3,
            "625243": 3,
            "621484": 2,
            "621640": 2,
            "621040": 2,
            "621045": 2,
            "621264": 2,
            "622356": 3,
            "621234": 2,
            "622145": 3,
            "625013": 3,
            "622130": 3,
            "621257": 2,
            "621055": 2,
            "620009": 3,
            "625002": 3,
            "625033": 3,
            "625035": 3,
            "625007": 3,
            "620015": 3,
            "620024": 3,
            "625004": 3,
            "621344": 2,
            "621349": 2,
            "620108": 3,
            "6216846": 2,
            "6216848": 2,
            "6250386": 3,
            "6250388": 3,
            "6201086": 3,
            "6201088": 3,
            "621354": 2,
            "621274": 2,
            "621324": 2,
            "620532": 3,
            "620126": 3,
            "620537": 3,
            "625904": 3,
            "621645": 2,
            "621624": 2,
            "623339": 2,
            "625104": 3,
            "621647": 2,
            "621642": 2,
            "621654": 2,
            "625804": 3,
            "625814": 3,
            "625817": 3,
            "621649": 2,
            "620079": 2,
            "620091": 2,
            "620105": 3,
            "622164": 3,
            "621657": 2,
            "623024": 2,
            "625840": 3,
            "625841": 3,
            "621694": 2,
            "6233451": 2,
            "6233452": 2,
            "623347": 2,
            "620129": 2,
            "621301": 2,
            "624306": 3,
            "624322": 3,
            "623300": 3,
            "623302": 3,
            "623303": 3,
            "623304": 2,
            "623324": 2,
            "623307": 2,
            "623311": 3,
            "623312": 2,
            "623313": 2,
            "623323": 2,
            "623341": 2,
            "624320": 3,
            "624321": 3,
            "624324": 3,
            "624325": 3,
            "623314": 2,
            "623331": 3,
            "623348": 2,
            "623336": 2,
            "623337": 2,
            "623338": 2,
            "624323": 3,
            "622346": 3,
            "622347": 3,
            "622348": 2,
            "622349": 3,
            "622350": 3,
            "622352": 3,
            "622353": 3,
            "622355": 2,
            "621041": 2,
            "622351": 2,
            "620048": 3,
            "620515": 3,
            "920000": 3,
            "620550": 3,
            "621563": 3,
            "921001": 3,
            "921002": 3,
            "921000": 3,
            "620038": 3,
            "622812": 3,
            "622810": 3,
            "622811": 3,
            "628310": 3,
            "625919": 3,
            "376968": 3,
            "376969": 3,
            "400360": 3,
            "403391": 3,
            "403392": 3,
            "376966": 3,
            "404158": 3,
            "404159": 3,
            "404171": 3,
            "404172": 3,
            "404173": 3,
            "404174": 3,
            "404157": 3,
            "433667": 3,
            "433668": 3,
            "433669": 3,
            "514906": 3,
            "403393": 3,
            "520108": 3,
            "433666": 3,
            "558916": 3,
            "622678": 3,
            "622679": 3,
            "622680": 3,
            "622688": 3,
            "622689": 3,
            "628206": 3,
            "556617": 3,
            "628209": 3,
            "518212": 3,
            "628208": 3,
            "356390": 3,
            "356391": 3,
            "356392": 3,
            "622916": 3,
            "622918": 3,
            "622919": 3,
            "628370": 3,
            "628371": 3,
            "628372": 3,
            "622657": 3,
            "622685": 3,
            "622659": 3,
            "622687": 3,
            "625978": 3,
            "625980": 3,
            "625981": 3,
            "625979": 3,
            "356839": 3,
            "356840": 3,
            "406252": 3,
            "406254": 3,
            "425862": 3,
            "481699": 3,
            "524090": 3,
            "543159": 3,
            "622161": 3,
            "622570": 3,
            "622650": 3,
            "622655": 3,
            "622658": 3,
            "625975": 3,
            "625977": 3,
            "628201": 3,
            "628202": 3,
            "625976": 3,
            "625339": 3,
            "622801": 3,
            "523959": 3,
            "528709": 3,
            "539867": 3,
            "539868": 3,
            "622637": 3,
            "622638": 3,
            "628318": 3,
            "528708": 3,
            "622636": 3,
            "625967": 3,
            "625968": 3,
            "625969": 3,
            "625971": 3,
            "625970": 3,
            "377187": 3,
            "625831": 3,
            "622265": 3,
            "622266": 3,
            "625972": 3,
            "625973": 3,
            "625093": 3,
            "625095": 3,
            "522001": 3,
            "622163": 3,
            "622853": 3,
            "628203": 3,
            "622851": 3,
            "622852": 3,
            "625903": 3,
            "622282": 3,
            "622318": 3,
            "622778": 3,
            "628207": 3,
            "628379": 3,
            "625050": 3,
            "625836": 3,
            "628367": 3,
            "628333": 3,
            "622921": 3,
            "628321": 3,
            "625598": 3,
            "622286": 3,
            "628236": 3,
            "625800": 3,
            "621777": 2,
            "628228": 3,
            "622813": 3,
            "622818": 3,
            "628359": 3,
            "628270": 3,
            "628311": 3,
            "628261": 3,
            "628251": 3,
            "622651": 3,
            "625828": 3,
            "625652": 3,
            "625700": 3,
            "622613": 3,
            "628220": 3,
            "622809": 3,
            "628224": 3,
            "625119": 3,
            "625577": 3,
            "625952": 3,
            "621752": 2,
            "628213": 3,
            "628263": 3,
            "628305": 3,
            "628239": 3,
            "628238": 3,
            "628257": 3,
            "622817": 3,
            "628287": 3,
            "625959": 3,
            "62536601": 3,
            "628391": 3,
            "628233": 3,
            "628231": 3,
            "628275": 3,
            "622565": 3,
            "622287": 3,
            "622717": 3,
            "628252": 3,
            "628306": 3,
            "628227": 3,
            "623001": 2,
            "628234": 3,
            "621727": 2,
            "623128": 2,
            "628237": 3,
            "628219": 3,
            "621456": 2,
            "621562": 2,
            "622270": 3,
            "628368": 3,
            "625588": 3,
            "625090": 3,
            "62536602": 3,
            "628293": 3,
            "622611": 3,
            "622722": 3,
            "628211": 3,
            "625500": 3,
            "625989": 3,
            "625080": 3,
            "628235": 3,
            "628322": 3,
            "625088": 3,
            "622469": 3,
            "628307": 3,
            "628229": 3,
            "628397": 3,
            "622802": 3,
            "622290": 3,
            "628232": 3,
            "625128": 3,
            "622829": 3,
            "625819": 3,
            "628301": 3,
            "622808": 3,
            "628308": 3,
            "623088": 2,
            "622815": 3,
            "622816": 3,
            "628226": 3,
            "628223": 3,
            "621416": 2,
            "628217": 3,
            "628382": 3,
            "625158": 3,
            "622569": 3,
            "628369": 3,
            "628386": 3,
            "625519": 3,
            "625506": 3,
            "622906": 3,
            "628392": 3,
            "623092": 2,
            "621778": 2,
            "620528": 2,
            "621748": 2,
            "628271": 3,
            "628328": 3,
            "622790": 3,
            "623251": 2,
            "623165": 2,
            "628351": 3,
            "621635109": 2,
            "621635108": 2,
            "62163121": 2,
            "62316904": 2,
            "62316905": 2,
            "62316902": 2,
            "62316903": 2,
            "62316901": 2,
            "62316906": 2,
            "62361026": 2,
            "62361025": 2,
            "62168305": 2
        };
        var cardList = {
            "621098": 24,
            "622150": 24,
            "622151": 24,
            "622181": 24,
            "622188": 24,
            "955100": 24,
            "621095": 24,
            "620062": 24,
            "621285": 24,
            "621798": 24,
            "621799": 24,
            "621797": 24,
            "620529": 24,
            "622199": 24,
            "621096": 24,
            "621622": 24,
            "623219": 24,
            "621674": 24,
            "623218": 24,
            "621599": 24,
            "370246": 4,
            "370248": 4,
            "370249": 4,
            "427010": 4,
            "427018": 4,
            "427019": 4,
            "427020": 4,
            "427029": 4,
            "427030": 4,
            "427039": 4,
            "370247": 4,
            "438125": 4,
            "438126": 4,
            "451804": 4,
            "451810": 4,
            "451811": 4,
            "45806": 4,
            "458071": 4,
            "489734": 4,
            "489735": 4,
            "489736": 4,
            "510529": 4,
            "427062": 4,
            "524091": 4,
            "427064": 4,
            "530970": 4,
            "53098": 4,
            "530990": 4,
            "558360": 4,
            "620200": 4,
            "620302": 4,
            "620402": 4,
            "620403": 4,
            "620404": 4,
            "524047": 4,
            "620406": 4,
            "620407": 4,
            "525498": 4,
            "620409": 4,
            "620410": 4,
            "620411": 4,
            "620412": 4,
            "620502": 4,
            "620503": 4,
            "620405": 4,
            "620408": 4,
            "620512": 4,
            "620602": 4,
            "620604": 4,
            "620607": 4,
            "620611": 4,
            "620612": 4,
            "620704": 4,
            "620706": 4,
            "620707": 4,
            "620708": 4,
            "620709": 4,
            "620710": 4,
            "620609": 4,
            "620712": 4,
            "620713": 4,
            "620714": 4,
            "620802": 4,
            "620711": 4,
            "620904": 4,
            "620905": 4,
            "621001": 4,
            "620902": 4,
            "621103": 4,
            "621105": 4,
            "621106": 4,
            "621107": 4,
            "621102": 4,
            "621203": 4,
            "621204": 4,
            "621205": 4,
            "621206": 4,
            "621207": 4,
            "621208": 4,
            "621209": 4,
            "621210": 4,
            "621302": 4,
            "621303": 4,
            "621202": 4,
            "621305": 4,
            "621306": 4,
            "621307": 4,
            "621309": 4,
            "621311": 4,
            "621313": 4,
            "621211": 4,
            "621315": 4,
            "621304": 4,
            "621402": 4,
            "621404": 4,
            "621405": 4,
            "621406": 4,
            "621407": 4,
            "621408": 4,
            "621409": 4,
            "621410": 4,
            "621502": 4,
            "621317": 4,
            "621511": 4,
            "621602": 4,
            "621603": 4,
            "621604": 4,
            "621605": 4,
            "621608": 4,
            "621609": 4,
            "621610": 4,
            "621611": 4,
            "621612": 4,
            "621613": 4,
            "621614": 4,
            "621615": 4,
            "621616": 4,
            "621617": 4,
            "621607": 4,
            "621606": 4,
            "621804": 4,
            "621807": 4,
            "621813": 4,
            "621814": 4,
            "621817": 4,
            "621901": 4,
            "621904": 4,
            "621905": 4,
            "621906": 4,
            "621907": 4,
            "621908": 4,
            "621909": 4,
            "621910": 4,
            "621911": 4,
            "621912": 4,
            "621913": 4,
            "621915": 4,
            "622002": 4,
            "621903": 4,
            "622004": 4,
            "622005": 4,
            "622006": 4,
            "622007": 4,
            "622008": 4,
            "622010": 4,
            "622011": 4,
            "622012": 4,
            "621914": 4,
            "622015": 4,
            "622016": 4,
            "622003": 4,
            "622018": 4,
            "622019": 4,
            "622020": 4,
            "622102": 4,
            "622103": 4,
            "622104": 4,
            "622105": 4,
            "622013": 4,
            "622111": 4,
            "622114": 4,
            "622200": 4,
            "622017": 4,
            "622202": 4,
            "622203": 4,
            "622208": 4,
            "622210": 4,
            "622211": 4,
            "622212": 4,
            "622213": 4,
            "622214": 4,
            "622110": 4,
            "622220": 4,
            "622223": 4,
            "622225": 4,
            "622229": 4,
            "622230": 4,
            "622231": 4,
            "622232": 4,
            "622233": 4,
            "622234": 4,
            "622235": 4,
            "622237": 4,
            "622215": 4,
            "622239": 4,
            "622240": 4,
            "622245": 4,
            "622224": 4,
            "622303": 4,
            "622304": 4,
            "622305": 4,
            "622306": 4,
            "622307": 4,
            "622308": 4,
            "622309": 4,
            "622238": 4,
            "622314": 4,
            "622315": 4,
            "622317": 4,
            "622302": 4,
            "622402": 4,
            "622403": 4,
            "622404": 4,
            "622313": 4,
            "622504": 4,
            "622505": 4,
            "622509": 4,
            "622513": 4,
            "622517": 4,
            "622502": 4,
            "622604": 4,
            "622605": 4,
            "622606": 4,
            "622510": 4,
            "622703": 4,
            "622715": 4,
            "622806": 4,
            "622902": 4,
            "622903": 4,
            "622706": 4,
            "623002": 4,
            "623006": 4,
            "623008": 4,
            "623011": 4,
            "623012": 4,
            "622904": 4,
            "623015": 4,
            "623100": 4,
            "623202": 4,
            "623301": 4,
            "623400": 4,
            "623500": 4,
            "623602": 4,
            "623803": 4,
            "623901": 4,
            "623014": 4,
            "624100": 4,
            "624200": 4,
            "624301": 4,
            "624402": 4,
            "62451804": 4,
            "62451810": 4,
            "62451811": 4,
            "6245806": 4,
            "62458071": 4,
            "6253098": 4,
            "623700": 4,
            "628288": 4,
            "624000": 4,
            "9558": 4,
            "628286": 4,
            "622206": 4,
            "621225": 4,
            "526836": 4,
            "513685": 4,
            "543098": 4,
            "458441": 4,
            "620058": 4,
            "621281": 4,
            "622246": 4,
            "900000": 4,
            "544210": 4,
            "548943": 4,
            "370267": 4,
            "621558": 4,
            "621559": 4,
            "621722": 4,
            "621723": 4,
            "620086": 4,
            "621226": 4,
            "402791": 4,
            "427028": 4,
            "427038": 4,
            "548259": 4,
            "356879": 4,
            "356880": 4,
            "356881": 4,
            "356882": 4,
            "528856": 4,
            "621618": 4,
            "620516": 4,
            "621227": 4,
            "621721": 4,
            "900010": 4,
            "625330": 4,
            "625331": 4,
            "625332": 4,
            "623062": 4,
            "622236": 4,
            "621670": 4,
            "524374": 4,
            "550213": 4,
            "374738": 4,
            "374739": 4,
            "621288": 4,
            "625708": 4,
            "625709": 4,
            "622597": 4,
            "622599": 4,
            "360883": 4,
            "360884": 4,
            "625865": 4,
            "625866": 4,
            "625899": 4,
            "103": 3,
            "552599": 3,
            "6349102": 3,
            "6353591": 3,
            "623206": 3,
            "621671": 3,
            "620059": 3,
            "403361": 3,
            "404117": 3,
            "404118": 3,
            "404119": 3,
            "404120": 3,
            "404121": 3,
            "463758": 3,
            "49102": 3,
            "514027": 3,
            "519412": 3,
            "519413": 3,
            "520082": 3,
            "520083": 3,
            "53591": 3,
            "558730": 3,
            "621282": 3,
            "621336": 3,
            "621619": 3,
            "622821": 3,
            "622822": 3,
            "622823": 3,
            "622824": 3,
            "622825": 3,
            "622826": 3,
            "622827": 3,
            "622828": 3,
            "622836": 3,
            "622837": 3,
            "622840": 3,
            "622841": 3,
            "622843": 3,
            "622844": 3,
            "622845": 3,
            "622846": 3,
            "622847": 3,
            "622848": 3,
            "622849": 3,
            "623018": 3,
            "625996": 3,
            "625997": 3,
            "625998": 3,
            "628268": 3,
            "95595": 3,
            "95596": 3,
            "95597": 3,
            "95598": 3,
            "95599": 3,
            "621660": 2,
            "621661": 2,
            "621662": 2,
            "621663": 2,
            "621665": 2,
            "621667": 2,
            "621668": 2,
            "621669": 2,
            "621666": 2,
            "625908": 2,
            "625910": 2,
            "625909": 2,
            "356833": 2,
            "356835": 2,
            "409665": 2,
            "409666": 2,
            "409668": 2,
            "409669": 2,
            "409670": 2,
            "409671": 2,
            "409672": 2,
            "456351": 2,
            "512315": 2,
            "512316": 2,
            "512411": 2,
            "512412": 2,
            "514957": 2,
            "409667": 2,
            "518378": 2,
            "518379": 2,
            "518474": 2,
            "518475": 2,
            "518476": 2,
            "438088": 2,
            "524865": 2,
            "525745": 2,
            "525746": 2,
            "547766": 2,
            "552742": 2,
            "553131": 2,
            "558868": 2,
            "514958": 2,
            "622752": 2,
            "622753": 2,
            "622755": 2,
            "524864": 2,
            "622757": 2,
            "622758": 2,
            "622759": 2,
            "622760": 2,
            "622761": 2,
            "622762": 2,
            "622763": 2,
            "601382": 2,
            "622756": 2,
            "628388": 2,
            "621256": 2,
            "621212": 2,
            "620514": 2,
            "622754": 2,
            "622764": 2,
            "518377": 2,
            "622765": 2,
            "622788": 2,
            "621283": 2,
            "620061": 2,
            "621725": 2,
            "620040": 2,
            "558869": 2,
            "621330": 2,
            "621331": 2,
            "621332": 2,
            "621333": 2,
            "621297": 2,
            "377677": 2,
            "621568": 2,
            "621569": 2,
            "625905": 2,
            "625906": 2,
            "625907": 2,
            "628313": 2,
            "625333": 2,
            "628312": 2,
            "623208": 2,
            "621620": 2,
            "621756": 2,
            "621757": 2,
            "621758": 2,
            "621759": 2,
            "621785": 2,
            "621786": 2,
            "621787": 2,
            "621788": 2,
            "621789": 2,
            "621790": 2,
            "621672": 2,
            "625337": 2,
            "625338": 2,
            "625568": 2,
            "5453242": 5,
            "5491031": 5,
            "5544033": 5,
            "622725": 5,
            "622728": 5,
            "621284": 5,
            "421349": 5,
            "434061": 5,
            "434062": 5,
            "436728": 5,
            "436742": 5,
            "453242": 5,
            "491031": 5,
            "524094": 5,
            "526410": 5,
            "53242": 5,
            "53243": 5,
            "544033": 5,
            "552245": 5,
            "589970": 5,
            "620060": 5,
            "621080": 5,
            "621081": 5,
            "621466": 5,
            "621467": 5,
            "621488": 5,
            "621499": 5,
            "621598": 5,
            "621621": 5,
            "621700": 5,
            "622280": 5,
            "622700": 5,
            "622707": 5,
            "622966": 5,
            "622988": 5,
            "625955": 5,
            "625956": 5,
            "553242": 5,
            "621082": 5,
            "621673": 5,
            "623211": 5,
            "356896": 5,
            "356899": 5,
            "356895": 5,
            "436718": 5,
            "436738": 5,
            "436745": 5,
            "436748": 5,
            "489592": 5,
            "531693": 5,
            "532450": 5,
            "532458": 5,
            "544887": 5,
            "552801": 5,
            "557080": 5,
            "558895": 5,
            "559051": 5,
            "622166": 5,
            "622168": 5,
            "622708": 5,
            "625964": 5,
            "625965": 5,
            "625966": 5,
            "628266": 5,
            "628366": 5,
            "625362": 5,
            "625363": 5,
            "628316": 5,
            "628317": 5,
            "620021": 11,
            "620521": 11,
            "00405512": 11,
            "0049104": 11,
            "0053783": 11,
            "00601428": 11,
            "405512": 11,
            "434910": 11,
            "458123": 11,
            "458124": 11,
            "49104": 11,
            "520169": 11,
            "522964": 11,
            "53783": 11,
            "552853": 11,
            "601428": 11,
            "622250": 11,
            "622251": 11,
            "521899": 11,
            "622254": 11,
            "622255": 11,
            "622256": 11,
            "622257": 11,
            "622258": 11,
            "622259": 11,
            "622253": 11,
            "622261": 11,
            "622284": 11,
            "622656": 11,
            "628216": 11,
            "622252": 11,
            "66405512": 11,
            "6649104": 11,
            "622260": 11,
            "66601428": 11,
            "955590": 11,
            "955591": 11,
            "955592": 11,
            "955593": 11,
            "6653783": 11,
            "628218": 11,
            "622262": 11,
            "433670": 13,
            "433680": 13,
            "442729": 13,
            "442730": 13,
            "620082": 13,
            "622690": 13,
            "622691": 13,
            "622692": 13,
            "622696": 13,
            "622698": 13,
            "622998": 13,
            "622999": 13,
            "433671": 13,
            "968807": 13,
            "968808": 13,
            "968809": 13,
            "621771": 13,
            "621767": 13,
            "621768": 13,
            "621770": 13,
            "621772": 13,
            "621773": 13,
            "620527": 13,
            "303": 12,
            "356837": 12,
            "356838": 12,
            "486497": 12,
            "622660": 12,
            "622662": 12,
            "622663": 12,
            "622664": 12,
            "622665": 12,
            "622666": 12,
            "622667": 12,
            "622669": 12,
            "622670": 12,
            "622671": 12,
            "622672": 12,
            "622668": 12,
            "622661": 12,
            "622674": 12,
            "90030": 12,
            "622673": 12,
            "620518": 12,
            "621489": 12,
            "621492": 12,
            "620535": 12,
            "623156": 12,
            "621490": 12,
            "621491": 12,
            "620085": 12,
            "623155": 12,
            "623157": 12,
            "623158": 12,
            "623159": 12,
            "999999": 18,
            "621222": 18,
            "623020": 18,
            "623021": 18,
            "623022": 18,
            "623023": 18,
            "622630": 18,
            "622631": 18,
            "622632": 18,
            "622633": 18,
            "622615": 20,
            "622616": 20,
            "622618": 20,
            "622622": 20,
            "622617": 20,
            "622619": 20,
            "415599": 20,
            "421393": 20,
            "421865": 20,
            "427570": 20,
            "427571": 20,
            "472067": 20,
            "472068": 20,
            "622620": 20,
            "621691": 20,
            "545392": 20,
            "545393": 20,
            "545431": 20,
            "545447": 20,
            "356859": 20,
            "356857": 20,
            "407405": 20,
            "421869": 20,
            "421870": 20,
            "421871": 20,
            "512466": 20,
            "356856": 20,
            "528948": 20,
            "552288": 20,
            "622600": 20,
            "622601": 20,
            "622602": 20,
            "517636": 20,
            "622621": 20,
            "628258": 20,
            "556610": 20,
            "622603": 20,
            "464580": 20,
            "464581": 20,
            "523952": 20,
            "545217": 20,
            "553161": 20,
            "356858": 20,
            "622623": 20,
            "625911": 20,
            "377152": 20,
            "377153": 20,
            "377158": 20,
            "377155": 20,
            "625912": 20,
            "625913": 20,
            "406365": 14,
            "406366": 14,
            "428911": 14,
            "436768": 14,
            "436769": 14,
            "487013": 14,
            "491032": 14,
            "491034": 14,
            "491035": 14,
            "491036": 14,
            "491037": 14,
            "491038": 14,
            "518364": 14,
            "520152": 14,
            "520382": 14,
            "548844": 14,
            "552794": 14,
            "622555": 14,
            "622556": 14,
            "622557": 14,
            "622558": 14,
            "622559": 14,
            "622560": 14,
            "622568": 14,
            "528931": 14,
            "9111": 14,
            "558894": 14,
            "625072": 14,
            "625071": 14,
            "628260": 14,
            "628259": 14,
            "621462": 14,
            "625805": 14,
            "625806": 14,
            "625807": 14,
            "625808": 14,
            "625809": 14,
            "625810": 14,
            "685800": 14,
            "620037": 14,
            "6858000": 14,
            "6858001": 14,
            "6858009": 14,
            "623506": 14,
            "356885": 6,
            "356886": 6,
            "356887": 6,
            "356888": 6,
            "356890": 6,
            "402658": 6,
            "410062": 6,
            "439188": 6,
            "439227": 6,
            "468203": 6,
            "479228": 6,
            "479229": 6,
            "512425": 6,
            "521302": 6,
            "524011": 6,
            "356889": 6,
            "545620": 6,
            "545621": 6,
            "545947": 6,
            "545948": 6,
            "552534": 6,
            "552587": 6,
            "622575": 6,
            "622576": 6,
            "622577": 6,
            "622579": 6,
            "622580": 6,
            "545619": 6,
            "622581": 6,
            "622582": 6,
            "622588": 6,
            "622598": 6,
            "622609": 6,
            "690755": 6,
            "95555": 6,
            "545623": 6,
            "621286": 6,
            "620520": 6,
            "621483": 6,
            "621485": 6,
            "621486": 6,
            "628290": 6,
            "622578": 6,
            "90592": 9,
            "966666": 9,
            "622909": 9,
            "622908": 9,
            "438588": 9,
            "438589": 9,
            "461982": 9,
            "486493": 9,
            "486494": 9,
            "486861": 9,
            "523036": 9,
            "451289": 9,
            "527414": 9,
            "528057": 9,
            "622901": 9,
            "622922": 9,
            "628212": 9,
            "451290": 9,
            "524070": 9,
            "625084": 9,
            "625085": 9,
            "625086": 9,
            "625087": 9,
            "548738": 9,
            "549633": 9,
            "552398": 9,
            "625082": 9,
            "625083": 9,
            "625960": 9,
            "625961": 9,
            "625962": 9,
            "625963": 9,
            "356851": 15,
            "356852": 15,
            "404738": 15,
            "404739": 15,
            "456418": 15,
            "498451": 15,
            "515672": 15,
            "356850": 15,
            "517650": 15,
            "525998": 15,
            "622177": 15,
            "622277": 15,
            "622516": 15,
            "622518": 15,
            "622520": 15,
            "622521": 15,
            "622522": 15,
            "622523": 15,
            "628222": 15,
            "84301": 15,
            "84336": 15,
            "84373": 15,
            "628221": 15,
            "84385": 15,
            "84390": 15,
            "87000": 15,
            "87010": 15,
            "87030": 15,
            "87040": 15,
            "84380": 15,
            "984301": 15,
            "984303": 15,
            "84361": 15,
            "87050": 15,
            "622176": 15,
            "622276": 15,
            "622228": 15,
            "621352": 15,
            "621351": 15,
            "621390": 15,
            "621792": 15,
            "625957": 15,
            "625958": 15,
            "621791": 15,
            "84342": 15,
            "620530": 15,
            "625993": 15,
            "622519": 15,
            "621793": 15,
            "621795": 15,
            "621796": 15,
            "622500": 15,
            "623183": 22,
            "623185": 22,
            "621005": 22,
            "622172": 22,
            "622985": 22,
            "622987": 22,
            "622267": 22,
            "622278": 22,
            "622279": 22,
            "622468": 22,
            "622892": 22,
            "940021": 22,
            "621050": 22,
            "620522": 22,
            "356827": 22,
            "356828": 22,
            "356830": 22,
            "402673": 22,
            "402674": 22,
            "438600": 22,
            "486466": 22,
            "519498": 22,
            "520131": 22,
            "524031": 22,
            "548838": 22,
            "622148": 22,
            "622149": 22,
            "622268": 22,
            "356829": 22,
            "622300": 22,
            "628230": 22,
            "622269": 22,
            "625099": 22,
            "625953": 22,
            "625350": 22,
            "625351": 22,
            "625352": 22,
            "519961": 22,
            "625839": 22,
            "421317": 10,
            "602969": 10,
            "621030": 10,
            "621420": 10,
            "621468": 10,
            "623111": 10,
            "422160": 10,
            "422161": 10,
            "621279": 23,
            "622281": 23,
            "622316": 23,
            "940022": 23,
            "621418": 23,
            "512431": 23,
            "520194": 23,
            "621626": 19,
            "623058": 19,
            "602907": 19,
            "622986": 19,
            "622989": 19,
            "622298": 19,
            "623251": 5
        };
        var cardKey = null;

        for (var i = 9; i >= 4; --i) {
            var cardHead = bank_card.substr(0, i);

            if (typeof(cardList[cardHead]) != 'undefined') {
                cardKey = cardHead;
            }
        }
        if(!cardKey){
            alert("您输入的银行卡号暂未匹配到开户行,请换一张银行卡");
            $("#bank_card").focus();
            return;
        } else {
            // bank_card_type_id = bankCardType[cardKey];
            bank_type_id = cardList[cardKey];
            console.log(bankCardType[cardKey]);
            $("#bank_card_create_addr").val(bankList[cardList[cardKey]]);
            $(".input_finance_info .bank_card_type input[value='"+bankCardType[cardKey]+"']").parent().addClass('on_radio').siblings().removeClass('on_radio');
            $("#bank_card_create_addr").css({
                "background": '#e3e3e3'
            });
            $(".bank_card_warn .warning").hide();
        }
    });
    $("#real_name").focus(function(event) {
        // $(".real_name_warn .warning").hide();
        $('.Name_attension > div').css('color','#999');
    });
    $("#id_card").focus(function(event) {
        $(".id_card_warn .warning").hide();
    });
    $("#finance_phone").focus(function(event) {
        $(".finance_phone_warn .warning").hide();
    });
    $("#verify_code").focus(function(event) {
        $(".verify_code_warn .warning").hide();
    });
    $('#input_finance_info .submit_button').on('click', function(event) {
        if(!$("#real_name").val() || $("#real_name").val() == ''){
            // alert('真实姓名为必填选项！');
            $('.Name_attension > div').css('color','red');
            return;
        }else{
            $('.Name_attension > div').css('color','#999');
        }
        if(!$("#id_card").val() || $("#id_card").val() == '' || !IdentityCodeValid(trimStr($("#id_card").val()))){
            $(".id_card_warn .warning").show();
            return;
        }else{
            $(".id_card_warn .warning").hide();
        }
        if(!$("#bank_card").val() || $("#bank_card").val() == ''){
            $(".bank_card_warn .warning").show();
            return;
        }
        if ($('.finance_phone').val() == '' || !checkTel($('.finance_phone').val())) {
            $(".finance_phone_warn .warning").show();
            return;
        }else{
            $(".finance_phone_warn .warning").hide();
        }
        if(!$('#verify_code').val() || $('#verify_code').val() == ''){
            $(".verify_code_warn .warning").show();
            return;
        }else{
            $(".verify_code_warn .warning").hide();
        }
        var real_name = $("#real_name").val();
        var id_card_type_id = $(".id_card_type").eq(0).find('.on_radio').children(0).val();
        var id_card_value = $("#id_card").val();
        var bank_cards = $("#bank_card").val();
        var bank_card_type_id = $(".bank_card_type").eq(0).find('.on_radio').children(0).val();
        var reserve_phone = $(".finance_phone").val();
        var verify_code = $('#verify_code').val();

        $.ajax({
            url:  BASEURL + 'admin/api/addFinanceInfo',
            type: 'POST',
            dataType: 'json',
            data: {
                real_name:real_name,
                id_card_type_id: id_card_type_id,
                id_card_value: id_card_value,
                bank_card: bank_cards,
                bank_type_id: bank_type_id,
                bank_card_type_id: bank_card_type_id,
                reserve_phone: reserve_phone,
                verify_code:verify_code
            },
        })
        .done(function(data) {
            //console.log(data);
            if(data.success == true){
                alert("保存成功");
            }
            if(data.status == -3){
                alert(data.errMsg);
            }
        })
        .fail(function() {
            console.log("error");
        })

    });
};
/**
 * [initAddMessage: Initiate add message page]
 * @return {[type]} [description]
 */
business.initAddMessage = function() {
    var handleType = {
        editMessage: {
            title: '编辑广告',
            buttonName: '编辑',
            description: '<p>编辑后，我们将在24小时内给您审核。</p>',
            postFunc: function initEditBtn() {
                /** unbind first */
                $('.dialog .send-btn').unbind('click');

                /** then bind */
                $('.dialog .send-btn').click(function(event) {
                    if ($(this).attr('disabled') == 'true') {
                        return false;
                    }

                    if (!checkUri($('#addMessageForm #link-content').val())) {
                        showError('请填写正确的网页链接');
                        return;
                    }

                    $('.dialog .send-btn').css({
                        color: '#fff',
                        'background-color': '#999',
                        'border': '#999'
                    }).text("编辑中").attr('disabled', 'true');
                    /* Act on the event */
                    var formData = new FormData($('.dialog #addMessageForm')[0]);
                    $.ajax({
                            url: BASEURL + 'admin/api/updateMessage',
                            type: 'POST',
                            dataType: 'json',
                            data: formData,
                            cache: false,
                            contentType: false,
                            processData: false
                        })
                        .done(function(data) {
                            if (data.success) {
                                /** do something for success return */
                                showError('编辑成功', true);
                                $('.dialog .send-btn').css({
                                    color: '#6799ff',
                                    'background-color': '#fff',
                                    'border': '1px solid #6799ff'
                                }).text("编辑").attr('disabled', 'false');
                            } else {
                                $('.dialog .send-btn').css({
                                    color: '#6799ff',
                                    'background-color': '#fff',
                                    'border': '1px solid #6799ff'
                                }).text("编辑").attr('disabled', 'false');
                                showError(data.errMsg);
                            }
                        })
                        .fail(function(data) {
                            $('.dialog .send-btn').css({
                                color: '#6799ff',
                                'background-color': '#fff'
                            }).text("编辑").attr('disabled', 'false');
                            showError(data.errMsg);
                        })
                });
            }
        },
        addMessage: {
            title: '添加广告',
            formID: 'addMessageForm',
            buttonName: '添加',
            description: '<p>如果您是app开发商，请您正确填写app名称、平台信息及app的详细介绍，<br />我们将在24小时内给您审核。如果您是开发商，请您重新登陆。</p>',
            postFunc: function initAddBtn() {
                /** unbind first */
                $('.dialog .send-btn').unbind('click');

                /** then bind */
                $('.dialog .send-btn').click(function(event) {
                    if ($(this).attr('disabled') == 'true') {
                        return false;
                    }

                    /* Act on the event */
                    if ($('#addMessageForm #shop_name').val() == "") {
                        showError('请填写商家名称');
                        return;
                    }

                    if ($('#addMessageForm #message_description').val() == "") {
                        showError('请填写广告介绍');
                        return;
                    } else {
                        if ($('#addMessageForm #message_description').val().length > 200) {
                            showError('不能有多于200字的广告介绍');
                            return;
                        }
                    }

                    var selectedVal = $(".dialog .message-tab .active").attr('value');
                    switch (selectedVal) {
                        case '1':
                            {
                                if ($('#addMessageForm #other-content').val() == "") {
                                    showError('请填写推送的内容');
                                    return;
                                }

                                break;
                            }
                        case '2':
                            {
                                var link = $('#addMessageForm #link-content').val();
                                if (link == "") {
                                    showError('请填写推送的网页链接');
                                    return;
                                }

                                if (!checkUri(link)) {
                                    showError('请填写正确的网页链接');
                                    return;
                                }

                                break;
                            }
                        default:
                            break;
                    }

                    $('.dialog .send-btn').css({
                        color: '#fff',
                        'background-color': '#999',
                        'border': '#999'
                    }).text("添加中");

                    var formData = new FormData($('.dialog #addMessageForm')[0]);
                    $.ajax({
                            url: BASEURL + 'admin/api/addMessage',
                            type: 'POST',
                            dataType: 'json',
                            data: formData,
                            cache: false,
                            contentType: false,
                            processData: false
                        })
                        .done(function(data) {
                            if (data.success) {
                                /** do something for success return */
                                /** clear */
                                showError('添加成功', true);
                                $('.dialog .send-btn').css({
                                    color: '#6799ff',
                                    'background-color': '#fff',
                                    'border': '1px solid #6799ff'
                                }).text("添加");
                                removeAll();
                            } else {
                                showError(data.errMsg);
                                $('.dialog .send-btn').css({
                                    color: '#6799ff',
                                    'background-color': '#fff',
                                    'border': '1px solid #6799ff'
                                }).text("添加");
                            }
                        })
                        .fail(function() {
                            showError('服务器错误');
                        })
                });
            }
        }
    };

    /**
     * [removeAll: remove all the history]
     * @return {[type]} [description]
     */
    function removeAll() {
        $('.dialog .content input, .dialog .content textarea').val('');
    }

    /**
     * [init: function to initiate]
     * @return {[type]} [description]
     */
    function init() {
        var dlgtrigger = document.querySelector('[data-dialog]');
        if (dlgtrigger) {
            var somedialog = document.getElementById(dlgtrigger.getAttribute('data-dialog'));
            var dlg = new DialogFx(somedialog, {
                onCloseDialog: function() {
                    if ($('.dialog .back-btn').attr('refresh') == 'true') {
                        window.location.href = BASEURL + 'admin/messageList';
                    }
                }
            });
            dlgtrigger.addEventListener('click', function() {
                var pageType = $(this).attr('handleType') || 'addMessage';
                var messageID = $(this).attr('messageID') || '0';
                initInterface(pageType, messageID, function() {
                    dlg.toggle.bind(dlg)();
                });
            });
        }
    }

    /**
     * [initInterface: init the interface]
     * @return {[type]} [description]
     */
    function initInterface(pageType, messageID, callback) {
        /** don't reset all things */
        if ($('.dialog #err-main').css('display') == 'block') {
            callback();
            return;
        }

        /** clear all input */
        removeAll();

        /** main-title */
        $('.dialog #main .main-title').text(handleType[pageType].title);

        /** send-btn */
        $('.dialog .send-btn').text(handleType[pageType].buttonName);

        /** notice */
        $('.dialog .notice').html(handleType[pageType].description);

        /** initiate the button */
        handleType[pageType].postFunc();

        /** initiate basic info of app when handling edition */
        if (pageType == 'editMessage') {
            /** loading */
            $('.loading-area').fadeIn();
            /** get the basic message info which will be the first one when messageID is 0 */
            $.ajax({
                    url: BASEURL + 'admin/api/getMessageInfo',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        messageID: messageID
                    },
                })
                .done(function(data) {
                    if (data.success) {
                        /** [switch: intiate the info] */
                        $('.dialog #message_id').val(data.info.id);

                        $('.dialog .content #shop_name').val(data.info.shop_name);
                        $('.dialog .content #message_description').val(data.info.description);
                        switch (data.info.message_type_id) {
                            case 1:
                                {
                                    /** IOS */
                                    $('.dialog .content #other-content').val(data.info.content);
                                    break;
                                }
                            case 2:
                                {
                                    /** Android */
                                    $('.dialog .content #link-content').val(data.info.content);
                                    break;
                                }
                            default:
                                break;
                        }

                        /** choose the terminal system finally */
                        $('.dialog .message-tab > ul > li').each(function(index, el) {
                            if ($(this).attr('value') == data.info.message_type_id) {
                                $(this).click();
                            }
                        });

                        /** display loading */
                        $('.loading-area').fadeOut();

                        callback();
                    }
                })
                .fail(function() {
                    console.log("error");
                });
        } else {
            $('.dialog .message-tab > ul > li:first-of-type()').click();

            callback();
        }
    }

    /**
     * [initMessageChoose: init the tab area for choosing message]
     * @return {[type]} [description]
     */
    function initMessageChoose() {
        /** choosing app */
        $('.message-tab ul > li').click(function(event) {
            /* Act on the event */
            /** add class of active */
            $('.message-tab ul > li').each(function() {
                $(this).removeClass('active');
            });

            $(this).addClass('active');

            /** show the area */
            $('.dialog .content .area').each(function() {
                $(this).hide();
            });

            $('.dialog .content #' + $(this).attr('area')).show();

            $('#message_type_id').val($(this).attr('value'));
        });
    }

    /**
     * [initTextarea: init the text area]
     * @return {[type]} [description]
     */
    function initTextarea() {
        /** Listen to the characters number of the textarea */
        var $countNum = $('.dialog .content .count-number');
        $('.dialog .content textarea').keydown(function() {
            if ($(this).val().length > 200) {
                $countNum.css({
                    color: '#fa6640'
                }).text(200 - $(this).val().length + '/200');
            } else {
                $countNum.css({
                    color: '#666'
                }).text(200 - $(this).val().length + '/200');
            }
        }).keyup(function() {
            if ($(this).val().length > 200) {
                $countNum.css({
                    color: '#fa6640'
                }).text(200 - $(this).val().length + '/200');
            } else {
                $countNum.css({
                    color: '#666'
                }).text(200 - $(this).val().length + '/200');
            }
        });
    }

    /**
     * [initUploadBtn: init the upload file btns]
     * @return {[type]} [description]
     */
    function initUploadBtn() {
        $('.dialog .content input[type="file"]').change(function() {
            $(this).prev().prev().addClass('selected').text('已选择');
        });
    }

    /**
     * [showError: show the err msg]
     * @param  {[type]} msg     [description]
     * @param  {[type]} refresh [description]
     * @return {[type]}         [description]
     */
    function showError(msg, refresh) {
        refresh = refresh || false;

        $('.dialog .dialog__content').hide().removeClass('shown');
        $('.dialog .back-btn').attr('refresh', refresh);
        var $errMain = $('.dialog #err-main');
        $errMain.children('.main-title').text(msg);
        $errMain.show().addClass('shown');
    }

    /**
     * [showMain: show the main part]
     * @return {[type]} [description]
     */
    function showMain() {
        $('.dialog .dialog__content').hide().removeClass('shown');
        $('.dialog #main').show().addClass('shown');
    }

    /**
     * [initBackBtn: go back to main]
     * @return {[type]} [description]
     */
    function initBackBtn() {
        var $backBtn = $('.dialog .back-btn');
        $backBtn.click(function(event) {
            /* Act on the event */
            if ($(this).attr('refresh') == 'true') {
                window.location.href = BASEURL + 'admin/messageList';
                return;
            }

            showMain();
        });
    }

    /**
     * [initShadow: init two shadows]
     * @return {[type]} [description]
     */
    function initShadow() {
        var $topShadow = $('.dialog .content .transition-pad');
        $topShadow.width($topShadow.parent().width() - 6);
    }

    /** call all the initate funcs */
    init();
    initMessageChoose();
    initTextarea();
    initUploadBtn();
    initBackBtn();
    initShadow();
};

business.initFinanceCenter = function(curPage, totalLen, perPage) {
    curPage = curPage || '1';
    totalLen = totalLen || '1';
    perPage = perPage || '1';
    if (parseInt(totalLen) > parseInt(perPage)) {
        $("div.bill_data_paging").jPages({
            containerID: "itemContainer",
            // pause       : 4000,
            clickStop: true,
            totalLen: parseInt(totalLen),
            perPage: parseInt(perPage),
            startPage: parseInt(curPage)
        });
    }
    /*$('.finance_tatol_data_withdraw button').click(function(event) {
        alert('请与我们的工作人员联系! 电话：0755-36536897');
    });*/

    // function withdrawError(word) {
    //     $(".withdraw_box button").html(word).css({
    //         'color':'red',
    //         'border':'1px solid red',
    //     });
    //     setTimeout(function(){
    //         $(".withdraw_box button").html("提现").css({
    //             'color':'#6799ff',
    //             'border':'1px solid #6799ff',
    //         });
    //     },3000);
    // }

    // $(".finance_total_module .finance_tatol_data_withdraw button").on('click',  function(event) {
    //     $(".withdraw_shadow").fadeIn('fast');
    //     $(".withdraw_box").fadeIn('fast');
    // });
    // $(".withdraw_box button").on('click',  function(event) {
    //     var money_cash = $("#input_withdraw_info input[type='number']").val();
    //     var password = $("#input_withdraw_info input[type='password']").val();
    //     if(!money_cash || money_cash == ''){
    //         withdrawError("金额错误");
    //         return;
    //     }
    //     if(!password || password == ''){
    //         withdrawError("密码错误");
    //         return;
    //     }
    //     $.ajax({
    //         url: BASEURL + 'admin/api/saveUserWithdrawRecord',
    //         type: 'POST',
    //         dataType: 'json',
    //         data: {
    //             money_cash: money_cash,
    //             password: password,
    //             money_handle_type_id: 3,
    //         },
    //     })
    //     .done(function(data) {
    //         console.log(data);
    //         if(data.success == true){
    //             $(".submit_withdraw #withdraw_cash").text('¥ ' + money_cash + '.00');
    //             $(".withdraw_box").fadeOut();
    //             $(".submit_withdraw").fadeIn();
    //         }else if(data.success == false && data.errCode == 306){
    //             withdrawError("银行卡号为空");
    //             window.location.href = BASEURL + 'admin/individual?go=financeSet';
    //         }else if(data.success == false && data.errCode == 305){
    //             withdrawError("密码错误");
    //             return;
    //         }
    //     })
    //     .fail(function() {
    //         console.log("error");
    //     })
    // });
    // $(".submit_withdraw button").on('click', function(event) {
    //     $(".submit_withdraw").fadeOut();
    //     $(".withdraw_shadow").fadeOut('fast');
    //     window.location.reload();
    // });

    // $(".close_withdraw_module").on('click',  function(event) {
    //     $(this).parent().fadeOut();
    //     $(".withdraw_shadow").fadeOut('fast');
    // });
    // $(".submit_withdraw .close_withdraw_module").on('click', function(event) {
    //     window.location.reload();
    // });

};

business.initMessageInfo = function(messageID) {
    messageID = messageID || '1';
    DateCharts(2, messageID);
    setBetweenTime();
    businessStatics(messageID);

    //MasterSecret隐藏字符
    // $("#app_detail_info .app_master_secret span:nth-child(2)").each(function() {
    //   var maxwidth = 30;
    //   if ($(this).text().length > maxwidth) {
    //     $(this).text($(this).text().substring(0, maxwidth));
    //     $(this).html($(this).html() + '...');
    //   }
    // });

    $("#dev_env").on('click', function(event) {
        $("#dev_env img").attr("src", BASEURL + "images/radioStyle_yes.png");
        $("#pro_env img").attr("src", BASEURL + "images/radioStyle_no.png");
    });
    $("#pro_env").on('click', function(event) {
        $("#pro_env img").attr("src", BASEURL + "images/radioStyle_yes.png");
        $("#dev_env img").attr("src", BASEURL + "images/radioStyle_no.png");
    });
    $('.back_app_list').click(function(event) {
        window.location.href = BASEURL + 'admin/messageList';
    });

    var isHover = false;
    $("#app_detail_info .app_master_secret span:nth-child(2)").hover(function(event) {
        /* Stuff to do when the mouse enters the element */
        var _this = $(this);
        var handle = function (event) {
            var offsetX = getOffsetX(event);
            var $detail = $("#master_secret_detail");
            var right = parseInt(_this.width() - offsetX - $detail.width() + (60 * _this.width() / 410.93)) + 'px';

            $detail.css('right', right).fadeIn(0);
        };

        handle();

        /** Listen to the mouse move event */
        $(this).mousemove(handle);
    }, function() {
        /* Stuff to do when the mouse leaves the element */
        setTimeout(function() {
            if (!isHover) {
                $("#master_secret_detail").fadeOut();
            }
        }, 500);
    });

    $("#master_secret_detail").hover(function() {
        /* Stuff to do when the mouse enters the element */
        isHover = true;
    }, function() {
        /* Stuff to do when the mouse leaves the element */
        isHover = false;
        $("#master_secret_detail").fadeOut();
    });

    $('.date_rage').on('click', '.submitTime', function(event) {
        var startdate = $(this).parent().find("#timeStart").val();
        var enddate = $(this).parent().find("#timeEnd").val();
        DateCharts(2, messageID, startdate, enddate);
    });

    $('.message_info_module').on('click', '.back_message_list', function(event) {
        event.preventDefault();
        window.location.href = BASEURL + 'admin/messageList';
    });

    // $('.app_info_module .push_test #push_addr button').click(function(event) {
    //     /* Act on the event */
    //     var $button = $(this);
    //     var deviceToken = $(this).prev().val();

    //     $button.text('推送中')
    //         .css({
    //             'background-color': '#ccc',
    //             'border': '1px solid #ccc',
    //             'color': '#fff'
    //         }).attr('disabled', 'disabled');

    //     $.ajax({
    //             url: BASEURL + 'api/sdkPushTest',
    //             type: 'POST',
    //             dataType: 'json',
    //             data: { 'deviceToken': deviceToken },
    //         })
    //         .done(function(data) {
    //             if (data.success) {
    //                 $button.text('推送成功');
    //             } else {
    //                 $button.text('推送失败');
    //             }
    //         })
    //         .fail(function() {
    //             $button.text('推送失败');
    //         })
    //         .always(function() {
    //             setTimeout(function() {
    //                 $button.text('推送')
    //                     .css({
    //                         'background-color': '#fff',
    //                         'border': '1px solid #6799ff',
    //                         'color': '#6799ff'
    //                     }).removeAttr('disabled');
    //             }, 1000);
    //         });
    // });

    function businessStatics(messageID) {
        $.ajax({
                url: BASEURL + 'admin/api/getBusinessStatisticInfo',
                type: 'POST',
                dataType: 'json',
                data: {
                    mid: messageID
                },
            })
            .done(function(data) {
                // console.log(data);
                if (data.success) {
                    var rate = data.result.conversion_rate*100;
                    var duration = Math.round(data.result.yesterdayDuration);
                    $('#message_basic_data').html('');
                    $('#message_basic_data').append('<p>基本指标&nbsp;&nbsp;(昨日)</p>\
                        <div>\
                         <ul class="basic_param">\
                             <li>推送次数</li>\
                             <li>浏览次数</li>\
                         </ul>\
                         <ul class="basic_data_num">\
                             <li>'+data.result.yesterdayPushTimes+'次</li>\
                             <li>'+data.result.yesterdayViewTimes+'次</li>\
                         </ul>\
                        </div>\
                        <div>\
                         <ul class="basic_param">\
                             <li>平均浏览时长</li>\
                             <li>平均转化率</li>\
                         </ul>\
                         <ul class="basic_data_num">\
                             <li>'+Math.floor(duration/60)+'分'+Math.floor(duration%60)+'秒</li>\
                             <li>'+rate+'%</li>\
                         </ul>\
                        </div> ');
                }
            })
            .fail(function() {
                console.log("error");
            })
    }
};

business.initMessageList = function(curPage, totalLen, perPage) {
    curPage = curPage || '1';
    totalLen = totalLen || '1';
    perPage = perPage || '1';

    //切换应用列表show条件
    $(".message_list_total_module .message_list_by_classify .list_classify").on('click', function(event) {
        event.preventDefault();
        /* Act on the event */
        if ($('#search-message').val() != '') {
            window.location.href = BASEURL + 'admin/messageList?sort=' + $(this).attr('type') + '&kw=' + $('#search-message').val();
        }

        window.location.href = BASEURL + 'admin/messageList?sort=' + $(this).attr('type');
    });

    if (parseInt(totalLen) > parseInt(perPage)) {
        $("div.message_list_paging").jPages({
            containerID: "itemContainer",
            // pause       : 1000,
            clickStop: true,
            totalLen: parseInt(totalLen),
            perPage: parseInt(perPage),
            startPage: parseInt(curPage)
        });
    }

    $('.message_list_total_module .message_operate .message_info_edit').click(function(event) {
        /* Act on the event */
        $('.nav_addmessage').attr('handleType', 'editMessage').attr('messageID', $(this).attr('messageID')).click().attr('handleType', 'addMessage').attr('messageID', '0');
    });

    $('.message_list_total_module .message_operate .message_info_delete').on('click', function(event) {
        /* Act on the event */
        var id = $(this).attr('messageID');
        var name = $(this).parent().siblings('.message_shop_name').html();
        if (deleteData(name)) {
            $.ajax({
                    url: BASEURL + 'admin/api/deleteMessage',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        id: id
                    },
                })
                .done(function(data) {
                    window.location.reload();
                })
                .fail(function() {
                    console.log("error");
                    alert("删除失败,请重新再试一次!");
                })
        } else {
            return false;
        }
    });

    $('.message_list_total_module .message_list_by_classify .message_list_search input + span').click(function(event) {
        /* Act on the event */
        window.location.href = BASEURL + 'admin/messageList?sort=' + $('.message_list_total_module .message_list_by_classify .button_backgro').attr('type') +  '&kw=' + urlencode($(this).prev().val());
    });

    $('.message_list_total_module #itemContainer .message_data_info').on('click', '.message_shop_name, .message_url, .message_type, .message_data', function(event) {
        event.preventDefault();
        window.location.href = BASEURL + 'admin/messageInfo?messageID=' + urlencode($(this).parent().attr('messageID'));
    });
    function deleteData(Messa) {
        if (confirm('你确定要删除' + Messa + '这条数据吗？')) {
            return true;
        } else {
            return false;
        }
    }
};

business.initDownload = function () {
    $('.down_container .subtitle > a').on('click', function(event) {
        window.location.href = BASEURL + 'admin/XADSevice';
    });
};

business.initBackSDK = function () {
    $('.doc_container .back_down > a').on('click', function(event) {
        window.location.href = BASEURL + 'admin/download';
    });
}

/*
*添加芯片
*/
business.initAddChip = function () {
    $('.loading-area').fadeIn(1000);
    this.leftMenu();
    getChipInfo();
    function getChipInfo() {
        $.ajax({
            url: BASEURL + 'admin/api/getChipTagByUser',
            type: 'POST',
            dataType: 'json'
        })
        .done(function(data) {
            var html = "";
            var result = data.result;
            for(var i = 0, len = result.length; i < len; i++) {
                var chipInfo = result[i];
                html += "<li id='cid-"+ chipInfo.id +"' data-chipno='" + chipInfo.chip_no + "'>" + chipInfo.chip_name + "</li>";
            }
            $(".list-children").html(html);
            business.chipSearch();
        })
        .fail(function() {
            console.log("error");
        });
    }

    // $.ajax({
    //     url: BASEURL + 'admin/api/chipLimitList',
    //     type: 'POST',
    //     dataType: 'json',
    // })
    // .done(function(data) {
    //     $('.loading-area').fadeOut(1000);
    //     if (data.success && data.errorCode === 200) {
    //         var shop = data.data;
    //         var shopstring = '';
    //         for (var i = 0, j = shop.length; i < j; i++) {
    //             shopstring += '<li class="shop">'+ shop[i].chip_name +'</li>'
    //             $('.shops').html(shopstring);
    //         }
    //         console.log(shop.length);
    //         if (shop.length > 12) {
    //             $('.see_more').show();
    //         }
    //     }
    // })
    // .fail(function() {
    //     console.log("error");
    // })
    $('.loading-area').fadeOut(1000);
    /**
     * add shop-code
     */

    $('#add-chip-code').on('click',function(event) {
        event.preventDefault();
        /* Act on the event */
        var chipCode = $('#chip-code-input').val();
        var chipName = $('#chip-name-input').val();

        if (!chipCode) {
            alert("请输入正确的芯片码");
            return;
        }

        if (!chipName) {
            alert("请输入正确的芯片名称");
            return;
        }

        if (chipName.length > 6) {
            alert("芯片名称应不长于6位");
            return;
        }

        $.ajax({
            url: BASEURL + 'admin/api/addChip',
            type: 'POST',
            dataType: 'json',
            data: {
                chip_no: chipCode,
                chip_name: chipName
            },
        })
        .done(function(data) {
            if (data.success) {
                $('#add_success').fadeIn();
                setTimeout(function () {
                    $('#add_success').fadeOut();
                },2000);
                $('.shops').prepend('<li class="shop">'+ chipName +'</li>');
                $('#chip-code-input').val('');
                $('#chip-name-input').val('');
                var liNum = $(".business_right .shops li").length;
                if(liNum > 10){
                    $(".business_right .see_more").show();
                }
            } else {
                alert('添加失败,请再试一次');
            }
        })
        .fail(function() {
            console.log("error");
        })
    });

    // 打开窗口
    $('.business_right .see_more a').on('click', function(event) {
        $('.loading-area').fadeIn();
        $(".withdraw_shadow").fadeIn('fast');
        $(".see_morechip_box").fadeIn('fast');
        // $.ajax({
        //     url: BASEURL + 'admin/api/chipList',
        //     type: 'POST',
        //     dataType: 'json',
        // })
        // .done(function(data) {
        //     $('.loading-area').fadeOut(1000);
        //     if (data.success) {
        //         var shop = data.data;
        //         var shopstring = '';
        //         for (var i = 0,j = shop.length; i < j; i++) {
        //             shopstring += '<li class="shop">'+ shop[i].chip_name +'</li>';
        //         }
        //         $('.see_morechip_box .shops').html(shopstring);
        //         $(".withdraw_shadow").fadeIn('fast');
        //         $(".see_morechip_box").fadeIn('fast');
        //     } else {
        //         alert('查看失败,请刷新一下');
        //     }
        // })
        // .fail(function() {
        //     console.log("error");
        // });
        $('.loading-area').fadeOut();
    });
    // 点击关闭按钮关闭窗口
    $(".see_morechip_box .close_btn").on('click',  function(event) {
        $(this).parent().fadeOut();
        $(".withdraw_shadow").fadeOut('fast');
    });
    // 点击遮罩关闭窗口
    $("#see_morechip_module .withdraw_shadow").on('click',  function(event) {
        $(".see_morechip_box").fadeOut();
        $(".withdraw_shadow").fadeOut('fast');
    });
};

/** 用户画像报表 */
business.initPortraits = function() {
    getChipInfo();
    $("#chip_no_form>a").on("click", function() {
        $("#chip_no_form").submit();
    });
    bindEvent();
    window.onscroll = function() {
        var t = document.documentElement.scrollTop || document.body.scrollTop;
        if (t >= 100) {
            $("#to-top").show();
        } else {
            $("#to-top").hide();
        }
    }
    $("#to-top").on("click", function() {
        document.documentElement.scrollTop = document.body.scrollTop =0;
    });
    this.leftMenu();
    rome(timeStart, {
        time: false,
        dateValidator: rome.val.beforeEq(timeEnd)
    });
    rome(timeEnd, {
        time: false,
        dateValidator: rome.val.afterEq(timeStart)
    });
    //获取左侧芯片列表
    function getChipInfo() {
        $.ajax({
            url: BASEURL + 'admin/api/getChipTagByUser',
            type: 'POST',
            dataType: 'json'
        })
        .done(function(data) {
            var html = "";
            var result = data.result;
            for(var i = 0, len = result.length; i < len; i++) {
                var chipInfo = result[i];
                html += "<li id='cid-"+ chipInfo.id +"' data-chipno='" + chipInfo.chip_no + "'>" + chipInfo.chip_name + "</li>";
            }
            $(".list-children").html(html);
            var date = new Date();
            var currentDate = date.format('yyyy-MM-dd');
            var weekago = new Date(date.getTime() - 1 * 24 * 3600 * 1000).format('yyyy-MM-dd');
            $(".list-header").on("click", function() {
                $(".select_msg .currentMsg_name").hide();
                getAllMacAndBaiduTagByUser("", "");
            });
            $(".list-children>li").on("click", function() {
                $(".select_msg .currentMsg_name").show();
                //get right data
                getMacInfoByChipNo("", "", $(this).data("chipno"));
                getMessageByChipID($(this).attr("id").replace("cid-",""));
            });
            var chipNo = $(".business_content>input").val();
            if(chipNo == ""){
                $(".list-header")[0].click();
            } else {
                $(".list-children>li[data-chipno="+chipNo+"]")[0].click();
            }
            business.chipSearch();
        })
        .fail(function() {
            console.log("error");
        });
    }

    // 获取所有数据（右侧）
    function getAllMacAndBaiduTagByUser(start_date, end_date){
        $.ajax({
            url: BASEURL + 'admin/api/getAllMacAndBaiduTagByUser',
            type: 'POST',
            dataType: 'json',
            data: {
                start_date: start_date,
                end_date: end_date
            }
        })
        .done(function(data) {
            //console.log(data);
            if(data.errCode === 200 && data.result.length > 0) {
                var html = "";
                for (var i = 0, len = data.result.length; i < len; i++) {
                    var result = data.result[i];
                    html += "<li class='portrait'><p>" + result.mac_addr + "</p><ul class='portrait-detail-list'>";
                    for(var j = 0, tag_len = result.tag_info.length; j < tag_len; j++) {
                        var tag = result.tag_info[j];
                        if(tag.tag_info != null){
                            html += "<li class='portrait-detail'><p class='portrait-detail-key'>" + tag.tag_info.one_level_tag_name + "</p><p class='portrait-detail-val'>" + tag.tag_info.two_level_tag_name + "</p></li>";
                        } else {
                            html += "<li class='portrait-detail'>null</li>";
                        }
                    }
                    html += "</ul></li>";
                }
                $(".portrait-list").html(html);
            } else {
                $(".portrait-list").html("");
            }
        })
        .fail(function() {
            console.log("error");
        });
    }

    function getMacInfoByChipNo(start_date, end_date, chip_no) {
        $.ajax({
            url: BASEURL + 'admin/api/getMacAndBaiduTagByChipCode',
            type: 'POST',
            dataType: 'json',
            data: {
                start_date: start_date,
                end_date: end_date,
                chip_no: chip_no
            },
        })
        .done(function(data) {
            if(data.success && data.result.length > 0) {
                var html = "";
                for (var i = 0, len = data.result.length; i < len; i++) {
                    var result = data.result[i];
                    html += "<li class='portrait'><p>" + result.mac_addr + "</p><ul class='portrait-detail-list'>";
                    for(var j = 0, tag_len = result.tag_info.length; j < tag_len; j++) {
                        var tag = result.tag_info[j];
                        if(tag.tag_info != null){
                            html += "<li class='portrait-detail'><p class='portrait-detail-key'>" + tag.tag_info.one_level_tag_name + "</p><p class='portrait-detail-val'>" + tag.tag_info.two_level_tag_name + "</p></li>";
                        } else {
                            html += "<li class='portrait-detail'>null</li>";
                        }
                    }
                    html += "</ul></li>";
                }
                $(".portrait-list").html(html);
            } else {
                $(".portrait-list").html("");
            }
        })
        .fail(function() {
            console.log("error");
        });
    }

    //选择时间后获取右侧数据
    $(".rage_button").on("click", function() {
        $('.loading-area').fadeIn();
        var dayNum = $(this).attr("data-time");
        var date = new Date();
        var currentDate = date.format('yyyy-MM-dd');
        var weekago = new Date(date.getTime() - dayNum * 24 * 3600 * 1000).format('yyyy-MM-dd');
        if($(".list-children").children("li").hasClass('list-selected')){//判断是否含有激活了的芯片
            //有
            $(this).siblings('.rage_button').removeClass('rage_button_active');
            $(this).addClass('rage_button_active');
            getMacInfoByChipNo(weekago, currentDate, $(".list-children .list-selected").attr("data-chipno"));
        } else{
            //没有
            $(this).siblings('.rage_button').removeClass('rage_button_active');
            $(this).addClass('rage_button_active');
            getAllMacAndBaiduTagByUser(weekago, currentDate);
        }
        $('.loading-area').fadeOut();
    });
    //查看按钮
    $(".visit-button").on("click", function() {
        event.preventDefault();
        $('.loading-area').fadeIn();
        var startdate = $(this).parent().find("#timeStart").val();
        var enddate = $(this).parent().find("#timeEnd").val();
        if($(".list-children").children("li").hasClass('list-selected')){//判断是否含有激活了的芯片
            //有
            $('.rage_button').siblings('.rage_button').removeClass('rage_button_active');
            getMacInfoByChipNo(startdate, enddate, $(".list-children .list-selected").attr("data-chipno"));
        } else{
            //没有
            $('.rage_button').siblings('.rage_button').removeClass('rage_button_active');
            getAllMacAndBaiduTagByUser(startdate, enddate);
        }
        $('.loading-area').fadeOut();
    });

    function bindEvent() {
        $(".portrait-list").on("click", ".portrait>p", function() {
            $(this).parent(".portrait").toggleClass("list-open");
        });
        $(".portrait-list").on("click", ".portrait>.packup", function() {
            $(this).parent(".portrait").removeClass("list-open");
        });
    }

    function getMessageByChipID(chip_id) {
        $.ajax({
            url: BASEURL + 'admin/api/getMessageByChipID',
            type: 'POST',
            data: {
                chip_id: chip_id
            },
            dataType: 'json',
        })
        .done(function(data) {
            //console.log(data);
            if(data.success) {
                var messages = data.messages;
                var html = "";
                for (var i = 0, len = messages.length; i < len; i++) {
                    html += "<a data-msgID='"+messages[i].id+"'>"+messages[i].title+"</a>";
                }
                $(".supporter_list_menu").html(html);
                $('.currentMsg_name').html("按广告");
            } else {
                $(".supporter_list_menu").html("");
                $('.currentMsg_name').html("暂无数据");
                $(".portrait-list").html("");
            }
        })
        .fail(function() {
            console.log("error");
        });
    }

    function getMacAndBaiduTagByMessageID(messageID) {
        $.ajax({
            url: BASEURL + 'admin/api/getMacAndBaiduTagByMessageID',
            type: 'POST',
            data: {
                messageID: messageID
            },
            dataType: 'json',
        })
        .done(function(data) {
            //console.log(data);
            if(data.success) {
                var html = "";
                for (var i = 0, len = data.result.length; i < len; i++) {
                    var result = data.result[i];
                    html += "<li class='portrait'><p>" + result.mac_addr + "</p><ul class='portrait-detail-list'>";
                    for(var j = 0, tag_len = result.tag_info.length; j < tag_len; j++) {
                        var tag = result.tag_info[j];
                        if(tag.tag_info != null){
                            html += "<li class='portrait-detail'><p class='portrait-detail-key'>" + tag.tag_info.one_level_tag_name + "</p><p class='portrait-detail-val'>" + tag.tag_info.two_level_tag_name + "</p></li>";
                        } else {
                            html += "<li class='portrait-detail'>null</li>";
                        }
                    }
                    html += "</ul></li>";
                }
                $(".portrait-list").html(html);
            } else {
                $(".portrait-list").html("");
            }
        })
        .fail(function() {
            console.log("error");
        });
    }

    function renderListMenu() {
        $('.currentMsg_name').click(function(event) {
            $('#msg_listMenu').show();
        });
        $('.select_msg').hover(function() {
            isOverAppSeletion = true;
            $('#msg_listMenu').show();
        }, function() {
            isOverAppSeletion = false;
            setTimeout(function() {
                if (!isOverAppSeletion) {
                    $('#msg_listMenu').hide();
                }
            }, 500)
        });
        $('#msg_listMenu').on('click', '.supporter_list_menu>a', function(event) {
            $('.currentMsg_name').html($(this).html());
            $('#msg_listMenu').hide();
            var this_option = $(this).attr('data-msgID');
            $('.currentMsg_name').attr('data-msgID', this_option);
            $('.rage_button').removeClass('rage_button_active');
            getMacAndBaiduTagByMessageID(this_option);
            //$('.profile_yesterday').addClass('rage_button_active');
            //$('.basedata_yesterday').addClass('rage_button_active');
        });
    }
    renderListMenu();

}








function getPreDay(s) {
    var y = parseInt(s.substr(0, 4), 10);
    var m = parseInt(s.substr(4, 2), 10) - 1;
    var d = parseInt(s.substr(6, 2), 10);
    var dt = new Date(y, m, d - 1);
    y = dt.getFullYear();
    m = dt.getMonth() + 1;
    d = dt.getDate();
    m = m >= 10 ? m : "0" + m;
    d = d >= 10 ? d : "0" + d;
    return y + "-" + m + "-" + d;
}

function getNextDay(s) {
    var y = parseInt(s.substr(0, 4), 10);
    var m = parseInt(s.substr(4, 2), 10) - 1;
    var d = parseInt(s.substr(6, 2), 10);
    var dt = new Date(y, m, d + 1);
    y = dt.getFullYear();
    m = dt.getMonth() + 1;
    d = dt.getDate();
    m = m >= 10 ? m : "0" + m;
    d = d >= 10 ? d : "0" + d;
    return y + "-" + m + "-" + d;
}

function getEndMaxDate(arr, date) {
    var endMaxDate;
    arr = arr.sort();
    for (var i = 0, len = arr.length; i < len; i++) {
        if (date <= arr[i]) {
            endMaxDate = arr[i];
            break;
        }
    }
    return endMaxDate;
}

function getStartMinDate(arr, date) {
    var startMinDate;
    arr = arr.sort().reverse();
    for (var i = 0, len = arr.length; i < len; i++) {
        if (date >= arr[i]) {
            startMinDate = arr[i];
            break;
        }
    }
    return startMinDate;
}


/**
 * [initAddAd description]发布广告
 * @return {[type]} [description]
 */
business.initAddAd = function () {

    var endSelectTime = '';

    $.ajax({
            url: BASEURL + 'admin/api/chipPutInDate',
            type: 'POST',
            dataType: 'json',
            data: {
                chip_id: 11,
            },
        })
        .done(function(data) {
            if (data.success) {
                var endTime = data.msg?getPreDay(data.msg.replace(/-/g, '')):undefined;
                var data = data.data;
                var timeArray = [];
                var timeOne = [];

                for (var i in data) {
                    timeArray.push(data[i]);
                    for (var j in data[i]) {
                        timeOne.push(data[i][j]);
                    }
                }
                //modify by wz start
                var initStartValidator = timeArray.length == 0 ? rome.val.beforeEq(timeEnd) : rome.val.except(timeArray);
                var initEndValidator = timeArray.length == 0 ? rome.val.afterEq(timeStart) : rome.val.except(timeArray);
                if (!!endTime) {
                    timeOne.push(endTime);
                    var startCal = rome(timeStart, {
                        time: false,
                        dateValidator: initStartValidator,
                        min: new Date().format("yyyy-MM-dd"),
                        max: endTime
                    });
                    var endCal = rome(timeEnd, {
                        time: false,
                        dateValidator: initEndValidator,
                        min: new Date().format("yyyy-MM-dd"),
                        max: endTime
                    });
                } else {
                    var startCal = rome(timeStart, {
                        time: false,
                        dateValidator: initStartValidator,
                        min: new Date().format("yyyy-MM-dd")
                    });
                    var endCal = rome(timeEnd, {
                        time: false,
                        dateValidator: initEndValidator,
                        min: new Date().format("yyyy-MM-dd")
                    });
                }

                $("#timeStart").on("blur", function() {
                    if($(this).val() != "") {
                        if(getEndMaxDate(timeOne, $(this).val())) {
                            var afterValidator = rome.val.only([[$(this).val(), getEndMaxDate(timeOne, $(this).val())]]);
                        } else {
                            var afterValidator = initEndValidator;
                        }

                        endCal.options({
                            time: false,
                            min: $(this).val(),
                            dateValidator: afterValidator
                        });
                    }
                });
                // check startDate
                $("#hasTimeEnd").on("click", function(){
                    if ($(this).prop("checked")) {
                        if($("#timeStart").val() != "") {
                            $("#timeEnd").show();
                            $(this).siblings(".error").hide();
                        } else {
                            $(this).siblings(".error").show();
                            return false;
                        }
                    } else {
                        $("#timeEnd").hide();
                        $("#timeEnd").val("");
                    }
                });
                //modify end
            }
        })
        .fail(function() {
            console.log("error");
        });


    var domain = 'http://share.soundtooth.cn/';
    var isHover = false;
    var uploadStatus = '';

    var showUploadInfos = function(up, file) {
        if (!isHover) {
            $('#uploading-kidd').text(file.percent + '%');
        }
    };

    var uploader = Qiniu.uploader({
        runtimes: 'html5,html4',
        browse_button: 'add-image',
        container: 'form-img-box',
        // drop_element: 'container',
        max_file_size: '5000mb',
        // flash_swf_url: 'js/plupload/Moxie.swf',
        // dragdrop: true,
        chunk_size: '4mb',
        uptoken_url: BASEURL + "admin/api/getUploadToken",
        domain: domain,
        unique_names: true,
        get_new_uptoken: true,
        auto_start: true,
        init: {
            'FilesAdded': function(up, files) {
                var _up = up;
                plupload.each(files, function(file) {
                    isHover = false;
                    // 文件添加进队列后,处理相关的事情
                    var _file = file;
                    var $btn = $('#uploaded-status');
                    var $status = $('#uploading-kidd');

                    /**
                     * unillegal files
                     */
                    uploadStatus = 'uploading';

                    $btn.hide();
                    $status.text('上传中')
                        .css('display', 'inline-block');

                    var currentText = '';
                    $status.hover(function () {
                        currentText = $(this).text();
                        isHover = true;
                        $(this).text('取消')
                            .click(function () {
                                _up.removeFile(_file);
                                $(this).unbind('mouseenter')
                                    .unbind('mouseleave')
                                    .unbind('click');
                                $status.hide();
                                $btn.text('选择文件').show();
                            });
                    }, function () {
                        isHover = false;
                        $(this).text(currentText)
                            .unbind('click');
                    });
                });
            },
            'BeforeUpload': function(up, file) {},
            'UploadProgress': function(up, file) {
                showUploadInfos(up, file);
            },
            'UploadComplete': function() {},
            'FileUploaded': function(up, file, info) {
                "use strict";
                uploadStatus = 'uploaded';
                var infoObj = JSON.parse(info);
                var $status = $('#uploading-kidd');
                $status.unbind('click')
                        .unbind('mouseenter')
                        .unbind('mouseleave')
                        .text('上传成功')
                        .css('cursor', 'auto');
                $('#add-image').attr('disabled','disabled');
                $status.next().remove();
                $('#image-qiniu-url').val(domain + infoObj.key);
            },
            'Error': function(up, err, errTip) {
                uploadStatus = 'error';
                var $btn = $('#uploaded-status');
                var $status = $('#uploading-kidd');

                $status.unbind('mouseenter')
                    .unbind('mouseleave')
                    .unbind('click')
                    .hide();
                $btn.text('请重新上传').show();
            }
        }
    });

    window.onbeforeunload = function() {
        if (uploadStatus == 'uploading') {
            return '上传进度将会丢失，确定要关闭页面吗？';
        }
    };

    $('#send-message').on('click',function(event) {
        event.preventDefault();
        /* Act on the event */
        if (!$('#timeStart').val()) {
            alert('请填写正确的投放日期');
            return;
        }
        if (!$('#money-max').val()) {
            alert('请输入投放金额的上限');
            return;
        }
        if (!$('#image-qiniu-url').val()) {
            alert('请添加图片');
            return;
        }
        if (!$('#add-title').val()) {
            alert('请输入广告标题');
            return;
        }
        if (!$('#add-summary').val()) {
            alert('请输入广告摘要');
            return;
        }
        if (!$('#add-url').val()) {
            alert('请输入链接地址');
            return;
        }

        $.ajax({
            url: BASEURL + 'admin/api/addMessage',
            type: 'POST',
            dataType: 'json',
            data: {
                putInStartDate: $('#timeStart').val(),
                putInEndDate: $('#timeEnd').val(),
                putInTime: 1,
                fundsLimit: $('#money-max').val(),
                putInChannel: 1,
                ChannelImage: $('#image-qiniu-url').val(),
                title: $('#add-title').val(),
                description: $('#add-summary').val(),
                linkAddr: $('#add-url').val(),
                chip_id: 11,
                putInType: 1,
            },
        })
        .done(function(data) {
            if (data.success) {
                alert('上传成功');
            }
        })
        .fail(function() {
            console.log("error");
        })
    });
    //预览广告
    $('#preview-message').on('click',function(event) {
        event.preventDefault();
        var issuccess = $("#uploading-kidd").text();
        if(issuccess == "上传成功"){
            $(".preview_img img").attr('src', $("#image-qiniu-url").val());
            $(".preview_img .title").text($("#add-title").val());
            $(".preview_img .des").text($("#add-summary").val());
        }
        $(".withdraw_shadow").fadeIn('fast');
        $(".preview-message-box").fadeIn('fast');
    });
    // 点击关闭按钮关闭窗口
    $(".preview-message-box .close_btn").on('click',  function(event) {
        $(this).parent().fadeOut();
        $(".withdraw_shadow").fadeOut('fast');
    });
    // 点击遮罩关闭窗口
    $("#preview-message-module .withdraw_shadow").on('click',  function(event) {
        $(".preview-message-box").fadeOut();
        $(".withdraw_shadow").fadeOut('fast');
    });
}
/*
*添加广告成功
*/
business.initAddAdSuccess = function () {
    setTimeout(function(){
        window.location.href = BASEURL + 'admin/supporter';
    }, 3000);
}
/*
*广告中心未开通
*/
business.initAdvCenter = function () {

}
/*
*添加芯片成功
*/
business.initAddChipSuccess = function () {
    this.leftMenu();
    getChipInfo();
    setTimeout(function(){
        window.location.href = BASEURL + 'admin/supporter';
    }, 3000);
};

business.leftMenu = function() {
    $(document).on("click", ".list-header", function(){
        /*var parent = $(this).parent(".nav-list");
        if(parent.hasClass("list-opened")){
            parent.removeClass("list-opened");
        }else {
            parent.addClass("list-opened");
        }*/
        $(this).addClass("add_open");
        $(this).siblings(".list-children").children().removeClass("list-selected");
        $("#chip_no_form>input[name='chip_no']").val("");
    });
    $(document).on("click", ".list-children>li", function(){
        $(this).siblings().removeClass("list-selected");
        $(this).parent().siblings(".list-header").removeClass("add_open");
        if(!$(this).hasClass("list-selected")){
            $(this).addClass("list-selected");
            $("#chip_no_form>input[name='chip_no']").val($(this).attr("data-chipno"));
        }
    });
}

business.chipSearch = function() {
    $("#search_chip").on("input propertychange", function() {
        var searchValue = $(this).val();
        if(searchValue == "") {
            $(".list-children>li").show();
        } else {
            $(".list-children>li").hide();
            $.ajax({
                url: BASEURL + 'admin/api/searchChipCodeByInput',
                type: 'POST',
                data: {
                    "chip_name": searchValue
                },
                dataType: 'json'
            })
            .done(function(data) {
                if(data.success) {
                    for(var i = 0, len = data.result.length; i < len; i++) {
                        var result = data.result[i];
                        $(".list-children>li[data-chipno='" + result.chip_no + "']").show();
                    }
                }
            })
            .fail(function() {
            });
        }
    });
}

business.initRecharge = function() {
    var dlgtrigger = document.querySelector( ".finance_tatol_data_withdraw>button[data-dialog='recharge-dialog']" ),
        somedialog = document.getElementById( 'recharge-dialog' ),
        dlg = new DialogFx( somedialog );
    dlgtrigger.addEventListener( 'click', dlg.toggle.bind(dlg) );
    $("#recharge-dialog .send-btn").on('click',function(){
        show_qr();
    });
    $("#recharge-dialog input[name='recharge_channel']").on('change',function(){
        show_qr();
    });
    $("#recharge_amount").on('change',function(){
        show_qr();
    });
    var show_qr = function(){
        document.getElementById('recharge-qr').innerHTML = "<p>正在生成支付二维码，请稍候...</p>";
        var amount = $("#recharge_amount").val()*100;
        var channel = $('.channel input:radio[name=recharge_channel]:checked').val();
        if(amount > 0){
            $.ajax({
                url: BASEURL + 'api/money',
                type: 'POST',
                dataType: 'json',
                data: {
                    amount: amount,
                    channel: channel
                }
            }).done(function(data) {
                var text;
                switch(data.channel){
                case "wx_pub_qr":
                    text = data.credential.wx_pub_qr;
                    break;
                case "alipay_qr":
                    text = data.credential.alipay_qr;
                    break;
                }
                update_qrcode(text);
            }).fail(function() {
                document.getElementById('recharge-qr').innerHTML = "<p class='error'>生成充值二维码失败，请重试</p>";
            });
        } else {
            document.getElementById('recharge-qr').innerHTML = "<p class='error'>金额错误，请重试</p>";
        }
    }
    var draw_qrcode = function(text, typeNumber, errorCorrectLevel) {
        document.write(create_qrcode(text, typeNumber, errorCorrectLevel) );
    };
    var create_qrcode = function(text, typeNumber, errorCorrectLevel, table) {
        var qr = qrcode(typeNumber || 4, errorCorrectLevel || 'M');
        qr.addData(text);
        qr.make();
    //  return qr.createTableTag();
        return qr.createImgTag();
    };

    var update_qrcode = function(text) {
        var t = "13";
        var e = "M";
        document.getElementById('recharge-qr').innerHTML = create_qrcode(text, t, e)+"<p>请扫码完成支付</p>";
    };
}
