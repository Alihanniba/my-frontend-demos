/*
 * 绑定dropdown-click组件事件
 */
$(document).on("click", ".dropdown-click:not(.disable)", function(event) {
    event.stopPropagation();
    $(this).toggleClass("opened");
});
$(document).on("click", function() {
    $(".dropdown-click").removeClass("opened");
});
$(document).on("click", ".dropdown-click .dropdown-menu>li", function() {
    $(this).parents(".dropdown-click").children(".dropdown-toggle").html($(this).text());
});
/*
 * tree-select组件事件
 */
$(document).on("click", ".tree-toggle", function() {
    $(this).parents(".tree-select").toggleClass("opened");
    if($(this).parents(".tree-select").hasClass("opened")) {
        $(this).removeClass("fa-plus-square-o");
        $(this).addClass("fa-minus-square-o");
    } else {
        $(this).removeClass("fa-minus-square-o");
        $(this).addClass("fa-plus-square-o");
    }
});
/*
 * 退出事件
 */
$(document).on('click', '#nav-user-quit', function(event) {
    event.preventDefault();
    window.location.href = BASEURL + 'admin/api/logout';
});
/*
 * 获取时间字符串
 */
function getDateStr(AddDayCount) {
    var dd = new Date();
    dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
    var y = dd.getFullYear();
    var m = dd.getMonth()+1;//获取当前月份的日期
    var d = dd.getDate();
    return y+"-"+m+"-"+d;
}

//写Cookie
function addCookie(objName, objValue, objHours) {
    var str = objName + "=" + escape(objValue);
    if (objHours > 0) {//为0时不设定过期时间，浏览器关闭时cookie自动消失
        var date = new Date();
        var ms = objHours * 3600 * 1000;
        date.setTime(date.getTime() + ms);
        str += "; expires=" + date.toGMTString();
    }
    document.cookie = str;
}

//读Cookie
function getCookie(objName) {//获取指定名称的cookie的值
    var arrStr = document.cookie.split("; ");
    for (var i = 0; i < arrStr.length; i++) {
        var temp = arrStr[i].split("=");
        if (temp[0] == objName) return unescape(temp[1]);
    }
    return "";
}
/*
 *Pagination 分页器
 */
var Pagination = function(container, params) {
    var s = this;
    s.defaults = {
        pageNo: 1,
        pageCount: 0,
        showRange: 3
    };
    params = params || {};
    var originalParams = {};
    for (var param in params) {
        if (typeof params[param] === 'object' && params[param] !== null && !(params[param].nodeType || params[param] === window || params[param] === document || (typeof Dom7 !== 'undefined' && params[param] instanceof Dom7) || (typeof jQuery !== 'undefined' && params[param] instanceof jQuery))) {
            originalParams[param] = {};
        } else {
            originalParams[param] = params[param];
        }
    }
    for (var def in s.defaults) {
        if (typeof params[def] === 'undefined') {
            params[def] = s.defaults[def];
        }
    }

    s.update = function(params) {
        for (var def in s.defaults) {
            if (typeof params[def] === 'undefined') {
                params[def] = s.defaults[def];
            }
        }
        var html = '';
        if(params.pageCount == null || params.pageCount == 0) {
            $(container).attr("data-page", params.pageNo).html(html);
        } else {
            html = '<div class="pagination-prev"><a class="fa fa-angle-left"></a></div><ul class="pagination">';
            for(var i = 1; i <= params.pageCount; i++) {
                if(params.pageNo == i) {
                    html += '<li class="active"><a>' + i + '</a></li>';
                    continue;
                } else if(Math.abs(params.pageNo - i) <= params.showRange) {
                    html += '<li><a>' + i + '</a></li>';
                    continue;
                }else if(i == 1) {
                    if(params.pageNo > params.showRange + 2) {
                        html += '<li><a>' + i + '</a></li><li class="ellipsis"><a>...</a></li>';
                        continue;
                    } else {
                        html += '<li><a>' + i + '</a></li>';
                        continue;
                    }
                } else if(i == params.pageCount) {
                    if(params.pageCount - params.pageNo > params.showRange + 1) {
                        html += '<li class="ellipsis"><a>...</a></li><li><a>' + i + '</a></li>';
                        continue;
                    } else {
                        html += '<li><a>' + i + '</a></li>';
                        continue;
                    }
                }
            }
            html += '</ul><div class="pagination-next"><a class="fa fa-angle-right"></a></div>';
            $(container).attr("data-page", params.pageNo).html(html);

            if(params.pageNo == 1) {
                $(container + ">.pagination-prev").addClass("disabled");
            } else {
                $(container + ">.pagination-prev").removeClass("disabled");
            }
            if(params.pageNo == params.pageCount) {
                $(container + ">.pagination-next").addClass("disabled");
            } else {
                $(container + ">.pagination-next").removeClass("disabled");
            }

            $(container + " .pagination>li").on("click", function() {
                $(this).addClass("active").siblings().removeClass("active");
                $(container).attr("data-page", $(this).text());
            });
        }
    }
    s.update(params);
}

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


//自助添加广告
var addTestAdvert = {};
addTestAdvert.index = 1;
addTestAdvert.init = function() {
    var _this = this;

    var dateRange = new pickerDateRange('ad-search-date', {
        isTodayValid : false,
        startDateId : 'ad-startDate', // 开始日期输入框ID
        endDateId : 'ad-endDate', // 结束日期输入框ID
        startDate : getDateStr(-30),
        endDate : getDateStr(0),
        isTodayValid : true,
        calendars : 2, // 展示的月份数，最大是2
        defaultText : ' - ',
        inputTrigger : 'ad-search-date',
        autoSubmit : false, //没有确定，取消按钮，直接提交
        theme : 'ta'
    });

    _this.renderListPage(1);
    _this.bindEvent();
    _this.uploadImg();
}
addTestAdvert.bindEvent = function() {
    var _this = this;
    //全选
    $("#select-all").on("change", function() {
        if($(this).prop("checked")) {
            $("#test-advert-show-table").find("input[type='checkbox']").prop("checked", true);
        } else {
            $("#test-advert-show-table").find("input[type='checkbox']").prop("checked", false);
        }
    });

    //标签切换
    $('.datalist-tab').children('div').eq(0).show().siblings('div').hide();
    $('ul.mm-nav li').click(function(){
        var Index = $(this).index();
        $(this).addClass('active').siblings().removeClass('active');
        $('.datalist-tab').children('div').eq(Index).show().siblings('div').hide();
        if(Index == 0) {
            _this.index = 1;
            _this.renderListPage(_this.index);
        }
    });

    //查询
    $("#ad-search-btn").on("click", function() {
            _this.index = 1;
            _this.renderListPage(_this.index);
    });

    //变更广告状态
    $("#test-advert-show-table").on("click", ".play-btn", function() {
        _this.changeAdStatus($(this));
    });

    //删除广告
    $("#delete-btn").on("click", function() {
        layer.confirm("确认删除广告？", {
            btn: ['确定', '取消'] //按钮
        }, function(){
            var advertArr = [];
            $("#test-advert-show-table").find("input[type='checkbox']:checked").each(function() {
                advertArr.push(parseInt($(this).val()));
                _this.deleteAdvert(advertArr);
            });
        }, function(){});
    });

    //文件上传
    $("input[name='mac']").on("change", function() {
        if($("#mac-1").prop("checked")) {
            var input = document.getElementById("add-txt");

            if(typeof FileReader==='undefined'){
                layer.alert("抱歉，你的浏览器不支持读取TXT文件的功能");
                input.setAttribute('disabled','disabled');
            }else{
                input.addEventListener('change', _this.readFile, false);
            }
            $(".text-file-button").removeClass("hide");
            $(".mac-list-box").hide();
        } else {
            $(".text-file-button").addClass("hide");
            $(".mac-list-box").show();
        }
    });

    //提交新建广告
    $("#send-btn").on("click", function() {
        _this.sendInfo();
    });

    //校验mac
    $("#mac-list").on("blur input click", function() {
        var macArr = _this.getMacList($("#mac-list").val());
        $("#mac-count").text(macArr.length);
    });

    //校验名称
    $("#ad-name").on("propertychange input", function() {
        if($(this).val().length > 20) {
            $(this).val($(this).val().substring(0, 20));
        }
    });
}
addTestAdvert.deleteAdvert = function(advertArr) {
    var _this = this;
    $.ajax({
        url: BASEURL + 'api/showHowAdvertDelete',
        type: 'POST',
        dataType: 'json',
        data: {
            advert_ids: JSON.stringify(advertArr)
        }
    })
    .done(function(data) {
        console.log(data);
        if(data.success) {
            layer.msg("删除成功");
            _this.renderListPage(_this.index);
        }
    })
    .fail(function() {
        console.log("error");
    });
}
addTestAdvert.renderListPage = function(pageNo) {
    var _this = this;

    var pagi = new Pagination("#advert-list-pagination");//分页
    var perPage = 15;

    if($("#ad-startDate").val() && $("#ad-startDate").val()) {
        var postData = {
            page_index: pageNo,
            page_num: perPage,
            start_time: $("#ad-startDate").val(),//开始时间
            end_time: $("#ad-endDate").val()//结束时间
        }
    } else {
        var postData = {
            page_index: pageNo,
            page_num: perPage
        }
    }
    $(".loading-area").fadeIn();
    $.ajax({
        url: BASEURL + 'api/showHowAdvertList',
        type: 'POST',
        dataType: 'json',
        data: postData
    })
    .done(function(data) {
        //console.log(data);
        if(data.success) {
            var html = [];
            var advert = data.result.advert;
            var pageCount = Math.ceil(data.result.totalCount / perPage);
            for(var i = 0; i < advert.length; i++) {
                var title = advert[i].title == null ? "无名称" : advert[i].title;
                var click_ratio = (advert[i].click_ratio * 100).toFixed(2) + "%";
                var status = advert[i].status ? '有效<span class="play-btn fa fa-pause-circle-o" data-status="0" data-mid="' + advert[i].id + '"></span>' : '暂停<span class="play-btn fa fa-play-circle-o" data-status="1" data-mid="' + advert[i].id + '"></span>';
                html.push('<tr>');
                html.push('<td><input type="checkbox" id="test-advert-' + advert[i].id + '" class="regular-checkbox" name="test-advert-' + advert[i].id + '" value="' + advert[i].id + '"><label for="test-advert-' + advert[i].id + '"></label><label for="test-advert-' + advert[i].id + '">' + title + '</label></td>');
                html.push('<td>' + advert[i].message_link_url + '</td>');
                html.push('<td>' + advert[i].exposure + '</td>');
                html.push('<td>' + advert[i].click + '</td>');
                html.push('<td>' + click_ratio + '</td>');
                html.push('<td>' + advert[i].date + '</td>');
                html.push('<td>' + status + '</td>');
                html.push('</tr>');
            }
            $("#test-advert-show-table>tbody").html(html.join(""));

            pagi.update({
                pageCount: pageCount,
                pageNo: pageNo
            });
            //分页点击
            var activePage = parseInt($("#advert-list-pagination .pagination>.active").text());
            _this.index = activePage;
            $(document).off("click", "#advert-list-pagination .pagination>li").on("click", "#advert-list-pagination .pagination>li", function() {
                _this.index = parseInt($(this).text());
                _this.renderListPage(parseInt($(this).text()));
            });
            $(document).off("click",  "#advert-list-pagination .pagination-prev").on("click", "#advert-list-pagination .pagination-prev", function() {
                if(activePage > 1) {
                    _this.index = activePage - 1;
                    _this.renderListPage(activePage - 1);
                }
            });
            $(document).off("click", "#advert-list-pagination .pagination-next").on("click", "#advert-list-pagination .pagination-next", function() {
                if(pageCount - activePage  > 0) {
                    _this.index = parseInt(activePage + 1);
                    _this.renderListPage(activePage + 1);
                }
            });

            $(".loading-area").fadeOut();
        }
    })
    .fail(function() {
        $(".loading-area").fadeOut();
        console.log("error");
    });
}
addTestAdvert.getMacList = function(str) {
    var arr = str.split("\n");
    var result = [];
    var len = arr.length>1000 ? 1000 : arr.length;  //多于1000条的过滤
    for (var i = 0; i < len; i++) {
        if (new RegExp(/^([0-9a-fA-F]{12})$/).test(arr[i])) {
            result.push(arr[i].toLowerCase());
        } else if (new RegExp(/^([0-9a-fA-F]{2})(([:][0-9a-fA-F]{2}){5})$/).test(arr[i])) {
            result.push(arr[i].replace(new RegExp(/:/g), '').toLowerCase());
        }
    }
    return result;
}
addTestAdvert.getUrl = function(str) {
    var result = "";
    var httpReg = new RegExp(/^https?:\/\//);
    if(httpReg.test(str)) {
        result = str;
    } else {
        result = "http://" + str;
    }
    return result;
}
addTestAdvert.sendInfo = function() {
    var _this = this;
    var message_title = $("#ad-name").val();
    var message_cover = $("#image-qiniu-url").val();
    var message_url = _this.getUrl($("#ad-url").val());
    var message_mac = _this.getMacList($("#mac-list").val());
    if(message_title == "") {
        layer.alert("请输入广告名称");
        return;
    }
    if(message_cover == "") {
        layer.alert("请上传图片");
        return;
    }
    if(message_url == "" || message_url == "http://") {
        layer.alert("请输入链接");
        return;
    }
    if(message_mac.length <= 0) {
        layer.alert("请输入有效的MAC地址");
        return;
    }
    $(".loading-area").fadeIn();
    $.ajax({
        url: BASEURL + 'admin/api/messagePushContactScene',
        type: 'POST',
        dataType: 'json',
        data: {
            message_title: message_title,
            message_cover: message_cover,
            message_url: message_url,
            message_mac: message_mac
        }
    })
    .done(function(data) {
        if(data.success) {
            layer.alert("发布成功，请点击确定查看效果", function() {
                window.location = BASEURL + "agentTestAdvert";
            });
        } else {
            layer.alert("发布失败");
        }
        $(".loading-area").fadeOut();
    })
    .fail(function() {
        layer.alert("发布失败");
        $(".loading-area").fadeOut();
        console.log("error");
    });
}
addTestAdvert.readFile = function() {
    var file = this.files[0];
    var reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = function(e){
        $(".mac-list-box").show();
        $("#mac-list").val(this.result);
        $("#mac-list").click();
    }
}
addTestAdvert.changeAdStatus = function(jqDom) {
    $.ajax({
        url: BASEURL + 'api/showHowAdvertChangeStatus',
        type: 'POST',
        data: {
            advert_id: parseInt(jqDom.attr("data-mid")),
            status_id: parseInt(jqDom.attr("data-status"))
        },
        dataType: 'json'
    })
    .done(function(data) {
        if(data.success) {
            layer.msg("操作成功！");
            if(jqDom.attr("data-status") == 1) {
                jqDom.parent().html("有效<span class='play-btn fa fa-pause-circle-o' data-status='0' data-mid='" + jqDom.attr("data-mid") + "'></span>");
            } else {
                jqDom.parent().html("暂停<span class='play-btn fa fa-play-circle-o' data-status='1' data-mid='" + jqDom.attr("data-mid") + "'></span>");
            }
        } else {
            layer.msg("操作失败！"+data.errMsg);
        }
    })
    .fail(function() {
        layer.msg("操作失败！");
        console.log("error");
    });
}
addTestAdvert.uploadImg = function() {
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
        browse_button: 'ad-img',
        //container: 'img-box',
        // drop_element: 'container',
        max_file_size: '100kb',
        // flash_swf_url: 'js/plupload/Moxie.swf',
        // dragdrop: true,
        multi_selection: false,
        chunk_size: '4mb',
        uptoken_url: BASEURL + "admin/api/getUploadToken",
        domain: domain,
        unique_names: true,
        get_new_uptoken: true,
        auto_start: true,
        filters : {
            max_file_size : '100kb',
            prevent_duplicates: false,
            // Specify what files to browse for
            mime_types: [
                {title : "Image files", extensions : "jpg,gif,png"}, // 限定jpg,gif,png后缀上传
            ]
        },
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
                var url = domain + infoObj.key;
                var $status = $('#uploading-kidd');
                $status.unbind('click')
                        .unbind('mouseenter')
                        .unbind('mouseleave')
                        .text('上传成功：'+url)
                        .css('cursor', 'auto');
                var $btn = $("#ad-img");
                //$btn.prop("disabled", true);
                //$btn.siblings(".file-button").addClass("disabled");
                //$('#hImg').val(domain + infoObj.key);
                $('#image-qiniu-url').val(url);
            },
            'Error': function(up, err, errTip) {
                uploadStatus = 'error';
                var $btn = $('#uploaded-status');
                var $status = $('#uploading-kidd');

                $status.unbind('mouseenter')
                        .unbind('mouseleave')
                        .unbind('click')
                        .hide();
                if(err.code == -600) {
                    $btn.text('图片不能超过100kb，请重新上传').show();
                } else {
                    $btn.text('请重新上传').show();
                }
            }
        }
    });

    function checkImgPx(width, height) {
        var sizeArr = ["800*120", "600*500", "640*270", "960*640", "600 *300", "480*800", "640*960", "720*1280", "768*1024", "728*90", "468*60", "600*500", "1024*768", "1280*800", "1366*768"];
        var imgSize = width + "*" + height;
        if($.inArray(imgSize, sizeArr) < 0) {
            return false;
        } else {
            return true;
        }
    }
}

//场景列表
scenesList = {};
scenesList.init = function() {
    _this = this;
    _this.getStatistics();
    _this.renderListPage(1);
    _this.bindEvent();
};
//获取所有客户和自己帐号的广告统计信息
scenesList.getStatistics = function(){
    var account_type = $("#account-type").val();
    $(".loading-area").fadeIn();
    $.ajax({
        url: BASEURL + 'scene/getScenesCount',
        type: 'POST',
        dataType: 'json',
        data: {
            user_id: ACCOUNT,
        }
    })
    .done(function(data) {
        console.log(data);
        if(data.success) {
            if(account_type == "agent"){
                //客户的
                var child_sum_count = data.result.sub_data.sum_count == null ? 0 : data.result.sub_data.sum_count;//场景总数
                var child_undone_count = data.result.sub_data.undone_count == null ? 0 : data.result.sub_data.undone_count;//未完善场景数
                var child_valid_count = data.result.sub_data.valid_count == null ? 0 : data.result.sub_data.valid_count;//已完善场景数
                var child_stype_count = data.result.sub_data.stype_count == null ? 0 : data.result.sub_data.stype_count;//已完善场景类型数量
                $("#child-scenes-total").text(child_sum_count);
                $("#child-not-complete").text(child_undone_count);
                $("#child-complete").text(child_valid_count);
                $("#child-complete-type").text(child_stype_count);
                //客户总数量
                var child_totalCount = data.result.sub_count == null ? 0 : data.result.sub_count;
                $("#child-totalCount").text(child_totalCount);
            }
            //代理商自己的
            var self_sum_count = data.result.self_data == null ? 0 : data.result.self_data.sum_count;//场景总数
            var self_undone_count = data.result.self_data == null ? 0 : data.result.self_data.undone_count;//未完善场景数
            var self_valid_count = data.result.self_data == null ? 0 : data.result.self_data.valid_count;//已完善场景数
            var self_stype_count = data.result.self_data == null ? 0 : data.result.self_data.stype_count;//已完善场景类型数量
            $("#self-scenes-total").text(self_sum_count);
            $("#self-not-complete").text(self_undone_count);
            $("#self-complete").text(self_valid_count);
            $("#self-complete-type").text(self_stype_count);
        }
        $(".loading-area").fadeOut();
    })
    .fail(function(data) {
        if(account_type == "agent"){
            $("#child-scenes-total").text("0");
            $("#child-not-complete").text("0");
            $("#child-complete").text("0");
            $("#child-complete-type").text("0");
            $("#child-totalCount").text("0");
        }
        $("#self-scenes-total").text("0");
        $("#self-not-complete").text("0");
        $("#self-complete").text("0");
        $("#self-complete-type").text("0");
        console.log("error");
        $(".loading-area").fadeOut();
    });
}
scenesList.bindEvent = function() {
    _this = this;
    $("#scenes-list-table").on("click", ".scene-detail", function() {
        var chip_id = $(this).attr("data-chipId");
        var chip_No = $(this).attr("data-chipNo");
        var init_name = encodeURIComponent($(this).attr("data-id"));
        var current_name = encodeURIComponent($(this).attr("data-name"));
        if($(this).attr("data-status") == "0") {
            $("#scene-name").text(decodeURIComponent(current_name));
            $("#perfect-information-module .withdraw-shadow").fadeIn();
            $("#perfect-information-module .perfect-information-box").fadeIn();
            $('#see-data').off("click").on("click", function() {
                window.location.href = BASEURL + 'passengerFlow/chipId/' + chip_id + '/sceneName/' + init_name;
            });

            $('#perfect-information').off("click").on("click", function() {
                window.location.href = BASEURL + 'vtScene/chipNo/' + chip_No + '/sceneName/' + init_name;
            });
        } else {
            window.location.href = BASEURL + 'passengerFlow/chipId/' + chip_id + '/sceneName/' + init_name;
        }
    });
    $(".search-input>.fa-search").on("click", function() {
        _this.renderListPage(1);
    });
    $("#scenes-status-select").find(".dropdown-menu").children("li").on("click", function() {
        $("#scenes-status-select").attr("data-status", $(this).attr("data-status"));
        _this.renderListPage(1);
    });
}
scenesList.renderListPage = function(pageNo) {
    var _this = this;

    var pagi = new Pagination("#advert-list-pagination");//分页
    var perPage = 15;

    $(".loading-area").fadeIn();
    $.ajax({
        url: BASEURL + 'scene/getScenesList',
        type: 'POST',
        dataType: 'json',
        data: {
            user_id: ACCOUNT,
            chip_code: "",
            index: pageNo,
            num: perPage,
            key_name: $("#key-scene-name").val(),
            sta_done: $("#scenes-status-select").attr("data-status")
        }
    })
    .done(function(data) {
        console.log(data);
        if(data.success) {
            var html = [];
            var scenes = data.result.scenes;
            if(scenes != null){
                $("#scene-no-data").hide();
                $("#scene-page-show").show();
                var pageCount = Math.ceil(data.result.total / perPage);
                for(var i = 0; i < scenes.length; i++) {
                    if(scenes[i].info_id == undefined) {
                        var status = 0;
                        var statusText = "未完善";
                    } else {
                        var status = 1;
                        var statusText = "已完善";
                    }
                    html.push('<tr>');
                    html.push('<td>' + (scenes[i].current_name == undefined ? scenes[i].initial_name : scenes[i].current_name) + '</td>');
                    html.push('<td>' + statusText + '</td>');
                    html.push('<td>' + (scenes[i].scenes_name == undefined ? '—— ——' : scenes[i].scenes_name) + '</td>');
                    html.push('<td><span class="ad-icon addr-tips tipso_style" data-tipso="' + (scenes[i].addr == undefined ? "信息未完善" : scenes[i].addr) + (scenes[i].city == undefined ? "" : scenes[i].city) + '"></span>' + (scenes[i].city == undefined ? "—— ——" : scenes[i].city) + '</td>');
                    html.push('<td>' + scenes[i].scanNum + '</td>');
                    if(ACCOUNT == ""){
                        html.push('<td><a class="scene-detail" data-id="'+ scenes[i].initial_name +'" data-name="'+ (scenes[i].current_name == undefined ? scenes[i].initial_name : scenes[i].current_name) +'" data-chipId="'+ scenes[i].chip_id +'" data-chipNo="'+ scenes[i].chip_no +'" data-status="'+ status +'"><span>查看</span><span class="fa fa-eye"></span></a></td>');
                    }else{
                        html.push('<td>—— ——</td>');
                    }
                    html.push('</tr>');
                }
                $("#scenes-list-table>tbody").html(html.join(""));

                pagi.update({
                    pageCount: pageCount,
                    pageNo: pageNo
                });
                //分页点击
                var activePage = parseInt($("#advert-list-pagination .pagination>.active").text());
                _this.index = activePage;
                $(document).off("click", "#advert-list-pagination .pagination>li").on("click", "#advert-list-pagination .pagination>li", function() {
                    _this.index = parseInt($(this).text());
                    _this.renderListPage(parseInt($(this).text()));
                });
                $(document).off("click",  "#advert-list-pagination .pagination-prev").on("click", "#advert-list-pagination .pagination-prev", function() {
                    if(activePage > 1) {
                        _this.index = activePage - 1;
                        _this.renderListPage(activePage - 1);
                    }
                });
                $(document).off("click", "#advert-list-pagination .pagination-next").on("click", "#advert-list-pagination .pagination-next", function() {
                    if(pageCount - activePage  > 0) {
                        _this.index = parseInt(activePage + 1);
                        _this.renderListPage(activePage + 1);
                    }
                });
                $('#scenes-list-table .addr-tips').tipso({
                    useTitle: false,
                    width: 'auto',
                    position: 'bottom',
                    background: '#626262'
                });
            }else{
                $("#scenes-list-table>tbody").html("");
                $("#scene-no-data").show();
                $("#scene-page-show").hide();
            }
        }
        $(".loading-area").fadeOut();
    })
    .fail(function(data) {
        $(".loading-area").fadeOut();
        console.log("error");
    });
}


/*
 *new_index
 */
var passenger = {};
passenger.init = function() {
    BASEURL = BASEURL || "";
    var _this = this;
    var first = true;

    var dateRange = new pickerDateRange('ad-search-date', {
        isTodayValid : false,
        startDateId : 'scene-startDate', // 开始日期输入框ID
        endDateId : 'scene-endDate', // 结束日期输入框ID
        startDate : getDateStr(-1),
        endDate : getDateStr(-1),
        isTodayValid : true,
        calendars : 2, // 展示的月份数，最大是2
        defaultText : ' - ',
        inputTrigger : 'ad-search-date',
        autoSubmit : false, //没有确定，取消按钮，直接提交
        theme : 'ta'
    });


    this.renderPageData();
    $("#search-btn").on("click", function() {
        _this.renderPageData();
    });

    //this.initPieCharts();
}

passenger.renderPageData = function() {
    var chipId = $("#chip-id").val();//芯片id
    var sceneName = $("#scene-name").val();//场景名称
    $('.loading-area').fadeIn();
    $.ajax({
        url: BASEURL + 'admin/api/chipDataStatistics',
        type: 'POST',
        data: {
            chip_id: chipId,
            scene_name: sceneName,
            startTime: $("#scene-startDate").val(),
            endTime: $("#scene-endDate").val()
        },
        dataType: 'json'
    })
    .done(function(data) {
        if(data.success) {
            //渲染场景人数
            /*for(var i = 0, len = data.result.frequency.length; i < len; i++) {
                var dom = $("#summary-data>.number-list>li").eq(i);
                dom.find(".data-number").html(data.data[i]);
            }*/
            $("#summary-data>.number-list>li").eq(0).find(".data-number").html(data.result.current);
            $("#summary-data>.number-list>li").eq(1).find(".data-number").html(data.result.distance);
            $("#summary-data>.number-list>li").eq(2).find(".data-number").html(data.result.old);
            $("#summary-data>.number-list>li").eq(3).find(".data-number").html(data.result.new);
            //渲染停留时间条形图
            for(var i = 0, len = data.result.remain_time.length, sum = eval(data.result.remain_time.join('+')); i < len; i++) {
                var percent = sum == 0 ? 0 : Math.round(data.result.remain_time[i] / sum * 100);
                var dom = $("#summary-time").children(".chart-bar-container").eq(i);
                dom.find(".data-number").html(data.result.remain_time[i]);
                dom.find(".data-percent").html(percent + "%");
                dom.find(".chart-bar>div").width(percent + "%");
            }
            //渲染出现频数条形图
            for(var i = 0, len = data.result.frequency.length, sum = eval(data.result.frequency.join('+')); i < len; i++) {
                var percent = sum == 0 ? 0 : Math.round(data.result.frequency[i] / sum * 100);
                var dom = $("#summary-frequency").children(".chart-bar-container").eq(i);
                dom.find(".data-number").html(data.result.frequency[i]);
                dom.find(".data-percent").html(percent + "%");
                dom.find(".chart-bar>div").width(percent + "%");
            }
            //渲染时间段表格
            for(var i = 0, len = data.result.period.length; i < len; i++) {
                $("#flowrate-number>td").eq(i+1).html(data.result.period[i]);
            }
            //渲染饼图
            if(data.result.current > 0 || data.result.tag.length > 0) {
                $(".chart-list").show();
                $(".no-data").hide();
                $(".chart-list").empty();
                for(var i = 0, len = data.result.tag.length; i < len; i++) {
                    if(data.result.tag[i].data != undefined && data.result.tag[i] != 0 && data.result.tag[i].data != null) {
                        var options = getOptions(data.result.tag[i]);
                        renderPieCharts("chart-" + i, options);
                    }
                }
            } else {
                $(".chart-list").hide();
                $(".no-data").show();
            }
        }
        $('.loading-area').fadeOut();
    })
    .fail(function() {
        //出现错误重置数据
        $("data-number").html("0");
        $("data-percent").html("0%");
        $(".chart-bar>div").width("0px");
        console.log("error");
    });

    function getOptions(chartData) {
        var legendData = [];
        var seriesData = [];
        var sumArray = [];
        for(var i = 0, len = chartData.data.length; i < len; i++) {
            sumArray[i] = chartData.data[i].value;
        }
        var sum = eval(sumArray.join("+"));
        for(var i = 0, len = chartData.data.length; i < len; i++) {
            var percent = chartData.data[i].value==0 || sum == 0 ? 0 : Math.round(chartData.data[i].value / sum * 100) + "%";
            var dataName = percent + "(" + chartData.data[i].name + ")";
            legendData[i] = {
                name: dataName
            };
            seriesData[i] = {
                name: dataName,
                value: chartData.data[i].value
            };
        }

        var options = {
            color: ['#ffcc99', '#cc99ff', '#99ccff', '#43ca83', '#ffcaf2',"#fff0ac","#acf4ff"],
            title: {
                text: chartData.name,
                x: 'center',
                y: 'bottom',
                textStyle: {
                    fontSize: '16',
                    color: '#666',
                    align: 'center',
                    fontFamily: 'Helvetica Neue, Helvetica, 微软雅黑, HiraginoSansGB, Arial, sans-serif, 冬青黑体',
                    fontWeight: 'normal'
                }
            },
            tooltip: {
                formatter: '{b} <br/>{c}',
                textStyle: {
                    fontSize: '14',
                    color: '#fff',
                    fontFamily: 'Helvetica Neue, Helvetica, 微软雅黑, HiraginoSansGB, Arial, sans-serif, 冬青黑体',
                    align: 'center',
                    fontWeight: 'normal'
                }
            },
            legend: {
                x: '180',
                y: 'center',
                itemGap: 10,
                orient: 'vertical',
                textStyle: {
                    color:'#666',
                    fontSize: '16',
                    fontFamily: 'Helvetica Neue, Helvetica, 微软雅黑, HiraginoSansGB, Arial, sans-serif, 冬青黑体',
                    align: 'left',
                    fontWeight: 'normal'
                },
                data: legendData
            },
            series: [{
                center: ["80", "50%"],
                clockWise: true,
                type: 'pie',
                radius: [50, 70],
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
                data: seriesData
            }]
        };
        return options;
    }

    function renderPieCharts(domId, options) {
        $(".chart-list").append('<li class="chart-box" id="' + domId + '"></li>');
        require.config({
            paths: {
                echarts: BASEURL + 'js'
            }
        });
        require(
            [
                'echarts',
                'echarts/chart/pie'
            ],
            function(ec) {
                var myChart = ec.init(document.getElementById(domId));
                myChart.setOption(options);
            }
        );
    }
}




//修改密码
modifyPWD = {};
modifyPWD.modifyPWD = function() {
    var pswReg = /^(\w){6,16}$/;
    var currentPWD = document.getElementById('current-pwd');
    var newPWD = document.getElementById('new-pwd');
    var enterPWD = document.getElementById('enter-pwd');
    var submitButton = document.getElementById("submit-button");
    submitButton.onclick = function() {
        if (!currentPWD.value || !pswReg.test(currentPWD.value)) {
            layer.msg('当前密码错误,请重新输入', {icon: 5,time: 2000});
            return;
        }
        if (!newPWD.value || !pswReg.test(newPWD.value)) {
            layer.msg('请输入格式正确的新密码', {icon: 5,time: 2000});
            return;
        }
        if (!enterPWD.value || !pswReg.test(enterPWD.value)) {
            layer.msg('请输入格式正确的新密码', {icon: 5,time: 2000});
            return;
        }
        if (enterPWD.value !== newPWD.value) {
            layer.msg('新密码两次输入不相等,请重新输入', {icon: 5,time: 2000});
            return;
        }
        $.ajax({
            url: BASEURL + 'account/resetAccountPw',
            type: 'POST',
            dataType: 'json',
            data: {
                oldPw: currentPWD.value,
                newPw: newPWD.value,
            },
        })
        .done(function(data) {
            if (data.success) {
                currentPWD.value = '';
                newPWD.value = '';
                enterPWD.value = '';
                layer.msg('修改密码成功', {icon: 6,time: 2000});
            } else {
                layer.msg('当前密码错误,请重新输入', {icon: 5,time: 2000});
            }
        })
        .fail(function() {
            console.log("error");
        });
    };
}
//首页（广告统计）
var index = {};
index.init = function() {
    var that = this;
    var loadDay = true;//是否加载分日报告列表
    //广告列表和分日报告切换
    $('ul.mm-nav li').click(function(){
        if(loadDay && $(this).attr("data-type") == "day"){
            loadDay = false;
            that.getDayReportList(1);//分日报告
        }
        var Index = $(this).index();
        $(this).addClass('active').siblings().removeClass('active');
        $('.datalist-tab').children('div').eq(Index).show().siblings('div').hide();
    });
    //广告列表时间选择
    var dateRange = new pickerDateRange('ad-search-date', {
        isTodayValid : false,
        startDateId : 'ad-startDate', // 开始日期输入框ID
        endDateId : 'ad-endDate', // 结束日期输入框ID
        startDate : getDateStr(-30),
        endDate : getDateStr(0),
        isTodayValid : true,
        calendars : 2, // 展示的月份数，最大是2
        defaultText : ' - ',
        inputTrigger : 'ad-search-date',
        autoSubmit : false, //没有确定，取消按钮，直接提交
        theme : 'ta'
    });
    //分日报告时间选择
    var dateRange2 = new pickerDateRange('day-search-date', {
        isTodayValid : false,
        startDateId : 'day-startDate', // 开始日期输入框ID
        endDateId : 'day-endDate', // 结束日期输入框ID
        startDate : getDateStr(-30),
        endDate : getDateStr(0),
        isTodayValid : true,
        calendars : 2, // 展示的月份数，最大是2
        defaultText : ' - ',
        inputTrigger : 'day-search-date',
        autoSubmit : false, //没有确定，取消按钮，直接提交
        theme : 'ta'
    });
    $("#search-advert-byname").on("click", function() {
        that.getAdvertList(1);
    });
    //状态下拉
    $(document).on("click", "#ad-status-select .dropdown-menu>li", function() {
        $(this).parents("#ad-status-select").attr("data-status", $(this).attr("data-status"));
    });
    //关闭删除提示框
    $("#del-ad-content .del-cancel").on("click", function() {
        $("#del-ad-box").fadeOut();
    });
    $("#del-ad-box .del-ad-mask").on("click", function() {
        $("#del-ad-box").fadeOut();
    });
    //广告列表查询按钮
    $("#ad-search-btn").on("click", function() {
        that.getAdvertList(1);//广告列表
    });
    //分日报告查询按钮
    $("#day-search-btn").on("click", function() {
        that.getDayReportList(1);//分日报告
    });
    this.adListPagi = new Pagination("#advert-list-pagination");//广告列表分页
    this.dayPagi = new Pagination("#everyday-list-pagination");//分日报告分页
    this.getStatistics();//统计信息
    this.getAdvertList(1);//广告列表
    //确认删除广告
    $("#ad-del-btn").on("click", function() {
        that.deleteAdvert($(this).attr('data-mid'));//分日报告
    });
    //导出分日报告
    $("#export-btn").on("click", function() {
        //that.getExportData(1);
        pageDataCount = 15;
        this.href = BASEURL + 'api/exportAdvertReport?startTime='+$("#day-startDate").val()+'&endTime='+$("#day-endDate").val()+'&page='+'2'+'&pageCount='+pageDataCount;
        this.target = '_blank';
    });
}
//获取所有客户和自己帐号的广告统计信息
index.getStatistics = function(){
    $.ajax({
        url: BASEURL + 'api/advertStatisticsAnalysis',
        type: 'POST',
        dataType: 'json',
        data: {
            user_id: ACCOUNT,
        }
    })
    .done(function(data) {
        console.log(data);
        if(data.success) {
            //客户的
            var child_adTotal = data.result.business.total == null ? 0 : data.result.business.total;//发布广告总数
            var child_adShow = data.result.business.show == null ? 0 : data.result.business.show;//广告总展现量
            var child_adClick = data.result.business.click == null ? 0 : data.result.business.click;//广告总点击量
            var child_adClickRate = 0;//广告总点击率
            if(child_adShow > 0 && child_adShow != undefined && !isNaN(child_adShow)){
                child_adClickRate = ((child_adClick / child_adShow) * 100).toFixed(2);
            }
            var child_validMessage = data.result.business.validMessage == null ? 0 : data.result.business.validMessage;//今日有效广告数
            $("#child-adTotal").text(child_adTotal);
            $("#child-adShow").text(child_adShow);
            $("#child-adClick").text(child_adClick);
            $("#child-adClickRate").text(child_adClickRate);
            $("#child-validMessage").text(child_validMessage);
            //代理商自己的
            var self_adTotal = data.result.agent.total == null ? 0 : data.result.agent.total;//发布广告总数
            var self_adShow = data.result.agent.show == null ? 0 : data.result.agent.show;//广告总展现量
            var self_adClick = data.result.agent.click == null ? 0 : data.result.agent.click;//广告总点击量
            var self_adClickRate = 0;//广告总点击率
            if(self_adShow > 0 && self_adShow != undefined && !isNaN(self_adShow)){
                self_adClickRate = ((self_adClick / self_adShow) * 100).toFixed(2);
            }
            var self_validMessage = data.result.agent.validMessage == null ? 0 : data.result.agent.validMessage;//今日有效广告数
            $("#self-adTotal").text(self_adTotal);
            $("#self-adShow").text(self_adShow);
            $("#self-adClick").text(self_adClick);
            $("#self-adClickRate").text(self_adClickRate);
            $("#self-validMessage").text(self_validMessage);
            //客户总数量
            var child_totalCount = data.result.businessNumber.total == null ? 0 : data.result.businessNumber.total;
            $("#child-totalCount").text(child_totalCount);
        }
    })
    .fail(function() {
        $("#child-adTotal").text("0");
        $("#child-adShow").text("0");
        $("#child-adClick").text("0");
        $("#child-adClickRate").text("0");
        $("#child-validMessage").text("0");
        $("#self-adTotal").text("0");
        $("#self-adShow").text("0");
        $("#self-adClick").text("0");
        $("#self-adClickRate").text("0");
        $("#self-validMessage").text("0");
        $("#child-totalCount").text("0");
        console.log("error");
    });
}

//获取广告列表
index.getAdvertList = function(pageNo){
    $('.loading-area').fadeIn();
    var pageDataCount = 15;//每页数量（可拓展为参数）
    var selectStatus = $("#ad-status-select").attr("data-status");
    $.ajax({
        url: BASEURL + 'api/advertStatistics',
        type: 'POST',
        dataType: 'json',
        data: {
            user_id: ACCOUNT,
            title: $("#key-adname").val(),//搜索关键词
            status: selectStatus,//状态
            startTime: $("#ad-startDate").val(),//开始时间
            endTime: $("#ad-endDate").val(),//结束时间
            page: pageNo,//当前页码
            pageSize: pageDataCount//每页数量
        }
    })
    .done(function(data) {
        console.log(data);
        if(data.success) {
            if(data.result.messageList.length > 0){
                //渲染
                $("#ad-no-data").hide();
                $("#ad-page-show").show();
                var pageCount = Math.ceil(data.result.analysis.messageCount / pageDataCount);//计算总页数
                var message_adTotal = data.result.analysis.messageCount == null ? 0 : data.result.analysis.messageCount;
                var message_adShow = data.result.analysis.show == null ? 0 : data.result.analysis.show;
                var message_adClick = data.result.analysis.click == null ? 0 : data.result.analysis.click;
                var message_adClickRate = message_adShow == 0 ? 0 : ((message_adClick / message_adShow) * 100).toFixed(2);
                var message_validMessage = data.result.analysis.push == null ? 0 : data.result.analysis.push;
                var message_money = data.result.analysis.cost == null ? 0 : data.result.analysis.cost;
                $("#message-adTotal").text(message_adTotal);//广告数
                $("#message-adShow").text(message_adShow);//展现量
                $("#message-adClick").text(message_adClick);//点击量
                $("#message-adClickRate").text(message_adClickRate);//点击率
                $("#message-validMessage").text(message_validMessage);//累计广告条数
                $("#message-money").text(message_money);//总消费
                var html = "";
                for(var i = 0, len = data.result.messageList.length; i < len; i++) {
                    var info = data.result.messageList[i];
                    var adTitle = info.title ? info.title : "无名称";//名称
                    var showCount = info.showCount == null ? 0 : info.showCount;//展现量
                    var clickCount = info.clickCount == null ? 0 : info.clickCount;//点击量
                    var clickPercent = showCount == 0 ? 0 : ((clickCount / showCount) * 100).toFixed(2);//点击率
                    var dailyBudget = info.dailyBudget == null ? '—— ——' : info.dailyBudget;//每日预算
                    var costCount = info.costCount == null ? '—— ——' : info.costCount;//消费
                    var adStatus = info.status == 1 ? "播放" : "暂停";//0：暂停，1：播放
                    var adPlay = "";
                    var adEditDel = "";
                    if(ACCOUNT == ""){
                        adPlay = info.status == 1 ? "<span class='play-btn fa fa-pause-circle-o' data-status='0' data-mid='" + info.id + "' data-tipso='暂停'></span>" : "<span class='play-btn fa fa-play-circle-o' data-status='1' data-mid='" + info.id + "' data-tipso='播放'></span>";
                        adEditDel = '<span class="trash-btn fa fa-trash" data-mid="' + info.id + '" data-tipso="删除"></span>';
                                    //'<span class="edit-btn fa fa-pencil" data-mid="' + info.id + '" data-tipso="编辑"></span>'
                    }
                    html += '<tr><td>' + adTitle + '</td>';
                    html += '<td><img src="' + info.channel_image + '" alt="' + adTitle + '"></td>';
                    html += '<td>' + info.updated_at + '</td>';
                    html += '<td>' + (showCount > 9999 ? '9999+' : showCount) + '</td>';
                    html += '<td>' + (clickCount > 9999 ? '9999+' : clickCount) + '</td>';
                    html += '<td>' + clickPercent + '%</td>';
                    html += '<td>' + dailyBudget + '</td>';
                    html += '<td>' + costCount + '</td>';
                    html += '<td>' + adStatus + adPlay + adEditDel + '';
                    html += '</td></tr>';
                }
                $("#advert-list-table>tbody").html(html);
                //按钮提示
                $('#advert-list-table tbody tr td .fa').tipso({
                    useTitle: false,
                    width: 'auto',
                    position: 'bottom',
                    background: '#626262'
                });
                //删除按钮
                $("#advert-list-table tbody tr td .trash-btn").on("click", function() {
                    $("#ad-del-btn").attr('data-mid', $(this).attr('data-mid'));
                    $("#del-ad-box").fadeIn();
                });
                //暂停、播放按钮
                $("#advert-list-table tbody tr td").on("click", ".play-btn", function() {
                    index.changeAdStatus($(this));
                });
                //编辑按钮
                $("#advert-list-table tbody tr td .edit-btn").on("click", function() {
                    addCookie('messageId', $(this).attr('data-mid'), 2);
                    window.location.href = BASEURL + 'admin/passengerFlow';
                });
                //分页
                index.adListPagi.update({
                    pageCount: pageCount,
                    pageNo: pageNo
                });
                //分页点击
                var activePage = parseInt($("#advert-list-pagination .pagination>.active").text());
                $(document).off("click", "#advert-list-pagination .pagination>li").on("click", "#advert-list-pagination .pagination>li", function() {
                    index.getAdvertList(parseInt($(this).text()));
                });
                $(document).off("click",  "#advert-list-pagination .pagination-prev").on("click", "#advert-list-pagination .pagination-prev", function() {
                    if(activePage > 1) {
                        index.getAdvertList(activePage - 1);
                    }
                });
                $(document).off("click", "#advert-list-pagination .pagination-next").on("click", "#advert-list-pagination .pagination-next", function() {
                    if(pageCount - activePage  > 0) {
                        index.getAdvertList(activePage + 1);
                    }
                });
            }else{
                //暂无数据
                $("#message-adTotal").text("0");//广告数
                $("#message-adShow").text("0");//展现量
                $("#message-adClick").text("0");//点击量
                $("#message-adClickRate").text("0");//点击率
                $("#message-validMessage").text("0");//累计广告条数
                $("#message-money").text("0");//总消费
                $("#advert-list-table>tbody").html("");
                $("#ad-no-data").show();
                $("#ad-page-show").hide();
            }
            //结束
        }
        $('.loading-area').fadeOut();
    })
    .fail(function() {
        console.log("get adList error");
        $('.loading-area').fadeOut();
    });
}
//修改广告状态
index.changeAdStatus = function(jqDom) {
    $('.loading-area').fadeIn();
    $.ajax({
        url: BASEURL + 'api/advertUpdateStatus',
        type: 'POST',
        dataType: 'json',
        data: {
            mid: jqDom.attr("data-mid"),
            status:  jqDom.attr("data-status")
        }
    })
    .done(function(data) {
        if(data.success) {
            layer.msg("操作成功！");
            var domHtml = "";
            if(jqDom.attr("data-status") == 1) {
                domHtml += "播放<span class='play-btn fa fa-pause-circle-o' data-status='0' data-mid='" + jqDom.attr("data-mid") + "' data-tipso='暂停'></span>";

            } else {
                domHtml += "暂停<span class='play-btn fa fa-play-circle-o' data-status='1' data-mid='" + jqDom.attr("data-mid") + "' data-tipso='播放'></span>";
            }
            domHtml += '<span class="trash-btn fa fa-trash" data-status="1" data-mid="271" data-tipso="删除"></span>';
            //'<span class="edit-btn fa fa-pencil" data-status="1" data-mid="271" data-tipso="编辑"></span>' +
            jqDom.parent().html(domHtml);
            //按钮提示
            $('#advert-list-table tbody tr td .fa').tipso({
                useTitle: false,
                width: 'auto',
                position: 'bottom',
                background: '#626262'
            });
        } else {
            layer.msg("操作失败！"+data.errMsg);
        }
        $('.loading-area').fadeOut();
    })
    .fail(function() {
        $('.loading-area').fadeOut();
        layer.msg("操作失败！");
        console.log("error");
    });
}
//删除广告
index.deleteAdvert = function(advertId){
    $('.loading-area').fadeIn();
    $.ajax({
        url: BASEURL + 'api/showHowAdvertDelete',
        type: 'POST',
        dataType: 'json',
        data: {
            advert_ids: "[" + advertId + "]"
        }
    })
    .done(function(data) {
        if(data.result) {
            $("#del-ad-box").fadeOut();
            layer.msg("删除成功！");
            index.getAdvertList(1);//广告列表
        } else {
            $('.loading-area').fadeOut();
            layer.msg("删除失败！"+data.errMsg);
        }
    })
    .fail(function(data) {
        $('.loading-area').fadeOut();
        layer.msg("删除失败！");
        console.log("error");
    });
}

//获取分日报告
index.getDayReportList = function(pageNo){
    $('.loading-area').fadeIn();
    var pageDataCount = 15;//每页数量（可拓展为参数）
    $.ajax({
        url: BASEURL + 'api/advertReportToEveryday',
        type: 'POST',
        dataType: 'json',
        data: {
            startTime : $("#day-startDate").val(),
            endTime : $("#day-endDate").val(),
            page : pageNo,
            pageSize : pageDataCount
        }
    })
    .done(function(data) {
        console.log(data);
        if(data.success) {
            if(data.result.ReportList.length > 0){
                //渲染
                $("#day-no-data").hide();
                $("#day-page-show").show();
                var pageCount = Math.ceil(data.result.total / pageDataCount);//计算总页数
                var html = "";
                for(var i = 0, len = data.result.ReportList.length; i < len; i++) {
                    var info = data.result.ReportList[i];
                    var showCount = info.show == null ? 0 : info.show;//展现量
                    var clickCount = info.click == null ? 0 : info.click;//点击量
                    var clickPercent = showCount == 0 ? 0 : ((clickCount / showCount) * 100).toFixed(2);//点击率
                    var dayCost = info.cost == null ? '0.00' : '' + info.cost;
                    html += '<tr>';
                    html += '<td>' + info.by_date + '</td>';
                    html += '<td>' + showCount + '</td>';
                    html += '<td>' + clickCount + '</td>';
                    html += '<td>' + clickPercent + '%</td>';
                    html += '<td>¥' + dayCost + '</td>';
                    html += '</tr>';
                }
                $("#everyday-list-table>tbody").html(html);

                //分页
                index.dayPagi.update({
                    pageCount: pageCount,
                    pageNo: pageNo
                });
                //分页点击
                var activePage = parseInt($("#everyday-list-pagination .pagination>.active").text());
                $(document).off("click", "#everyday-list-pagination .pagination>li").on("click", "#everyday-list-pagination .pagination>li", function() {
                    index.getDayReportList(parseInt($(this).text()));
                });
                $(document).off("click",  "#everyday-list-pagination .pagination-prev").on("click", "#everyday-list-pagination .pagination-prev", function() {
                    if(activePage > 1) {
                        index.getDayReportList(activePage - 1);
                    }
                });
                $(document).off("click", "#everyday-list-pagination .pagination-next").on("click", "#everyday-list-pagination .pagination-next", function() {
                    if(pageCount - activePage  > 0) {
                        index.getDayReportList(activePage + 1);
                    }
                });
            }else{
                //暂无数据
                $("#everyday-list-table>tbody").html("");
                $("#day-no-data").show();
                $("#day-page-show").hide();
            }
            //结束
        }
        $('.loading-area').fadeOut();
    })
    .fail(function() {
        console.log("error");
        $('.loading-area').fadeOut();
    });
}
//导出报告
index.getExportData = function(pageNo){
    $('.loading-area').fadeIn();
    var pageDataCount = 15;//每页数量（可拓展为参数）
    $.ajax({
        url: BASEURL + 'api/exportAdvertReport',
        type: 'POST',
        dataType: 'json',
        data: {
            startTime : $("#day-startDate").val(),
            endTime : $("#day-endDate").val(),
            page : pageNo,
            pageSize : pageDataCount
        }
    })
    .done(function(data) {
        console.log(data);
        if(data.success) {
            if(data.result.ReportList.length > 0){
                //渲染
                $("#day-no-data").hide();
                $("#day-page-show").show();
                var pageCount = Math.ceil(data.result.total / pageDataCount);//计算总页数
                var html = "";
                for(var i = 0, len = data.result.ReportList.length; i < len; i++) {
                    var info = data.result.ReportList[i];
                    var showCount = info.show == null ? 0 : info.show;//展现量
                    var clickCount = info.click == null ? 0 : info.click;//点击量
                    var clickPercent = showCount == 0 ? 0 : ((clickCount / showCount) * 100).toFixed(2);//点击率
                    var dayCost = info.cost == null ? '0.00' : '' + info.cost;
                    html += '<tr>';
                    html += '<td>' + info.by_date + '</td>';
                    html += '<td>' + showCount + '</td>';
                    html += '<td>' + clickCount + '</td>';
                    html += '<td>' + clickPercent + '%</td>';
                    html += '<td>¥' + dayCost + '</td>';
                    html += '</tr>';
                }
                $("#everyday-list-table>tbody").html(html);

                //分页
                index.dayPagi.update({
                    pageCount: pageCount,
                    pageNo: pageNo
                });
                //分页点击
                var activePage = parseInt($("#everyday-list-pagination .pagination>.active").text());
                $(document).off("click", "#everyday-list-pagination .pagination>li").on("click", "#everyday-list-pagination .pagination>li", function() {
                    index.getDayReportList(parseInt($(this).text()));
                });
                $(document).off("click",  "#everyday-list-pagination .pagination-prev").on("click", "#everyday-list-pagination .pagination-prev", function() {
                    if(activePage > 1) {
                        index.getDayReportList(activePage - 1);
                    }
                });
                $(document).off("click", "#everyday-list-pagination .pagination-next").on("click", "#everyday-list-pagination .pagination-next", function() {
                    if(pageCount - activePage  > 0) {
                        index.getDayReportList(activePage + 1);
                    }
                });
            }else{
                //暂无数据
                $("#everyday-list-table>tbody").html("");
                $("#day-no-data").show();
                $("#day-page-show").hide();
            }
            //结束
        }
        $('.loading-area').fadeOut();
    })
    .fail(function(data) {
        console.log("error");
        $('.loading-area').fadeOut();
    });
}

//芯片列表
var chipList = {};
chipList.init = function() {
    var that = this;
    this.pagi = new Pagination("#chipList-list-pagination");//分页
    this.getStatisticsInfo();//获取页面统计信息
    this.getChipListData(1);//获取列表数据
    //搜索框回车搜索
    $("#key-chipname").bind('keypress', function(event) {
        //event.preventDefault();
        if(event.keyCode == 13){
            that.getChipListData(1);//获取列表数据
        }
    });
    $("#search-chip-byname").on("click", function() {
        that.getChipListData(1);
    });
}
//获取页面统计信息
chipList.getStatisticsInfo = function(){
    $.ajax({
        url: BASEURL + 'chip/getChipSceneSum',
        type: 'POST',
        dataType: 'json',
        data: {
            user_id: ACCOUNT
        }
    })
    .done(function(data) {
        console.log(data);
        if(data.success) {
            //客户的
            var child_chipTotal = data.result.chip_sum_num == null ? 0 : data.result.chip_sum_num;//芯片总数
            var child_sceneTotal = data.result.scene_sum_num == null ? 0 : data.result.scene_sum_num;//场景总数
            $("#child-chipTotal").text(child_chipTotal);
            $("#child-sceneTotal").text(child_sceneTotal);
            //代理商自己的
            var self_chipTotal = data.result.self_chip_num == null ? 0 : data.result.self_chip_num;//芯片总数
            var self_sceneTotal = data.result.self_scene_num == null ? 0 : data.result.self_scene_num;//场景总数
            $("#self-chipTotal").text(self_chipTotal);
            $("#self-sceneTotal").text(self_sceneTotal);
            //客户总数量
            var child_totalCount = data.result.sub_num == null ? 0 : data.result.sub_num;
            $("#child-totalCount").text(child_totalCount);
        }
    })
    .fail(function() {
        $("#child-chipTotal").text("0");
        $("#child-sceneTotal").text("0");
        $("#self-chipTotal").text("0");
        $("#self-sceneTotal").text("0");
        $("#child-totalCount").text("0");
        console.log("error");
    });
}
//获取芯片列表数据
chipList.getChipListData = function(pageNo){
    $('.loading-area').fadeIn();
    var pageDataCount = 15;//每页数量（可拓展为参数）
    var searchText = $("#key-chipname").val();
    var getUser_id = ACCOUNT == "" ? $("#cur-user-id").val() : ACCOUNT;
    $.ajax({
        url: BASEURL + 'chip/getChips',
        type: 'POST',
        dataType: 'json',
        data: {
            search_name : searchText,
            user_id: getUser_id,
            page_index : pageNo,
            num_perpage : pageDataCount
        }
    })
    .done(function(data) {
        console.log(data);
        if(data.success) {
            if(data.result.datas.length > 0){
                //渲染
                $("#chipList-no-data").hide();
                $("#chipList-page-show").show();
                var pageCount = Math.ceil(data.result.filter_count / pageDataCount);//计算总页数
                var html = "";
                for(var i = 0, len = data.result.datas.length; i < len; i++) {
                    var info = data.result.datas[i];
                    var addTime = info.add_time == null ? "—— ——" : info.add_time;//添加日期
                    var chipName = info.chip_name == null ? "暂无名称" : info.chip_name;//芯片名称
                    var chipNo = info.chip_no == null ? "—— ——" : info.chip_no;//芯片码
                    var nameAdd = info.name_add == null ? "—— ——" : info.name_add;//添加人姓名
                    var phoneAdd = info.phone_add == null ? "—— ——" : info.phone_add;//添加人手机
                    var sceneNumber = info.scene_number == null ? "暂无" : info.scene_number;//场景数量
                    var childUid = info.child_uid;//芯片所属id
                    var chipId = info.chip_id;//芯片id
                    html += '<tr>';
                    html += '<td>' + chipName + '</td>';
                    html += '<td>' + chipNo + '</td>';
                    html += '<td>' + sceneNumber + '</td>';
                    html += '<td>' + nameAdd + '</td>';
                    html += '<td>' + phoneAdd + '</td>';
                    html += '<td>' + addTime + '</td>';
                    if(ACCOUNT == ""){
                        html += '<td><span class="edit-btn fa fa-pencil" data-childUid="' + childUid + '" data-chipId="' + chipId + '" data-tipso="编辑"></span>';
                        //html += '<span class="view-btn fa fa-eye" data-childUid="' + childUid + '" data-chipId="' + chipId + '" data-tipso="查看"></span></td>';
                    }else{
                        html += '<td>—— ——</td>';
                    }
                    html += '</tr>';
                }
                $("#chipList-table>tbody").html(html);
                $('#chipList-table tbody tr td .fa').tipso({
                    useTitle: false,
                    width: 'auto',
                    position: 'bottom',
                    background: '#626262'
                });
                //编辑按钮
                $("#chipList-table tbody tr td .edit-btn").on("click", function() {
                    addCookie('chipId', $(this).attr('data-chipId'), 2);
                    window.location.href = BASEURL + 'editChip/' + $(this).attr('data-chipId');
                });
                //分页
                chipList.pagi.update({
                    pageCount: pageCount,
                    pageNo: pageNo
                });
                //分页点击
                var activePage = parseInt($("#chipList-list-pagination .pagination>.active").text());
                $(document).off("click", "#chipList-list-pagination .pagination>li").on("click", "#chipList-list-pagination .pagination>li", function() {
                    chipList.getChipListData(parseInt($(this).text()));
                });
                $(document).off("click",  "#chipList-list-pagination .pagination-prev").on("click", "#chipList-list-pagination .pagination-prev", function() {
                    if(activePage > 1) {
                        chipList.getChipListData(activePage - 1);
                    }
                });
                $(document).off("click", "#chipList-list-pagination .pagination-next").on("click", "#chipList-list-pagination .pagination-next", function() {
                    if(pageCount - activePage  > 0) {
                        chipList.getChipListData(activePage + 1);
                    }
                });
            }else{
                //暂无数据
                $("#chipList-table>tbody").html("");
                $("#chipList-no-data").show();
                $("#chipList-page-show").hide();
            }
            //结束
        }
        $('.loading-area').fadeOut();
    })
    .fail(function() {
        console.log("error");
        $('.loading-area').fadeOut();
    });
}


//财务报表
var financeCenter = {};
financeCenter.init = function() {
    var dateRange = new pickerDateRange('finance-search-date', {
        isTodayValid : false,
        startDateId : 'startDate', // 开始日期输入框ID
        endDateId : 'endDate', // 结束日期输入框ID
        startDate : getDateStr(-30),
        endDate : getDateStr(0),
        isTodayValid : true,
        calendars : 2, // 展示的月份数，最大是2
        defaultText : ' - ',
        inputTrigger : 'finance-search-date',
        autoSubmit : false, //没有确定，取消按钮，直接提交
        theme : 'ta'
    });

    var that = this;
	var pagi = new Pagination("#finance-pagination");
    var accountType = $('#account-type').val();
    if (accountType == '2') {
        this.getSurplus('account/showSubCashBalance');
    } else {
        this.getSurplus('account/showAgentCashBalance');
    }
	renderFinancePageData(1);//加载列表数据
    var searchBtn = document.getElementById('ad-search-btn');
    searchBtn.onclick = function () {
        renderFinancePageData(1);
    }
	// $("#search-btn").on("click", function() {
	// 	renderFinancePageData(1);
	// });
	function renderFinancePageData(pageNo) {
		$('.loading-area').fadeIn();
		var snum = 20;//每页数量
		// var startTime = $("#startDate").val();
		// var endTime = $("#endDate").val();
        var startTime = document.getElementById("startDate");
		var endTime = document.getElementById("endDate");
		$.ajax({
			url: BASEURL + 'account/showCashDetails',
			type: 'POST',
			dataType: 'json',
			data: {
				user_id: ACCOUNT,
				start_time: startTime.value,
				end_time: endTime.value,
				page_index: pageNo,
				num_perpage: snum
			}
		})
		.done(function(data) {
			console.log(data);
			if(data.success) {
				if(data.result.datas.length > 0){
					$(".no-data").hide();
                    // var noData = document.querySelector('.no-data');
                    // noData.style.display = 'none';

					var dataListHtml = '';
					for(var i = 0; i < data.result.datas.length; i++){
						var balance = data.result.datas[i].balance;//交易后余额
						var addDate = data.result.datas[i].createdate;//时间
						var money = data.result.datas[i].money;//交易金额
						var type = data.result.datas[i].money_handle_type;//交易类型
						var subPhone = data.result.datas[i].subPhone;//子账号手机号
						var perprice = $("#per-price").val();//单价
						var advertNum = 0;
						if(perprice != 0){
							advertNum = parseInt(money / perprice);
						}
						var remarks = "无";//备注
                        var transactionType = "收入"; //交易内容
						if(type == 0){
							//给自己充值
							type = "给自己充值";
						} else if(type == 1){
							//给子账号充值
							type = "给子账号充值";
                            transactionType = "支出";
							remarks = subPhone;
						} else if(type == 2){
							//提现
							type = "提现";
                            transactionType = "支出";
						} else if(type == 3){
							//代理商给本广告主充值
							type = "代理商给本人充值";
						}

                        dataListHtml += '<tr>';
                        dataListHtml += '   <td>' + addDate + '</td>';
                        dataListHtml += '   <td>' + transactionType + '</td>';
                        dataListHtml += '   <td>' + type + '</td>';
                        dataListHtml += '   <td>¥' + money + '</td>';
                        dataListHtml += '   <td>' + advertNum + '</td>';
                        dataListHtml += '   <td>' + remarks + '</td>';
                        dataListHtml += '</tr>';
					}
					$('#financeList-data').html(dataListHtml);
					if(data.result.list_num > snum){
						var pageCount = Math.ceil(data.result.list_num / snum);
						pagi.update({
							pageCount: pageCount,
							pageNo: pageNo
						});
						var activePage = parseInt($("#finance-pagination .pagination>.active").text());
						$(document).off("click", "#finance-pagination .pagination>li").on("click", "#finance-pagination .pagination>li", function() {
							renderFinancePageData(parseInt($(this).text()));
						});
						$(document).off("click",  "#finance-pagination .pagination-prev").on("click", "#finance-pagination .pagination-prev", function() {
							if(activePage > 1) {
								renderFinancePageData(activePage - 1);
							}
						});
						$(document).off("click", "#finance-pagination .pagination-next").on("click", "#finance-pagination .pagination-next", function() {
							if(pageCount - activePage  > 0) {
								renderFinancePageData(activePage + 1);
							}
						});
					} else{
						$("#finance-pagination").html('');
					}
				}else{
					console.log("暂无数据");
					$('#financeList-data').html("");
					$(".no-data").show();
				}
			}else if(data.errMsg == "没有相关交易记录"){
				$('#financeList-data').html("");
				$(".no-data").show();
			}
			$('.loading-area').fadeOut();
		})
		.fail(function() {
			console.log("error");
			$('.loading-area').fadeOut();
		});
	}


}


financeCenter.getSurplus = function(accountUrl) {
	$.ajax({
		url: BASEURL + accountUrl,
		type: 'POST',
		dataType: 'json',
		data: {
			user_id: ACCOUNT
		}
	})
	.done(function(data) {
        console.log(data);
		if(data.success) {
			//渲染
			if(data.errCode == 200) {
				$("#finance-surplus").text(data.errMsg[0].balance);
				var perPrice = data.errMsg[0].perprice == null ? 0 : data.errMsg[0].perprice;
				var advSurplus = perPrice == 0 ? 0 : Math.floor(data.errMsg[0].balance / data.errMsg[0].perprice);
				$("#messagesOKNum").text(advSurplus);
				$("#per-price").val(perPrice);
			} else {
				$("#finance-surplus").text("0");
				$("#messagesOKNum").text("0");
				$("#per-price").val(0);
			}
		} else {
            $("#finance-surplus").text("0");
            $("#messagesOKNum").text("0");
            $("#per-price").val(0);
        }
	})
	.fail(function() {
		$("#finance-surplus").html("0");
		console.log("error");
	});
}

//客户列表（子账号）
var childAccount = {};
childAccount.init = function(){
    var that = this;
    this.pagi = new Pagination("#childAccount-list-pagination");//分页
    //状态下拉
    $(document).on("click", "#child-key-select .dropdown-menu>li", function() {
        $(this).parents("#child-key-select").attr("data-keytype", $(this).attr("data-keytype"));
    });
    //全选
    $("#select-all").on("change", function() {
        if($(this).prop("checked")) {
            $("#childAccount-table").find("input[type='checkbox']").prop("checked", true);
        } else {
            $("#childAccount-table").find("input[type='checkbox']").prop("checked", false);
        }
    });
    //关闭充值提示框
    $("#recharge-content .recharge-cancel").on("click", function() {
        $("#recharge-box").fadeOut();
    });
    $("#recharge-box .recharge-mask").on("click", function() {
        $("#recharge-box").fadeOut();
    });
    //充值确认
    $("#child-recharge-btn").on("click", function() {
        if($("#advert-recharge-num").val() == "" || parseInt($("#advert-recharge-num").val()) == 0) {
            layer.alert("请输入有效的充值条数");
            return;
        }
        that.bindRechargeEvent();
    });
    //关闭删除提示框
    $("#del-child-content .del-cancel").on("click", function() {
        $("#del-child-box").fadeOut();
    });
    $("#del-child-box .del-ad-mask").on("click", function() {
        $("#del-child-box").fadeOut();
    });
    //批量删除
    $("#all-delete-btn").on("click", function() {
        var childArr = [];
        $("#childAccount-table tbody tr td").find("input[type='checkbox']:checked").each(function() {
            childArr.push(parseInt($(this).val()));
        });
        $("#child-del-btn").attr('data-childuid', childArr).attr('data-deltype', 'many');
        $("#del-child-box").fadeIn();
    });
    //单个删除
    $("#child-del-btn").on("click", function() {
        var sub_id = '[' + $(this).attr('data-childuid') + ']';
        that.deleteChildAccount(sub_id);
    });
    //查询按钮
    $("#child-search-btn").on("click", function() {
        that.getChildListData(1);
    });
    this.getChildListData(1);
}
//获取客户列表数据
childAccount.getChildListData = function(pageNo){
    $('.loading-area').fadeIn();
    var pageDataCount = 15;//每页数量（可拓展为参数）
    var searchType = $("#child-key-select").attr("data-keytype");
    var searchNameText = "";//昵称
    var searchPhoneText = "";//手机
    if(searchType == "name"){
        searchNameText = $("#key-word").val();
    }else if(searchType == "phone"){
        searchPhoneText = $("#key-word").val();
    }
    $.ajax({
        url: BASEURL + 'account/getSubAccounts',
        type: 'POST',
        dataType: 'json',
        data: {
            sub_id : '',//子账号id（没有则为空）
            key_word : searchNameText,//搜索关键字(昵称)
            key_phone : searchPhoneText,//搜索关键字（手机）
            page_index : pageNo,//页码（1开始）
            num_perpage : pageDataCount//每页数目
        }
    })
    .done(function(data) {
        console.log(data);
        if(data.success) {
            if(data.result.sub_lists.length > 0){
                //渲染
                $("#childAccount-no-data").hide();
                $("#childAccount-page-show").show();
                $("#child-totalCount").text(data.result.sub_num);
                var pageCount = Math.ceil(data.result.filter_count / pageDataCount);//计算总页数
                var html = "";
                for(var i = 0, len = data.result.sub_lists.length; i < len; i++) {
                    var info = data.result.sub_lists[i];
                    var createDate = info.create_date == null ? "—— ——" : info.create_date;//添加日期
                    var advertiserId = info.advertiser_id;//广告主id
                    var nickName = info.nickname == null ? "暂无昵称" : info.nickname;//客户昵称
                    var subPhone = info.sub_phone == null ? "—— ——" : info.sub_phone;//客户手机
                    var sceneAuth = info.scene_auth == 1 ? "已开通" : "未开通";//场景共享权限（芯片管理）
                    var advertiseAuth = info.advertise_auth == 1 ? "已开通" : "未开通";//广告权限
                    var sceneNum = info.sceneNum == null ? "暂无" : info.sceneNum;//场景数量
                    var validCount = info.valid_count == null ? 0 : info.valid_count;//有效广告数
                    var advertisePrice = info.advertise_price == null ? 0 : info.advertise_price;//广告单价
                    var balance = info.balance == null ? 0 : info.balance;//余额
                    var advertSurplus = 0;//广告剩余条数
                    if(advertisePrice > 0 && advertisePrice != undefined && !isNaN(advertisePrice)){
                        advertSurplus = parseInt(balance / advertisePrice);
                    }
                    html += '<tr>';
                    html += '<td><input type="checkbox" id="child-account-' + advertiserId + '" class="regular-checkbox" name="child-account-' + advertiserId + '" value="' + advertiserId + '"><label for="child-account-' + advertiserId + '"></label><label for="child-account-' + advertiserId + '">' + nickName + '</label></td>';
                    html += '<td>' + subPhone + '</td>';
                    html += '<td>' + sceneAuth + '</td>';
                    html += '<td>' + sceneNum + '</td>';
                    html += '<td>' + advertiseAuth + '</td>';
                    html += '<td>' + advertisePrice + '</td>';
                    html += '<td>' + validCount + '</td>';
                    html += '<td>' + advertSurplus + '</td>';
                    html += '<td>' + createDate + '</td>';
                    html += '<td><span class="recharge-btn fa fa-cny" data-childuid="' + advertiserId + '" data-childPhone="' + subPhone + '" data-tipso="充值"></span>';
                    html += '<span class="edit-btn fa fa-pencil" data-childuid="' + advertiserId + '" data-childPhone="' + subPhone + '" data-tipso="编辑"></span>';
                    html += '<span class="delete-btn fa fa-trash" data-childuid="' + advertiserId + '" data-childPhone="' + subPhone + '" data-tipso="删除"></span>';
                    html += '<a target="_blank" href="javascript:;" class="goTo-childAccount" data-childuid="' + advertiserId + '" data-childPhone="' + subPhone + '">进入账号</a></td>';
                    html += '</tr>';
                }
                $("#childAccount-table>tbody").html(html);
                $('#childAccount-table tbody tr td .fa').tipso({
                    useTitle: false,
                    width: 'auto',
                    position: 'bottom',
                    background: '#626262'
                });
                //进入客户
                $(".goTo-childAccount").on("click", function() {
                    this.href = BASEURL + "accounts/"+$(this).attr("data-childuid") + "/"+$(this).attr("data-childPhone") + "/" + BASEINDEX;
                    console.log(this.href);
                });
                //删除按钮
                $("#childAccount-table tbody tr td .delete-btn").on("click", function() {
                    $("#child-del-btn").attr('data-childuid', $(this).attr('data-childuid')).attr('data-deltype', 'one');
                    $("#del-child-box").fadeIn();
                });
                //编辑按钮
                $("#childAccount-table tbody tr td .edit-btn").on("click", function() {
                    window.location.href = BASEURL + "CustomerEdit/" + $(this).attr('data-childuid');
                });

                //充值按钮
                $("#childAccount-table tbody tr td .recharge-btn").on("click", function() {
                    $("#child-phone").text($(this).attr('data-childPhone'));
                    $("#child-recharge-btn").attr('data-childuid', $(this).attr('data-childuid')).attr('data-childPhone', $(this).attr('data-childPhone'));
                    $.ajax({
                        url: BASEURL + 'account/showAgentCashBalance',
                        type: 'POST',
                        dataType: 'json'
                    })
                    .done(function(data) {
                        if(data.success) {
                            //渲染
                            if(data.errCode == 200) {
                                if(data.errMsg[0].perprice == null) {
                                    layer.alert("广告单价不存在，请联系客服");
                                    return;
                                }
                                var perPrice = data.errMsg[0].perprice == null ? 0 : data.errMsg[0].perprice;
                                $("#self-finance-surplus").html(data.errMsg[0].balance);
                                $("#money_balance").val(data.errMsg[0].balance);
                                $("#advert_price").val(perPrice);
                                $("#self-preprice").html(perPrice);
                            } else {
                                $("#self-finance-surplus").html("获取失败");
                                $("#self-preprice").html("—— ——");
                            }
                        } else {
                            $("#self-finance-surplus").html("获取失败");
                            $("#self-preprice").html("—— ——");
                        }
                        $("#recharge-box").fadeIn();
                    })
                    .fail(function() {
                        console.log("error");
                        $("#self-finance-surplus").html("获取失败");
                        $("#self-preprice").html("—— ——");
                        $("#recharge-box").fadeIn();
                    });
                    $("#advert-recharge-num").focus();
                });
                //分页
                childAccount.pagi.update({
                    pageCount: pageCount,
                    pageNo: pageNo
                });
                //分页点击
                var activePage = parseInt($("#childAccount-list-pagination .pagination>.active").text());
                $(document).off("click", "#childAccount-list-pagination .pagination>li").on("click", "#childAccount-list-pagination .pagination>li", function() {
                    chipList.getChipListData(parseInt($(this).text()));
                });
                $(document).off("click",  "#childAccount-list-pagination .pagination-prev").on("click", "#childAccount-list-pagination .pagination-prev", function() {
                    if(activePage > 1) {
                        chipList.getChipListData(activePage - 1);
                    }
                });
                $(document).off("click", "#childAccount-list-pagination .pagination-next").on("click", "#childAccount-list-pagination .pagination-next", function() {
                    if(pageCount - activePage  > 0) {
                        chipList.getChipListData(activePage + 1);
                    }
                });
            }else{
                //暂无数据
                $("#child-totalCount").text("0");
                $("#childAccount-table>tbody").html("");
                $("#childAccount-no-data").show();
                $("#childAccount-page-show").hide();
            }
            //结束
        }else{
            if(data.errMsg == "没有信息"){
                $("#child-totalCount").text("0");
                $("#childAccount-table>tbody").html("");
                $("#childAccount-no-data").show();
                $("#childAccount-page-show").hide();
            }
        }
        $('.loading-area').fadeOut();
    })
    .fail(function() {
        console.log("error");
        $('.loading-area').fadeOut();
    });
}
childAccount.bindRechargeEvent = function() {
    if(!checkTotalNum($("#advert-recharge-num").val())){
        return;
    }
    $('.loading-area').fadeIn();
    $.ajax({
        url: BASEURL + 'account/rechargeForSubAccount',
        type: 'POST',
        dataType: 'json',
        data: {
            sub_id: $("#child-recharge-btn").attr("data-childuid"),
            ad_num: $("#advert-recharge-num").val(),
            ad_perprice: $("#self-preprice").text()
        }
    })
    .done(function(data) {
        if(data.success) {
            //渲染
            if(data.errCode == 200) {
                layer.msg('充值成功', {icon: 6,time:2000}, function(){
                    window.location.reload();
                });
            } else {
                layer.msg('充值失败', {icon: 5,time:2000});
            }
        } else {
            layer.msg(data.errMsg, {icon: 5,time:2000});
        }
        $('.loading-area').fadeOut();
        $("#recharge-box").fadeOut();
    })
    .fail(function(data) {
        console.log("error");
        $('.loading-area').fadeOut();
        layer.msg('充值失败', {icon: 5,time:2000});
    });
    //检查是否超过最大数量
    function checkTotalNum(ad_num){
        var money = parseFloat($("#money_balance").val());//余额
        var price = parseFloat($("#advert_price").val());//单价
        if(price > 0){
            var totalNum = parseInt(money / price);
            if(parseInt(ad_num) > totalNum){
                layer.msg('充值条数不能大余最大值：' + totalNum + '条', {icon: 5,time:2000});
                return false;
            }else{
                return true;
            }
        } else {
            return false;
        }
    }
}

//批量删除
childAccount.deleteChildAccount = function(childArr){
    $('.loading-area').fadeIn();
    $.ajax({
        url: BASEURL + 'account/agentCancelLinkSubAcount',
        type: 'POST',
        dataType: 'json',
        data: {
            sub_ids : childArr
        }
    })
    .done(function(data) {
        if(data.result) {
            $("#del-child-box").fadeOut();
            layer.msg("删除成功！");
            childAccount.getChildListData(1);//广告列表
        } else {
            $('.loading-area').fadeOut();
            layer.msg("删除失败！"+data.errMsg);
        }
    })
    .fail(function(data) {
        $('.loading-area').fadeOut();
        layer.msg("删除失败！");
        console.log("error");
    });
}

//客户编辑
var customserEdit = {};
customserEdit.init = function(){
    var that = this;
    //是否勾选广告管理权限
    $("#message-manage").on("change", function() {
        if($(this).prop("checked")) {
            $("#message-box").show();
        } else {
            $("#message-box").hide();
        }
    });
    var sub_id = $("#childAccount-id").val();
    if(sub_id == ""){
        layer.ready(function(){
            layer.msg('获取信息失败，请返回重试', {icon: 5,time:2000}, function(){
                window.location.href = BASEURL + 'childAccountList';
            });
        });
    }else{
        that.getChildDetails(sub_id);
    }
    //保存按钮
    $("#submit-button").on("click", function() {
        that.saveChildInfo(sub_id);
    });
}
//获取客户详细信息
customserEdit.getChildDetails = function(sub_id){
    $('.loading-area').fadeIn();
    $.ajax({
        url: BASEURL + 'account/getSubRelateInfo',
        type: 'POST',
        dataType: 'json',
        data: {
            sub_id: sub_id
        },
    })
    .done(function(data) {
        if (data.success) {
            $("#phone-num").val(data.result.sub_phone);//子账号手机号
            $('#nick-name').val(data.result.nickname);//昵称
            data.result.scene_auth == 1 ? $("#share-scene").attr('checked', 'checked') : "";//共享场景数据权限(1：有权限)
            data.result.advertise_auth == 1 ? $("#message-manage").attr('checked', 'checked') : "";//广告管理权限（1：有权限）
            if(data.result.advertise_auth == 1){
                $("#message-box").show();
                $('#message-price').val(data.result.advertise_price);//单价
            }
            $('#unit-price').val(data.result.chip_perprice);//芯片单价
            $('#hardware-num').val(data.result.chip_num);//芯片数量
        } else {
            layer.msg(data.errMsg, {icon: 5,time:2000});
        }
        $('.loading-area').fadeOut();
    })
    .fail(function(data) {
        console.log(data);
        console.log("error");
        $('.loading-area').fadeOut();
        layer.msg('读取子账号信息失败，请刷新重试', {icon: 5,time:2000});
    });
}
//保存客户信息
customserEdit.saveChildInfo = function(sub_id){
    var childphone = $('#phone-num').val();//子账号
    var nickname = $('#nick-name').val();//昵称
    var scene_powers = $("#share-scene").prop("checked") == true ? 1 : 0;//共享场景数据权限(0:没权限，1:有权限)
    var ad_powers = $("#message-manage").prop("checked") == true ? 1 : 0;//广告管理权限(0:没权限，1:有权限)
    var ad_price = $('#message-price').val();//广告单价
    var chip_price = $('#unit-price').val();//芯片单价
    var chipNum = $('#hardware-num').val();//芯片数量
    if (!childphone) {
        layer.msg('请输入正确的子账号', {icon: 5,time:2000});
        $('#child-phone').focus();
        return;
    }
    if (!nickname) {
        layer.msg('请输入正确的账号昵称', {icon: 5,time:2000});
        $('#nick-name').focus();
        return;
    }
    if (ad_powers == 1 && !ad_price){
        layer.msg('请输入正确的广告单价', {icon: 5,time:2000});
        $('#ad-price').focus();
        return;
    }
    $('.loading-area').fadeIn();
    $.ajax({
        url: BASEURL + 'account/updateSubAccount',
        type: 'POST',
        dataType: 'json',
        data: {
            sub_phone: childphone,
            sub_nickname: nickname,
            share_premit: scene_powers,
            ad_permit: ad_powers,
            ad_perprice: ad_price,
            chip_perprice: chip_price,
            chip_num: chipNum,
            sub_id: sub_id
        },
    })
    .done(function(data) {
        if (data.success) {
            layer.msg('编辑子账号完成', {icon: 6,time:2000},function(){
                window.location.href = BASEURL + 'childAccountList';
            });
        } else {
            layer.msg(data.errMsg, {icon: 5,time:2000});
        }
        $('.loading-area').fadeOut();
    })
    .fail(function(data) {
        console.log("error");
        $('.loading-area').fadeOut();
        layer.msg('编辑子账号失败，请刷新重试', {icon: 5,time:2000});
    });
}



// 完善信息
var information = {};
information.init = function(){
	var that = this;
	$('#sceneName').val($("#scene-initial_name").val());//赋值旧名称
	$.ajax({
		url: BASEURL + 'admin/api/getScenesAtData',
		type: 'POST',
		dataType: 'json'
	})
	.done(function(data) {
		console.log(data.result);
		var AllSceneAt = '';//大的父级
		var firstSceneAt = firstSceneAt1 = '<div class="scene-item">';//一级类型
		var secondSceneAt = secondSceneAt1 = '<div class="second-level">';//二级类型
		var asdfas = data.result[0].length;
		for(var i = 0; i < data.result[0].length; i++){
			if(i < 7){
				firstSceneAt += '<a href="javascript:;" class="'+that.getSceneAtIcon(data.result[0][i].scenes_name)+'" data-second="scene-item-'+data.result[0][i].scenes_id+'" data-bigid="'+data.result[0][i].scenes_id+'">'+data.result[0][i].scenes_name+'</a>';
				secondSceneAt += '<div class="second-level-item clearfix" id="scene-item-'+data.result[0][i].scenes_id+'">';
				var index = parseInt(data.result[0][i].scenes_id);
				for(var j = 0; j < data.result[index].length; j++){
					secondSceneAt += '<a href="javascript:;" data-atid="'+data.result[index][j].scenes_id+'">'+data.result[index][j].scenes_name+'</a>';
				}
				secondSceneAt += '</div>';
			} else if(i < 14){
				firstSceneAt1 += '<a href="javascript:;" class="'+that.getSceneAtIcon(data.result[0][i].scenes_name)+'" data-second="scene-item-'+data.result[0][i].scenes_id+'" data-bigid="'+data.result[0][i].scenes_id+'">'+data.result[0][i].scenes_name+'</a>';
				secondSceneAt1 += '<div class="second-level-item clearfix" id="scene-item-'+data.result[0][i].scenes_id+'">';
				var index = parseInt(data.result[0][i].scenes_id);
				for(var j = 0; j < data.result[index].length; j++){
					secondSceneAt1 += '<a href="javascript:;" data-atid="'+data.result[index][j].scenes_id+'">'+data.result[index][j].scenes_name+'</a>';
				}
				secondSceneAt1 += '</div>';
			}
		}
		firstSceneAt += '</div>', secondSceneAt += '</div>', firstSceneAt1 += '</div>', secondSceneAt1 += '</div>';
		AllSceneAt = firstSceneAt + secondSceneAt + firstSceneAt1 + secondSceneAt1;
		$('#scene-type-list').html(AllSceneAt);
	})
	.fail(function() {
		console.log("error");
	});
	$(document).on("click", ".scene-item a", function() {
		$('.scene-item a').removeClass('on');
		$('.second-level-item').hide();
		var secondId = $(this).attr('data-second');
		$(this).addClass('on').siblings('a').removeClass('on');
		$("#"+secondId).fadeIn();
		$('#scene-big').val($(this).attr('data-bigid'));
	});
	$(document).on("click", ".second-level-item a", function() {
		$('.second-level-item a').removeClass('on');
		$(this).addClass('on');
		$('#scene-small').val($(this).attr('data-atid'));
	});
	$('#save-scene-btn').click(function() {
		var chipNo = $("#scene-chipNo").val();//芯片码
		var oldName = $("#scene-initial_name").val();//旧的名称
		if($('#sceneName').val() == ""){
			layer.msg('场景简称不能为空！', {icon: 5,time:2000});
			$('#sceneName').focus();
			return false;
		}else if($('#scene-small').val() == ""){
			layer.msg('请选择场景类型！', {icon: 5,time:2000});
			return false;
		}else if($('#city').val() == ""){
			layer.msg('省市区不能为空！', {icon: 5,time:2000});
			return false;
		}else if(chipNo == "" || oldName == ""){
			layer.msg('获取信息失败，请返回重试', {icon: 5,time:2000}, function(){
				window.location.href = BASEURL + 'scenesList';
			});
			return false;
		}
		var newName = $('#sceneName').val();//新名称
		var scenes_id = $('#scene-small').val();//类型id
		var city = $('#city').val();//城市
		var address = $('#detail-adr').val();//详细地址
		$.ajax({
			url: BASEURL + 'admin/api/updateScenesInfo',
			type: 'POST',
			dataType: 'json',
			data: {
				initial_name: oldName,
				current_name: newName,
				chip_no: chipNo,
				scenes_id: scenes_id,
				city: city,
				addr: address
			},
		})
		.done(function(data) {
			console.log(data);
			if(data.success == true && data.errMsg == "更新成功"){
				layer.msg('信息更新成功', {icon: 6,time:2000}, function(){
					window.location.href = BASEURL + 'scenesList';
				});
			}else if(data.success == false){
				layer.msg(data.errMsg, {icon: 5,time:2000});
			}
		})
		.fail(function(data) {
			console.log('error');
		});
	});
}
information.getSceneAtIcon = function(atName){
	if(atName == "美食"){
		return "food";
	} else if(atName == "生活服务"){
		return "life";
	} else if(atName == "丽人"){
		return "beauty";
	} else if(atName == "汽车"){
		return "car";
	} else if(atName == "出行服务"){
		return "travel";
	} else if(atName == "教育培训"){
		return "education";
	} else if(atName == "医疗健康"){
		return "health";
	} else if(atName == "旅游/本地游"){
		return "touring";
	} else if(atName == "房产"){
		return "house";
	} else if(atName == "本地酒店"){
		return "hotel";
	} else if(atName == "本地购物"){
		return "shopping";
	} else if(atName == "休闲娱乐"){
		return "leisure";
	} else if(atName == "体育健身"){
		return "sports";
	}
}
