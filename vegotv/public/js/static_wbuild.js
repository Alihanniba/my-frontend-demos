(function (window, undefined) {
    "use strict";
    var abstractTools = {};
    //  定义根域名
    var BASEURL = /\.dev\//.test(location.href)? 'http://api.vego.dev' : 'http://wechat.vego.tv';
    window.abstractTools = window.wb = abstractTools;

    var limitWord = {},
		transformZero = {},
		timeTransform = {},
		getUrlParam = {},
		objArr = [],
        getCacheData,
		homeArr = [];
    /**
     * 等比缩放img,减小大小
     * [replaceImgUrl description]
     * @param  {[type]} url [description]
     * @return {[type]}     [description]
     */
    abstractTools.replaceImgUrl = function (url) {
        // url = "http://res.cloudinary.com/dnz3iwzjm/image/fetch/c_scale,h_270,w_480,q_auto:best/http://52.197.255.27/gochinatv/419%E4%B8%AD%E7%A7%8B%E6%9C%88%E5%84%BF%E5%9C%861.jpg";
        var imgUrl = url || '';
        if (imgUrl.indexOf("h_270,w_480") > 0) {
            imgUrl = imgUrl.replace(/h_270,w_480/, "h_180,w_320");
        }
        return imgUrl;
    };
    /**
     * [hideLoading description]loading ui
     * @return {[type]} [description]
     */
    abstractTools.hideLoading = function() {
        $('.loading-box').hide();
        $('body').css('overflow', 'auto');
    };
    abstractTools.showLoading = function() {
        $('.loading-box').show();
        $('body').css('overflow', 'hidden');
    };
    /**
     * [homeSource description]首页数据格式转化
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    abstractTools.homeSource = function(data) {
        for (var i in data) {
            if (typeof data[i] === 'object' && !data[i].id) {
                this.homeSource(data[i]);
            } else {
                homeArr.push(data[i]);
            }
        }
        return homeArr;
    };
    /**
     * [objToArr description]对象转数组
     * @param  {[type]} obj [description]
     * @return {[type]}     [description]
     */
    abstractTools.objToArr = function(obj) {
        objArr = [];
        for (var i in obj) {
            objArr.push(obj[i]);
        }
        return objArr;
    };
    /**
     * [Rexep description]匹配数字
     * @param {[type]} text [description]
     */
    abstractTools.Rexep = function(text) {
        var value = text.replace(/[^0-9]/g, "");
        if (value.length > 1) {
            for (var i = 0, j = value.length; i < j; i++) {
                if (parseInt(value[i], 10) !== 0) {
                    return value.slice(i);
                }
            }
        }
        return value;
    };
    /**
     * [limitWord description]限定字数函数
     * @param  {[type]} word [description]
     * @param  {[type]} num  [description]
     * @return {[type]}      [description]
     */

    abstractTools.limitWord = function(word, num) {
        if (!word) {
            return '';
        }
        var word = word.toString() || '';
        var num = parseInt(num, 10) || 5;
        if (word && word.length > num) {
            return word.substr(0, num) + '...';
        }
        return word;
    };

    /**
     * [transformZero description]毫秒转时间格式函数
     * @param  {[type]} type [description]
     * @return {[type]}      [description]
     */
    abstractTools.transformZero = function(type) {
        var type = type || 0;
        if (!type || type.toString().length === 1) {
            type = 0 + '' + type;
        }
        return type;
    };

    /**
     * [timeTransform description]毫秒转时分秒函数
     * @param  {[type]} time [description]
     * @return {[type]}      [description]
     */
    abstractTools.timeTransform = function(time) {
        var time = parseInt(time, 10);
        var day = parseInt(time / 3600 / 24, 10);
        var hour = parseInt((time - day * 3600 * 24) / 3600, 10);
        var min = parseInt((time - day * 3600 * 24 - hour * 3600) / 60, 10);
        var second = parseInt(time - day * 3600 * 24 - hour * 3600 - min * 60, 10);
        // console.log(hour.toString().length);
        var formattingTime = this.transformZero(hour) + ':' + this.transformZero(min) + ':' + this.transformZero(second);
        return formattingTime;
    };

    /**
     * [getUrlParam description]获取传参
     * @param  {[type]} paraName [description]
     * @return {[type]}          [description]
     */
    abstractTools.getUrlParam = function(paraName) {
        var url = document.location.toString();
        var arrObj = url.split("?");
        if (arrObj.length > 1) {
            var arrPara = arrObj[1].split("&");
            var arr;
            for (var i = 0; i < arrPara.length; i++) {
                arr = arrPara[i].split("=");
                if (arr != null && arr[0] == paraName) {
                    return arr[1];
                }
            }
            return "";
        } else {
            return "";
        }
    };
    abstractTools.setLocalStorage = function(key, value) {
        var curTime = new Date().getTime();
        localStorage.setItem(key, JSON.stringify({
            data: value,
            time: curTime
        }));
    };
    abstractTools.getLocalStorage = function(key, exp) {
        var data = localStorage.getItem(key);
        var dataObj = JSON.parse(data);
        if (!data || new Date().getTime() - dataObj.time > exp) {
            return false;
        } else {
            var dataObjDataJson = dataObj.data;
            return dataObjDataJson;
        }
    };
    abstractTools.setCacheHandle = function(item, httpURL, time, callback) {
        if (window.localStorage) {
            //console.log(abstractTools.getLocalStorage(item, time));
            if (!abstractTools.getLocalStorage(item, time)) {
                /*缓存过期即删除*/
                localStorage.removeItem(item);
                HttpDataSource.get_http_data(httpURL, function(data) {
                    //console.log(data);
                    abstractTools.setLocalStorage(item, data);
                    //console.log('==========缓存过期,已重新获取==============')
                    // showEpisode.showEpisodeOne(abstractTools.getUrlParam('id'), data);
                    callback(data);
                })
            } else {
                getCacheData = abstractTools.getLocalStorage(item, time);
                //console.log('==========从缓存中获取==============')
                //console.log(getCacheData);
                // showEpisode.showEpisodeOne(abstractTools.getUrlParam('id'), getCacheData);
                callback(getCacheData);
            }
        }
    };
    abstractTools.log = function(id, url, code){
        var img = document.createElement('img')
        img.src= BASEURL + '/log?from=wechat&type=video' + ( id ? '&id=' + id : '' ) + '&url=' + encodeURIComponent(url) + '&code=' + code
    };
    abstractTools.youtubeID = function (url){
        var ID = null;
        var REG = /(?:youtube(?:-nocookie)?\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/i
        url = url.match(REG)
        if(url && url[1]) {
            ID = url[1];
        }
        return ID;
    };

    abstractTools.getDataSource = function (url, type, cb) {
        $.ajax({
            url: url,
            type: type,
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            headers: {
                'token': '3RZ6hfzUGHUAha'
            },
            dataType: 'json',
        })
        .done(function(data) {
            // console.log("success");
            cb(data);
        })
        .fail(function() {
            console.log("error");
        })
    };

    abstractTools.getPlayDataSource = function (url, type, cb) {
        $.ajax({
            url: url,
            type: type,
            dataType: 'json',
        })
        .done(function(data) {
            cb(data);
        })
        .fail(function() {
            console.log("error");
        })
    };
    abstractTools.fetchService = function(url, type, params, cb) {
        $.ajax({
            url: url,
            type: type,
            data: params,
            dataType: "json",
            success: function(data) {
                cb(data)
            },
            error: function(err){
                cb({err: 'error'})
            }
        });
    };

    abstractTools.getUrl = function (id) {
        return 'http://api.ottcloud.tv/smarttv/titles/production.v3.title.'+ id +'.json'
    };

    abstractTools.getEpisodesUrl = function (id, istitle, type) {
        return BASEURL + '/' + id + '/' + istitle + '/' + type;
    };
    abstractTools.is_login = function() {
      
    };
    abstractTools.save_user_info = function() {

    };
    abstractTools.get_user_info = function() {

    };
    return abstractTools;
})(window)
