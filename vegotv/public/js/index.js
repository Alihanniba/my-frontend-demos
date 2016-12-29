var mobile = {};
var INDEX = '../../data/index.json';
var HOME = '../../data/home.json';
var TXB = '../../data/tuxiaobei.json';
var HUACE = '../../data/huace.json';
var CHINABLUE = '../../data/zhonguolan.json';
/**
 * [description]全局的工具类
 * @param  {[type]} function (             [description]
 * @return {[type]}          [description]
 */
var abstractTools = (function() {
    var limitWord = {},
        transformZero = {},
        timeTransform = {},
        getUrlParam = {},
        objArr = [],
        homeArr = [];
    return {
        /**
         * [hideLoading description]loading ui
         * @return {[type]} [description]
         */
        hideLoading: function() {
            $('.loading-box').hide();
            $('body').css('overflow', 'auto');
        },
        showLoading: function() {
            $('.loading-box').show();
            $('body').css('overflow', 'hidden');
        },
        /**
         * [homeSource description]首页数据格式转化
         * @param  {[type]} data [description]
         * @return {[type]}      [description]
         */
        homeSource: function(data) {
            for (var i in data) {
                if (typeof data[i] === 'object' && !data[i].id) {
                    this.homeSource(data[i]);
                } else {
                    homeArr.push(data[i]);
                }
            }
            return homeArr;
        },
        /**
         * [objToArr description]对象转数组
         * @param  {[type]} obj [description]
         * @return {[type]}     [description]
         */
        objToArr: function(obj) {
            objArr = [];
            for (var i in obj) {
                objArr.push(obj[i]);
            }
            return objArr;
        },
        /**
         * [Rexep description]匹配数字
         * @param {[type]} text [description]
         */
        Rexep: function(text) {
            var value = text.replace(/[^0-9]/g, "");
            if (value.length > 1) {
                for (var i = 0, j = value.length; i < j; i++) {
                    if (parseInt(value[i], 10) !== 0) {
                        return value.slice(i);
                    }
                }
            }
            return value;
        },
        /**
         * [limitWord description]限定字数函数
         * @param  {[type]} word [description]
         * @param  {[type]} num  [description]
         * @return {[type]}      [description]
         */

        limitWord: function(word, num) {
            var word = word.toString() || '';
            var num = parseInt(num, 10) || 5;
            if (word && word.length > num) {
                return word.substr(0, num) + '...';
            }
            return word;
        },

        /**
         * [transformZero description]毫秒转时间格式函数
         * @param  {[type]} type [description]
         * @return {[type]}      [description]
         */
        transformZero: function(type) {
            var type = type || 0;
            if (!type || type.toString().length === 1) {
                type = 0 + '' + type;
            }
            return type;
        },

        /**
         * [timeTransform description]毫秒转时分秒函数
         * @param  {[type]} time [description]
         * @return {[type]}      [description]
         */
        timeTransform: function(time) {
            var time = parseInt(time, 10);
            var day = parseInt(time / 3600 / 24, 10);
            var hour = parseInt((time - day * 3600 * 24) / 3600, 10);
            var min = parseInt((time - day * 3600 * 24 - hour * 3600) / 60, 10);
            var second = parseInt(time - day * 3600 * 24 - hour * 3600 - min * 60, 10);
            // console.log(hour.toString().length);
            console.log(hour);
            console.log(min);
            console.log(second);
            var formattingTime = transformZero(hour) + ':' + transformZero(min) + ':' + transformZero(second);
            return formattingTime;
        },

        /**
         * [getUrlParam description]获取传参
         * @param  {[type]} paraName [description]
         * @return {[type]}          [description]
         */
        getUrlParam: function(paraName) {
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
        },
        setLocalStorage: function(key, value) {
            var curTime = new Date().getTime();
            localStorage.setItem(key, JSON.stringify({
                data: value,
                time: curTime
            }));
        },
        getLocalStorage: function(key, exp) {
            var data = localStorage.getItem(key);
            var dataObj = JSON.parse(data);
            if (!data || new Date().getTime() - dataObj.time > exp) {
                return false;
            } else {
                var dataObjDataJson = dataObj.data;
                return dataObjDataJson;
            }
        },
        setCacheHandle: function(item, httpURL, time, callback) {
            if (window.localStorage) {
                console.log(abstractTools.getLocalStorage(item, time));
                if (!abstractTools.getLocalStorage(item, time)) {
                    /*缓存过期即删除*/
                    localStorage.removeItem(item);
                    HttpDataSource.get_http_data(httpURL, function(data) {
                        console.log(data);
                        abstractTools.setLocalStorage(item, data);
                        console.log('==========缓存过期,已重新获取==============')
                            // showEpisode.showEpisodeOne(abstractTools.getUrlParam('id'), data);
                        callback(data);
                    })
                } else {
                    getCacheData = abstractTools.getLocalStorage(item, time);
                    console.log('==========从缓存中获取==============')
                    console.log(getCacheData);
                    // showEpisode.showEpisodeOne(abstractTools.getUrlParam('id'), getCacheData);
                    callback(getCacheData);
                }
            }
        }
    }
})();

/**
 * [description]渲染剧集函数
 * @param  {[type]} function (             [description]
 * @return {[type]}          [description]
 */
var showEpisode = (function() {
    var showEpisodeOne,
        contentSource = '',
        showUpdateCover;
    return {
        showEpisodeOne: function(id, data, istv) {
            for (var x = 0, y = data[id].data.length; x < y; x++) {
                contentSource = '<figure data-id="' + data[id].data[x].id + '" data-istitle="' + data[id].data[x].istitle + '" data-istv="' + istv + '">' +
                    '<img src="' + data[id].data[x].landscape_poster + '" alt="' + data[id].data[x].name + '">' +
                    '<figcaption>' + abstractTools.limitWord(data[id].data[x].description, 10) + '</figcaption>' +
                    '<p>' + abstractTools.limitWord(data[id].data[x].name, 10) + '</p>' +
                    '</figure>' + contentSource;
            }
            $('content').html(contentSource);
            contentSource = '';
        },
        showUpdateCover: function(data, istv) {
            $('.recommend').html(
                '<figure data-id="' + data[0].data[0].id + '" data-istitle="' + data[0].data[0].istitle + '" data-istv="' + istv + '">' +
                '<img src="' + data[0].data[0].landscape_poster + '" alt="' + data[0].data[0].name + '" />' +
                '<figcaption>' + abstractTools.limitWord(data[0].data[0].description, 23) + '</figcaption>' +
                '</figure>'
            );
        }
    }

})();

var HttpDataSource = (function() {
    var txb_data = [];
    var data_len;
    var count = 0;

    var handleListItems = function(model, k, len, callback) {
        // console.log("len========"+len);
        var ids = [];
        for (var i = 0; i < len; i++) {
            var ger_count = 0;
            model.getValue(['genreList', k, "genreListItems", i])
                .then(function(item) {
                    ger_count++;
                    var node_name = item[0];
                    ids.push(item[1]);
                    if (ger_count == len) {
                        var getEpisodes = episodesById(model, node_name, ids, k);
                        getEpisodes.done(function() {
                            callback(txb_data);
                        });
                    }
                });
        }
    };

    var episodesById = function(model, node_name, ids, k) {
        var deferred = $.Deferred();
        model.get([node_name, ids, ['name', 'id', 'description', 'livestream', 'landscape_poster', 'stream_url', 'source_url', 'free', 'thumbnail', 'thumbnail_interval', 'background_poster']])
            .then(function(response) {
                count++;
                if (response === undefined) return;
                var json = (node_name === "titlesById" ? response.json.titlesById : response.json.episodesById);
                var tt = [];
                for (var j = 0; j < ids.length; j++) {
                    var id = ids[j];
                    var item = json[id];
                    if (item !== undefined) {
                        node_name === "titlesById" ? item.istitle = true : item.istitle = false;
                        node_name === "titlesById" ? item.titleid = id : item.titleid = null;
                        tt.push(item);
                    }
                }
                txb_data[k].data = tt;
                if (count == data_len) {
                    deferred.resolve();
                }
            });
        return deferred.promise();
    };

    var get_titlesById = function(model, id, cb) {
        var ids = [];
        var count = 0;
        model.getValue(['titlesById', id, "episodes", "length"]).then(function(len) {
            for (var i = 0; i < len; i++) {
                (function(j) {
                    model.getValue(['titlesById', id, "episodes", j]).then(function(data) {
                        count++;
                        ids.push(data[1]);
                        if (count == len) {
                            model.get(['episodesById', ids, ['name', 'id', 'description', 'livestream', 'landscape_poster', 'stream_url', 'source_url', 'free', 'thumbnail', 'thumbnail_interval', 'background_poster']]).then(function(data) {
                                cb(data.json.episodesById);
                            });
                        }
                    });
                })(i)
            }
        });
    };

    var get_episodesById = function(model, ids, cb) {
        var count = 0;
        model.get(['episodesById', ids, ['name', 'id', 'description', 'livestream', 'landscape_poster', 'stream_url', 'source_url', 'free', 'thumbnail', 'thumbnail_interval', 'background_poster']])
            .then(function(response) {
                count++;
                var json = abstractTools.objToArr(response.json.episodesById);
                var tt = [];
                for (var j = 0; j <= ids.length; j++) {
                    var id = ids[j];
                    var item = json[id];
                    if (item !== undefined) {
                        tt.push(item);
                    }
                }
                cb(tt)
            });
    };
    return {
        get_http_data: function(url, callback) {
            window.falcor_ds = new falcor.HttpDataSource(url, {
                crossDomain: true,
                withCredentials: false
            });

            falcor_ds.get("genreList").subscribe(function(data) {
                var model = new falcor.Model({
                    cache: data.jsonGraph
                });
                window.read_only_model = model;
                console.log(model);
                model.get('genreList.length').then(function(resp) {
                    var len = resp.json.genreList.length;
                    data_len = len;
                    model.get(["genreList", {
                                from: 0,
                                to: len - 1
                            },
                            ["name", "description", "background_poster", "genreListItems.length"]
                        ])
                        .then(function(response) {
                            // console.log(response);
                            var genreList = response.json.genreList;
                            //for (var nk = 0; nk < len; nk++) {
                            //var k = nk.toString();
                            $.each(genreList, function(k, vvvvvv) {
                                if (k != "$__path") {
                                    // console.log("k=" + k);
                                    // console.log(typeof k);
                                    txb_data.push({});
                                    txb_data[k] = genreList[k];

                                    model.getValue(['genreList', k, "genreListItems", "length"]).then(function(len) {
                                        if (len == 0) {
                                            console.log("genreListItems's length should not be 0!!!!!!!!!!!!");
                                        }
                                        handleListItems(model, k, len, callback);
                                    });
                                }
                            });
                        });
                });
            });
        },
        get_titlesById: function(id, cb) {
            window.falcor_ds = window.falcor_ds || new falcor.HttpDataSource(INDEX, {
                crossDomain: true,
                withCredentials: false
            });

            falcor_ds.get("genreList").subscribe(function(data) {
                var model = new falcor.Model({
                    cache: data.jsonGraph
                });
                window.read_only_model = model;
                return get_titlesById(window.read_only_model, id, cb);
            })
        },
        get_episodesById: function(id, cb) {
            window.falcor_ds = new falcor.HttpDataSource(INDEX, {
                crossDomain: true,
                withCredentials: false
            });

            falcor_ds.get("genreList").subscribe(function(data) {
                var model = new falcor.Model({
                    cache: data.jsonGraph
                });
                window.read_only_model = model;
                return get_episodesById(window.read_only_model, id, cb);
            })
        },
    }
})();


mobile.init = function() {
    resizeHtml();
    window.onresize = function() {
        resizeHtml();
    };

    //利用javasscript根据当前屏幕宽度动态设置适配的font-size;
    function resizeHtml() {
        //set <html> font-size for rem
        document.getElementsByTagName('html')[0].style.fontSize = window.innerWidth / 10 + 'px';
    }

    $('content,.index,.recommend').on('click', 'figure', function() {
        window.location.href = '../../view/play.html?id=' + $(this).attr('data-id') + '&istitle=' + $(this).attr('data-istitle') + '&istv=' + $(this).attr('data-istv');
    })
}

mobile.indexPage = function() {
    var bannerHtml = '',
        updateHtml = '';
    $.ajax({
            url: HOME,
            type: 'POST',
            dataType: 'json',
        })
        .done(function(data) {
            if (data && abstractTools.objToArr(data['home']).length > 1) {
                var bannerSource = abstractTools.objToArr(data['home'][0]);
                var hotUpdateSource = abstractTools.homeSource(data['home'][1]);
                console.log(bannerSource);
                console.log(hotUpdateSource);
                j
                for (var i = 0, j = bannerSource.length; i < j; i++) {
                    bannerHtml = bannerHtml + '<div class="swiper-slide">' +
                        '<figure data-id="' + bannerSource[i].id + '" data-name="' + bannerSource[i].name + '"  data-istv="' + bannerSource[i].type + '" data-istitle="true">' +
                        '<img src="' + bannerSource[i].landscape_poster + '" alt="' + bannerSource[i].name + '" />' +
                        '<figcaption>' + abstractTools.limitWord(bannerSource[i].description, 20) + '</figcaption>' +
                        '</figure>' +
                        '</div>';
                }

                for (var w = 0, e = hotUpdateSource.length; w < e; w++) {
                    updateHtml = updateHtml + '<figure data-id="' + hotUpdateSource[w].id + '" data-istv="' + hotUpdateSource[w].type + '" data-istitle="true">' +
                        '<img src="' + hotUpdateSource[w].landscape_poster + '" alt="' + hotUpdateSource[w].name + '">' +
                        '<figcaption>' + abstractTools.limitWord(hotUpdateSource[w].description, 10) + '</figcaption>' +
                        '<p>' + abstractTools.limitWord(hotUpdateSource[w].name, 10) + '</p>' +
                        '</figure>'
                }
                bannerHtml = '<div class="swiper-container">' +
                    '<div class="swiper-wrapper">' +
                    bannerHtml +
                    '</div>' +
                    '<div class="swiper-pagination"></div>' +
                    '</div>';
                updateHtml = '<p>热门播放</p><div class="hot-pl-resource">' + updateHtml + '</div>';

                $('header.index').html(bannerHtml);
                $('content.hot-pl-content').html(updateHtml);
                var swiper = new Swiper('.swiper-container', {
                    pagination: '.swiper-pagination',
                    paginationClickable: true,
                    mousewheelControl: true,
                    spaceBetween: 300,
                    autoplay: 3000
                });
                abstractTools.hideLoading();
            }
        })
        .fail(function(error) {
            console.log(error);
        })
}



mobile.playPage = function() {
    var episodeSource = '';
    var episodeInfo = '';
    var id = abstractTools.getUrlParam('id');
    var istitle = abstractTools.getUrlParam('istitle');
    var istv = abstractTools.getUrlParam('istv');

    /**
     * [切换剧集]
     * @param  {[type]} function (             [description]
     * @return {[type]}          [description]
     */
    var episode = (function() {
        var video = document.getElementById('film');
        return {
            handover: function(src, title, free) {
                console.log(free);
                if (free === false || free === 'false') {
                    console.log('=========需要付费===========');
                    $('.pay-box').show();
                    $('.player').hide();
                    abstractTools.hideLoading();
                } else {
                    $('.pay-box').hide();
                    $('.player').show();
                    video.setAttribute('src', src);
                    document.title = title;
                    $('main.play-selection h4').text(title);
                    video.addEventListener("loadedmetadata", function() {
                        video.play();
                        abstractTools.hideLoading();
                    }, false);
                }
            },
            episodeInfo: function(data, episodeSource) {
                episodeInfo = '<h4>' + abstractTools.limitWord(data[0].name, 20) + '<i class="more under-more"></i></h4>' +
                    '<div class="file-info">' +
                    '<div class="file-info-one">' +
                    '<span>简介:</span>' +
                    '<div class="clip">' + data[0].description + '</div>' +
                    '</div>' +
                    '</div>';
                var playUrl = data[0].source_url !== undefined ? data[0].source_url : data[0].stream_url;
                console.log("==========mp4:   " + data[0].source_url + "===========");
                console.log("==========m3u8:  " + data[0].stream_url + "===========");
                this.handover(playUrl, data[0].name, data[0].free);
                if (episodeSource) {
                    $('content.play-selection').html(episodeSource);
                }
                $('content.play-selection li:first-child').addClass('playing');
                $('main.play-selection').html(episodeInfo);
                episodeSource = '';
            }
        }
    })();

    /**
     * [get_titlesById description]请求资源渲染剧集
     * @param  {[type]} id            [id]
     * @param  {[type]} function(data [回调函数]
     * @return {[type]}               [description]
     */
    if (istitle === 'false') {
        console.log('not  istitle');
        HttpDataSource.get_episodesById(id, function(data) {
            console.log(data);
            if (data.length > 0) {
                episode.episodeInfo(data, episodeSource);
            } else {
                alert('版权缺失');
            }
        })
    } else {
        console.log('istitle');
        HttpDataSource.get_titlesById(id, function(data) {
            console.log(data);
            if (typeof data === 'object') {
                data = abstractTools.objToArr(data);
            }
            if (data.length > 0) {
                if (istv === '1') {
                    for (var i = 0, j = data.length; i < j; i++) {
                        episodeSource = episodeSource + '<li data-url="' + data[i].source_url + '" data-title="' + data[i].name + '" data-free="' + data[i].free + '"><span>' + abstractTools.Rexep(data[i].name) + '</span><img src="../assets/icon/play1@2x.png" alt="' + data[i].name + '"></li>'
                    }
                    episodeSource = '<h4>选集</h4><div class="anthology"><div><ul class="teleplay">' + episodeSource + '</ul></div></div>';

                } else {
                    for (var i = 0, j = data.length; i < j; i++) {
                        episodeSource = '<li data-url="' + data[i].source_url + '"  data-title="' + data[i].name + '" data-free="' + data[i].free + '">' + abstractTools.limitWord(data[i].name, 26) + '</li>' + episodeSource;
                    }
                    episodeSource = '<h4>选集</h4><div class="anthology"><div><ul class="variety">' + episodeSource + '</ul></div></div>';
                }
                episode.episodeInfo(data, episodeSource);
                episodeSource = '';
                episodeInfo = '';
            } else {
                alert('版权缺失');
            }
        })
    }
    console.log(id);
    console.log(istitle);
    /**
     * [$ description]点击下拉icon 显示隐藏简介
     * @param  {[type]} '.play-selection .more'        [description]
     * @return {[type]}                  [description]
     */
    $('.play-selection').on('click', '.more', function() {
            if ($(this).hasClass('under-more')) {
                $(this).removeClass('under-more').addClass('up-more');
                $('main.play-selection .file-info .file-info-one > div').removeClass('clip').addClass('noclip');
            } else {
                $(this).removeClass('up-more').addClass('under-more');
                $('main.play-selection .file-info .file-info-one > div').removeClass('noclip').addClass('clip');
            }
        })
        /**
         * [$ description]控制剧集样式变换
         * @param  {[type]} '.anthology' [description]
         * @return {[type]}              [description]
         */
    $('content.play-selection').on('click', 'ul li', function() {
        //  var chidNodeLen = $(this).children().length;
        //  if (chidNodeLen > 0) {
        //      $(this).children().eq(0).hide().siblings().show().parent().siblings('.playing').children().eq(0).show().siblings().hide();
        //  }
        abstractTools.showLoading();
        $(this).addClass('playing').siblings().removeClass('playing');
        episode.handover($(this).attr('data-url'), $(this).attr('data-title'), $(this).attr('data-free'));
<<<<<<< HEAD
    })

    $('.pay-box button').on('click', function() {
        window.location.href = '../../view/vip.html';
=======
>>>>>>> b2890d1c049048d44fe08a7511bc001d454b34ef
    })

    $('.pay-box button').on('click', function() {
        window.location.href = '../../view/vip.html';
    })
}

mobile.cp = function() {
    sessionStorage.removeItem('actionNav');
}

mobile.cp = function() {
    sessionStorage.removeItem('actionNav');
}

mobile.recp = function() {
    var param,
        currentTitle,
        httpURL,
        cacheKey,
        cacheTime = 72000000;
    param = abstractTools.getUrlParam('cp');
    console.log(param);
    switch (param) {
        case 'txb':
            currentTitle = '兔小贝';
            httpURL = TXB;
            cacheKey = 'tuxiaobei';
            break;
        case 'hc':
            currentTitle = '华策';
            httpURL = HUACE;
            cacheKey = 'huace';
            break;
        case 'cb':
            currentTitle = '中国蓝';
            httpURL = CHINABLUE;
            cacheKey = 'chinablue';
            break;
        default:
            currentTitle = 'VegoTV';
            httpURL = INDEX;
            break;
    }
    document.title = currentTitle;

    abstractTools.setCacheHandle(cacheKey, httpURL, cacheTime, function(data) {
        console.log(data);
        var navSource = '',
            navID = 0
        allsource = '';

        if (data.length > 0) {
            if (data[data.length - 1].name === '全部') {
                for (var i = 0, j = data.length - 1; i < j; i++) {
                    navSource = navSource + '<div class="swiper-slide nav-one" data-id="' + i + '">' + data[i].name + '</div>';
                }
                allsource = allsource + '<div class="nav-one" data-id="' + (data.length - 1) + '">' + data[data.length - 1].name + '</div>';
            } else {
                for (var i = 0, j = data.length; i < j; i++) {
                    navSource = navSource + '<div class="swiper-slide nav-one" data-id="' + i + '">' + data[i].name + '</div>';
                }
                allsource = allsource + '<div class="nav-one" data-id="">全部</div>';
            }

            $('.swiper-wrapper').append(navSource);
            $('.nav-first').append(allsource);
            $('.swiper-wrapper div:first-child').addClass('nav-active');
            var swiper = new Swiper('.swiper-container', {
                pagination: '.swiper-pagination',
                slidesPerView: 'auto',
                centeredSlides: false,
                paginationClickable: true,
                spaceBetween: 0,
                // freeMode: true,
                //设定slide与左边框右边框的预设偏移量（单位px）
                slidesOffsetBefore: 0,
                slidesOffsetAfter: 0,
                slideToClickedSlide: true
            });

            $('.recp ul').on('click', '.nav-one', function() {
                if ($(this).attr('data-id') !== "") {
                    if ($(this).text() === '全部') {
                        $(this).addClass('nav-active');
                        $('.nav-updating .nav-one').removeClass('nav-active');
                        console.log('=========进来全部===========');
                    } else {
                        $(this).addClass('nav-active').siblings().removeClass('nav-active');
                        $('.nav-freeze .nav-one').removeClass('nav-active');
                        console.log('=========进来分支============');
                    }
                    var navID = parseInt($(this).attr('data-id'), 10);
                    if (param === 'hc') {
                        showEpisode.showEpisodeOne(navID, data, 1);
                    } else {
                        showEpisode.showEpisodeOne(navID, data, 0);
                    }
                    if (navID === 0) {
                        if (param === 'hc') {
                            showEpisode.showUpdateCover(data, 1);
                        } else {
                            showEpisode.showUpdateCover(data, 0);
                        }
                        $('.recommend').show();
                    } else {
                        $('.recommend').hide();
                    }
                    sessionStorage.setItem('actionNav', $(this).attr('data-id'));
                    console.log($('.swiper-wrapper').css('transform'));
                }
            })
            if (param === 'hc') {
                showEpisode.showEpisodeOne(0, data, 1);
                showEpisode.showUpdateCover(data, 1);
            } else {
                showEpisode.showEpisodeOne(0, data, 0);
                showEpisode.showUpdateCover(data, 0);
            }
            if (sessionStorage.getItem('actionNav')) {
                console.log(sessionStorage.getItem('actionNav'));
                $('li div[data-id="' + sessionStorage.getItem('actionNav') + '"]').click();
            }
            abstractTools.hideLoading();
        } else {
            console.log('===============暂无数据==============');
            abstractTools.hideLoading();
        }
    });
}

mobile.vipCenter = function() {
    var vipContent = '';
    var free = 'false';
    if (free === false) {
        vipContent = '<h1>Vego会员未开通</h1>' +
                    '<div class="not-open">' +
                        '<p>开通会员即可观看 <br> 最新、最热的影视内容,清晰、稳定的视觉体验</p>'+
                        '<div>'+
                            '<span>¥</span>'+
                            '<span>15</span>'+
                            '<span>/月</span>'+
                        '</div>'+
                    '</div>';
        $('.renew-butt .weui_btn').text('开通');
    } else {
        vipContent = '<h1>Vego会员已开通</h1>' +
                    '<div class="opened">'+
                        '<p>有效期: <span>2016/10/20</span>为止</p>'+
                        '<img src="../assets/img/win@2x.png" alt="">'+
                    '</div>';
        $('.renew-butt .weui_btn').text('续费');
    }
    $('main.vip-center').html(vipContent);
}

mobile.classify = function() {
    var classifySource = '';
    HttpDataSource.get_http_data(INDEX, function(data) {
        if (data.length > 0) {
            for (var i = 0, j = data.length; i < j; i++) {
                console.log(data[i].name);
                classifySource = classifySource + '<a class="classify-one" href="./reclassify.html?tagid=' + i + '">' + data[i].name + '</a>'
            }
            $('.classify').html(classifySource);
            classifySource = '';
            abstractTools.hideLoading();
        }
    })
}


mobile.reclassify = function() {
    var tagid,
        currentTitle,
        getCacheData;
    tagid = abstractTools.getUrlParam('tagid');

    HttpDataSource.get_http_data(INDEX, function(data) {
        console.log(data);
        if (data[tagid].name === '剧集精选') {
            showEpisode.showEpisodeOne(tagid, data, 1);
        } else {
            showEpisode.showEpisodeOne(tagid, data, 0);
        }
        document.title = data[tagid].name;
        abstractTools.hideLoading();
    })
}


mobile.video = function() {
    var video = document.getElementById('film');
    var vLength,
        totalTime,
        vTime,
        currenTime,
        progressBarWidth,
        currentWidth;

    var statusHandover = function() {
        /**
         * [$ description]切换播放暂停状态
         * @param  {[type]} '.play-pause' [description]
         * @return {[type]}               [description]
         */
        $('.play-pause').on('click', function() {
            if (video.paused) {
                video.play();
                if ($('.play-pause').hasClass('played')) {
                    $('.play-pause').removeClass('played').addClass('paused');
                } else {
                    if (!$('.play-pause').hasClass('paused')) {
                        $('.play-pause').addClass('paused');
                    }
                }
            } else {
                video.pause();
                if ($('.play-pause').hasClass('paused')) {
                    $('.play-pause').removeClass('paused').addClass('played');
                } else {
                    if (!$('.play-pause').hasClass('played')) {
                        $('.play-pause').addClass('played');
                    }
                }
            }
        })

        $('.full-screen').on('click', function() {
            if (video.requestFullscreen) {
                video.requestFullscreen();
            } else if (video.mozRequestFullScreen) {
                video.mozRequestFullScreen();
            } else if (video.webkitRequestFullscreen) {
                video.webkitRequestFullscreen();
            }
        })
    }

    if (!video.canPlayType) {
        console.log('ad');
        alert('该浏览器不支持视频播放');
    }
    video.addEventListener("canplay", function() {
        $('.controls').show();
    }, false);
    video.addEventListener("loadedmetadata", function() {
        vLength = video.duration.toFixed(1);
        totalTime = abstractTools.timeTransform(vLength);
        console.log(totalTime);
        $('.total-time').text(totalTime);
    }, false);
    video.addEventListener("timeupdate", function() {
        vTime = video.currentTime.toFixed(1);
        console.log(vTime);
        currenTime = abstractTools.timeTransform(vTime);
        $('.current-time').text(currenTime);
        progressBarWidth = $('.progress-bar').width();

        var timer = setTimeout(function() {
            clearTimeout(timer);
            console.log('================' + vTime + '===============');
            console.log('================' + vLength + '===============');
            currentWidth = (vTime / vLength) * progressBarWidth;
            console.log(currentWidth);
            $('.current-bar').width(currentWidth + 'px');
        }, 2000);
    }, false);
    video.addEventListener("pause", function() {
        $('.play-pause').removeClass('paused').addClass('played');
    }, false);
    video.addEventListener("playing", function() {
        $('.play-pause').removeClass('played').addClass('paused');
    }, false);
    statusHandover();

}