var mobile = {};
var cacheKey,
    typeName,
    isWechat = true,
    isMobile = true,
    isLoading = true;
/*
var INDEX = '../../data/index.json';
var TXB = '../../data/tuxiaobei.json';
var HUACE = '../../data/huace.json';
var CHINABLUE = '../../data/zhonguolan.json';
*/

//	定义根域名
var BASEURL = /\.dev\//.test(location.href) ? 'http://api.vego.dev' : 'http://wechat.vego.tv';
var HOME = BASEURL + '/api/cps/home';
var INDEX = BASEURL + '/api/cps/index';
var TXB = BASEURL + '/api/cps/tuxiaobei';
var HUACE = BASEURL + '/api/cps/huace';
var CHINABLUE = BASEURL + '/api/cps/zhonguolan';
var YOUTUBE = BASEURL + '/api/cps/youtube';

/**
 * 判断是否是微信与手机
 * isWechat
 * isMobile
 */

//js手机端PC端跳转
var sUserAgent = navigator.userAgent.toLowerCase();
var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
var bIsMidp = sUserAgent.match(/midp/i) == "midp";
var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
var bIsAndroid = sUserAgent.match(/android/i) == "android";
var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
if (!(bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM)) {
    isMobile = false;
} else {
    isMobile = true;
}

var agent = 'navigator' in window && 'userAgent' in navigator && navigator.userAgent.toLowerCase() || '';
isWechat = /micromessenger/i.test(agent);
window["config"] = { isWechat: isWechat, isMobile: isMobile };
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
        /**
         * data: 需要渲染的数据
         * istv : 暂无,为0
         * nav: 1->加载数据覆盖页面,0->加载数据添加进页面
         */
        newShowEpisodeOne: function(data, istv, nav) {
            var description;
            for (var x = 0, y = data.length; x < y; x++) {
                var figcaptionName = data[x].name ? data[x].name : '';
                var description = data[x].description ? data[x].description : '';
                var landscape_poster = data[x].landscape_poster ? data[x].landscape_poster : '';
                var imgSource = data[x].landscape_poster ? '<img src="' + data[x].landscape_poster + '" alt="' + figcaptionName + '">' : '<img >';
                contentSource = contentSource + '<figure data-id="' + data[x].id + '" data-istitle="' + data[x].istitle + '" data-istv="' + istv + '">' +
                    imgSource +
                    '<figcaption>' + figcaptionName + '</figcaption>' +
                    '<p>' + description + '</p>' +
                    '</figure>';

            }
            description = '';
            typeName = data[0].type;
            isLoading = true;

            if (data[0].classifyNum) {
                if (nav === 2) {
                    $('body').scrollTop(0);
                    $('content').html('');
                }
                if (data[0].currentPage === 1) {
                    var divBox = divBox || document.createElement('div');
                    divBox.className = 'figure-box-' + data[0].classifyId;
                    $('content').append('<p class="type-name">' + data[0].type + '</p>')
                    $('content').append(divBox);
                }

                if (nav === 1) {
                    $('body').scrollTop(0);
                    $('content').html(contentSource);
                } else {
                    $('.figure-box-' + data[0].classifyId).append(contentSource);
                }

                if (data[0].currentPage === data[0].totalPage) {
                    if ((data[0].classifyNum - data[0].classifyId === 1)) {
                        $('.get-more').hide();
                        isLoading = false;
                    } else {
                        $('.get-more').attr('data-page', 1);
                        $('.get-more').attr('data-classifyId', data[0].classifyId + 1);
                    }
                } else {
                    $('.get-more').attr('data-page', data[0].currentPage + 1);
                    $('.get-more').attr('data-classifyId', data[0].classifyId);
                }
            } else {
                $('.get-more').attr('data-page', data[0].currentPage + 1);
                if (nav === 1) {
                    $('body').scrollTop(0);
                    $('content').html(contentSource);
                } else {
                    $('content').append(contentSource);
                }
                if (data[0].currentPage === data[0].totalPage) {
                    $('.get-more').hide();
                    isLoading = false;
                }
            }
            abstractTools.hideLoading();
            contentSource = '';
        }
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
        window.location.href = './play.html?id=' + $(this).attr('data-id') + '&istitle=' + $(this).attr('data-istitle') + '&istv=' + $(this).attr('data-istv') + '&type=' + cacheKey + '&isWechat=' + window["config"].isWechat + '&name=' + encodeURI(typeName);
    })
}

mobile.playPage = function() {
    $('.get-more').hide();
    var episodeSource = '',
        episodeInfo = '',
        platform,
        shareID,
        shareTitle,
        shareLink,
        shareImg,
        subscription = window['config'].opened;
    var id = abstractTools.getUrlParam('id');
    var istitle = abstractTools.getUrlParam('istitle');
    var istv = abstractTools.getUrlParam('istv');
    var type = abstractTools.getUrlParam('type');
    var simple = abstractTools.getUrlParam('simple');

    switch (type) {
        case 'index':
            platform = INDEX;
            break;
        case 'youtube':
            platform = YOUTUBE;
            $(".player").hide();
            break;
        default:
            platform = INDEX;
            break;
    }
    /**
     * [切换剧集]
     * @param  {[type]} function (             [description]
     * @return {[type]}          [description]
     */
    var episode = (function() {
        var video = document.getElementById('film');
        var player

        function resize() {
            var container = $('.play-selection.play-box');
            var height = container.width() * 0.5625
            container.height(height)
            $('.player', container).height(height)
            $('.player-cover').height(height);
            $('#film', container).height(height)
            $('#youtube', container).height(height)
        }
        $(window).on('resize', resize)
        return {
            handover: function(src, title, free, id, landscape_poster) {
                document.title = shareTitle = title;
                $('header.bar-nav .title').text(title)
                shareID = id;
                shareImg = landscape_poster;
                $('main.play-selection h4').html('<span>' + title + '</span>' + '<i class="more under-more"></i>');
                var yid = abstractTools.youtubeID(src)
                var container = $('.play-selection.play-box');
                resize()
                if (yid) {
                    // console.log(id);
                    //$('#youtube').attr('src', "https://www.youtube.com/embed/" + id + "?version=3&autoplay=1&controls=0&autohide=0&iv_load_policy=3&rel=0&showinfo=0&disablekb=1&modestbranding=1");
                    return this.youtube(yid, id, src, $('.play-selection.play-box'));
                }
                $('#youtube').hide()
                abstractTools.showLoading();
                $('.pay-box').hide();
                //if (type !== 'youtube') {
                $('.player').show();
                //}
                var matchSRC = src.match(/http(?:s*):\/\/[^/]+/);
                var isM3U8 = /\.m3u8$/.test(src);
                // console.log(isM3U8);
                if (matchSRC) {
                    var _src = src;
                } else {
                    var _src = "http://chinablue.ottcloud.tv/api/v1/devices/play.js?type=wechat&serial=abc&vid=" + src;
                }
                // console.log(_src);
                abstractTools.hideLoading();
                $('.loading-play').show();

                if (isM3U8 && !window['config'].isMobile) {
                    var hls = new Hls();
                    hls.loadSource(_src);
                    hls.attachMedia(video);
                    hls.on(Hls.Events.MANIFEST_PARSED, function(event, data) {
                        console.log("manifest loaded, found " + data.levels.length + " quality level");
                        $('.loading-play').hide();
                        video.play();
                    });
                } else {
                    video.setAttribute('src', _src);
                }

                video.addEventListener("loadedmetadata", function(eve) {
                    $('.loading-play').hide();
                    // $('.player').css('opacity', 1);
                    video.play();
                }, false);

                video.addEventListener('play', function(eve) {
                    !window['config'].isMobile && $('.module', container).hide()
                }, false)
                video.addEventListener('pause', function(eve) {
                    !window['config'].isMobile && $('.module', container).show()
                }, false)

                video.addEventListener('error', function(err) {
                    abstractTools.log(id, src, video.error.code)
                        //abstractTools.log(null, video.currentSrc, video.error.code)
                })

                $('.player-cover').on('click', 'img', function() {
                    $('.player-cover').hide();
                    video.play();
                })

                /**
                 * 自定义微信分享
                 */
                if (document.URL.indexOf('&simple=') > 0) {
                    shareLink = document.URL.substr(0, document.URL.indexOf('&simple=')) + '&simple=' + shareID;
                } else {
                    shareLink = document.URL + "&simple=" + shareID;
                }
                if (window['config'].isWechat) {
                    wx.ready(function() {
                        /**
                         * 分享到朋友圈
                         */
                        wx.onMenuShareTimeline({
                            title: shareTitle, // 分享标题
                            link: shareLink, // 分享链接
                            imgUrl: shareImg, // 分享图标
                            success: function() {
                                // 用户确认分享后执行的回调函数
                            },
                            cancel: function() {
                                // 用户取消分享后执行的回调函数
                            }
                        });

                        /**
                         * 分享给朋友
                         */
                        wx.onMenuShareAppMessage({
                            title: shareTitle, // 分享标题
                            desc: '海外观看优质华语视频，尽在Vego TV !', // 分享描述
                            link: shareLink, // 分享链接
                            imgUrl: shareImg, // 分享图标
                            success: function() {
                                // 用户确认分享后执行的回调函数
                            },
                            cancel: function() {
                                // 用户取消分享后执行的回调函数
                            }
                        });
                    })
                }
            },
            youtube: function(yid, id, src, container) {
                $('.player').hide();
                // see https://developers.google.com/youtube/iframe_api_reference
                var height = container.width() * 0.5625

                function error(event) {
                    // 2 – 请求包含无效的参数值。例如，如果您指定的视频ID不足11个字符，或者如果视频ID包含无效字符（例如感叹号或星号），就会发生此错误。
                    // 5 – 请求的内容无法在HTML5播放器中播放，或者发生了与HTML5播放器有关的其他错误。
                    // 100 – 找不到所请求的视频。当视频已被移除（无论是何种原因）或者被标记为私有状态时，就会发生此错误。
                    // 101 – 所请求的视频的所有者不允许在嵌入式播放器中播放此视频。
                    // 150 – 此错误与101相同，实际就是变相的101错误！
                    abstractTools.log(id, src, event.data)
                }
                if (player) {
                    player.loadVideoById(yid)
                    player.removeEventListener('onError', error)
                    return player.addEventListener('onError', error)
                }
                window.onYouTubePlayerAPIReady = function() {
                    console.log('============ 进入     window.onYouTubePlayerAPIReady   方法 =================')
                    player = new YT.Player('youtube', {
                        playerVars: {
                            autoplay: 1,
                            controls: window['config'].isMobile ? 1 : 1,
                            autohide: 0,
                            iv_load_policy: 3,
                            modestbranding: 1,
                            rel: 0,
                            showinfo: 0
                        },
                        height: height,
                        width: '100%',
                        videoId: yid
                    });
                    abstractTools.hideLoading();
                    player.addEventListener('onError', error)
                    player.addEventListener('onStateChange', function(event) {
                        /*
                        YT.PlayerState.UNSTARTED
                        YT.PlayerState.ENDED
                        YT.PlayerState.PLAYING
                        YT.PlayerState.PAUSED
                        YT.PlayerState.BUFFERING
                        YT.PlayerState.CUED
                        */
                        if (event.data === YT.PlayerState.PAUSED) {
                            // show qrcode
                            !window['config'].isMobile && $('.module', container).show()
                        } else {
                            // hide qrcode
                            !window['config'].isMobile && $('.module', container).hide()
                        }
                    })
                    player.addEventListener('onReady', function(event) {
                        //event.target.playVideo();
                        //console.log(event.player.getDuration())
                        console.log('onReady');
                    })
                    player.addEventListener('onApiChange', function(event) {
                        //console.log(player.getOptions())
                    })
                }
                var script = document.createElement('script');
                script.setAttribute('src', '//www.youtube.com/iframe_api');
                document.body.appendChild(script);
            },
            episodeInfo: function(data, episodeSource, douban_rating, landscapePoster) {
                /**
                 * 加入豆瓣评分
                 */
                var doubanRating = '';
                var starInfo = '';
                var gradeArr = [{
                    "grade": 0,
                    "position": [
                        "0 -140px"
                    ]
                }, {
                    "grade": 1,
                    "position": [
                        "0 -126px"
                    ]
                }, {
                    "grade": 2,
                    "position": [
                        "0 -112px"
                    ]
                }, {
                    "grade": 3,
                    "position": [
                        "0 -98px"
                    ]
                }, {
                    "grade": 4,
                    "position": [
                        "0 -84px"
                    ]
                }, {
                    "grade": 5,
                    "position": [
                        "0 -70px"
                    ]
                }, {
                    "grade": 6,
                    "position": [
                        "0 -56px"
                    ]
                }, {
                    "grade": 7,
                    "position": [
                        "0 -42px"
                    ]
                }, {
                    "grade": 8,
                    "position": [
                        "0 -28px"
                    ]
                }, {
                    "grade": 9,
                    "position": [
                        "0 -14px"
                    ]
                }, {
                    "grade": 10,
                    "position": [
                        "0 0px"
                    ]
                }]
                if (douban_rating && Number(douban_rating) > -1 && Number(douban_rating) < 11) {
                    doubanRating = Math.round(Number(douban_rating));
                    console.log(Math.round(Number(douban_rating)))
                    var starPosition = gradeArr[doubanRating].position;
                    starInfo = '<div class="file-info-one">' +
                        '<span>豆瓣评分:</span>' +
                        '<span>' + douban_rating + '</span>' +
                        '<span class="douban-rating" style="background-position: ' + starPosition + ';"></span>' +
                        '</div>';
                }
                if (landscapePoster) {
                    $('.player-cover').css({
                        'background': 'url(' + landscapePoster + ') no-repeat;',
                        'background-size': '100% 100%;'
                    });
                }
                if (!data[0].description && !douban_rating) {
                    episodeInfo = '<h4>' + '<span>' + data[0].name + '</span>' + '</h4>';
                } else {
                    episodeInfo = '<h4>' + '<span>' + data[0].name + '</span>' + '<i class="more under-more"></i></h4>' +
                        '<div class="file-info">' +
                        '<div class="file-info-one">' +
                        '<span>简介:</span>' +
                        '<div class="clip">' + data[0].description + '</div>' +
                        '</div>' +
                        starInfo +
                        '</div>';
                }

                var playUrl = data[0].stream_url ? data[0].stream_url : data[0].source_url;
                //console.log("==========mp4:===" + data[0].source_url + "===========");
                //console.log("==========m3u8:==" + data[0].stream_url + "===========");
                var landscape_poster = data[0].landscape_poster ? data[0].landscape_poster : data[0].portrait_poster;
                this.handover(playUrl, data[0].name, data[0].free, data[0].id, landscape_poster);
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
    var dataParam = {
        id: id,
        istitle: istitle,
        type: type
    };

    // if (istitle === true || istitle === 'true') {
    // 	var getUrl = abstractTools.getUrl(dataParam.id);
    // } else {
    // 	//暂缓处理，API确认后做处理
    // 	var getUrl = abstractTools.getEpisodesUrl(dataParam.id, dataParam.istitle, dataParam.type)
    // }

    var getUrl = abstractTools.getUrl(dataParam.id);

    wb.getPlayDataSource(getUrl, 'GET', function(data) {
        console.log(data);
        var episodesByIdSource = data.jsonGraph.episodesById;
        var titlesByIdSource = data.jsonGraph.titlesById;
        var douban_rating = '';
        var landscapePoster = '';

        var titlesByIdArray = [];
        for (var j in titlesByIdSource) {
            titlesByIdArray.push(titlesByIdSource[j]);
        }

        try {
            douban_rating = titlesByIdArray[0].douban_rating;
            landscapePoster = titlesByIdArray[0].landscape_poster ? titlesByIdArray[0].landscape_poster : titlesByIdArray[0].portrait_poster
        } catch (error) {
            console.log(error);
        }
        console.log(douban_rating);
        var episodesByIdArray = [];
        for (var i in episodesByIdSource) {
            episodesByIdArray.push(episodesByIdSource[i])
        }
        // console.log(episodesByIdArray);
        if (episodesByIdArray.length > 0) {
            for (var i = 0, j = episodesByIdArray.length; i < j; i++) {
                var stream_url = episodesByIdArray[i].stream_url ? episodesByIdArray[i].stream_url : episodesByIdArray[i].source_url;
                var landscape_poster = episodesByIdArray[i].landscape_poster ? episodesByIdArray[i].landscape_poster : episodesByIdArray[i].portrait_poster;
                episodeSource = episodeSource + '<li data-url="' + stream_url + '" data-id="' + episodesByIdArray[i].id + '" data-landscape="' + landscape_poster + '" data-title="' + episodesByIdArray[i].name + '" data-free="' + episodesByIdArray[i].free + '">' + episodesByIdArray[i].name + '</li>'
                stream_url = landscape_poster = '';
            }
            episodeSource = '<h4>选集</h4><div class="anthology"><div><ul class="variety">' + episodeSource + '</ul></div></div>';
            episode.episodeInfo(episodesByIdArray, episodeSource, douban_rating, landscapePoster);
            episodeSource = episodeInfo = '';

            /**
             * [$ description]点击下拉icon 显示隐藏简介
             * @param  {[type]} '.play-selection .more'        [description]
             * @return {[type]}                  [description]
             */
            $('.play-selection').on('click', '.more', function(event) {
                    event.stopPropagation();
                    if ($('.more').hasClass('under-more')) {
                        $('.more').removeClass('under-more').addClass('up-more');
                        $('main.play-selection .file-info .file-info-one > div').removeClass('clip').addClass('noclip');
                    } else {
                        $('.more').removeClass('up-more').addClass('under-more');
                        $('main.play-selection .file-info .file-info-one > div').removeClass('noclip').addClass('clip');
                    }
                })
                /**
                 * [$ description]控制剧集样式变换
                 * @param  {[type]} '.anthology' [description]
                 * @return {[type]}              [description]
                 */
            $('content.play-selection').on('click', 'ul li', function() {
                    $(this).addClass('playing').siblings().removeClass('playing');
                    $('body').scrollTop(0);
                    episode.handover($(this).attr('data-url'), $(this).attr('data-title'), $(this).attr('data-free'), $(this).attr('data-id'), $(this).attr('data-landscape'));
                })
                /**
                 * 当从分享页面进来自动跳到分享剧集
                 */
            if (simple) {
                console.log($(".anthology li[data-id='" + simple + "']"));
                $(".anthology li[data-id='" + simple + "']").click();
            }
        } else {
            $('body').html('完蛋了,你要找的资源不见了...');
            $('body').addClass('game-over');
        }

        $('.pay-box button').on('click', function() {
            if (!window['config'].isWechat) {
                window.location.href = '/nowechat/';
                return;
            }
            window.location.href = '/service/wechat/order';
        })
    });
}

/**
 * youtube隐藏版
 */

// mobile.recp_noyoutube = function() {
//     // $('.get-more').hide();
//     // abstractTools.hideLoading();
//     var param,
//         currentTitle,
//         httpURL,
//         navID = '',
//         classifyid = '',
//         navType = 'index';
//     /**
//      * cacheKey 全局变量定义资源来源
//      */
//     cacheKey = 'index';

//     function getDataSource(url, page, replace) {
//         var navSource = '',
//             allsource = '';
//         var dataParam = {
//             type: navType,
//             id: classifyid,
//             page: page || 1
//         };
//         var getUrl = url + '/' + dataParam.page + '/' + dataParam.id;
//         wb.getDataSource(getUrl, 'GET', function(data) {
//             if (data.code === 200 && data.result.length > 0) {
//                 // console.log(data.result);
//                 if (!dataParam.id && dataParam.id !== 0) {
//                     var navDataSource = data.result[1];
//                     for (var i = 0, j = navDataSource.length; i < j; i++) {
//                         navSource = navSource + '<div class="swiper-slide nav-one" data-id="' + navDataSource[i].id + '">' + navDataSource[i].name + '</div>';
//                     }
//                     $('.swiper-wrapper').append(navSource);
//                     $('.swiper-wrapper div:first-child').addClass('nav-active');
//                     var swiper = new Swiper('.swiper-container', {
//                         pagination: '.swiper-pagination',
//                         slidesPerView: 'auto',
//                         centeredSlides: false,
//                         spaceBetween: 0,
//                         // freeMode: true,
//                         //设定slide与左边框右边框的预设偏移量（单位px）
//                         slidesOffsetBefore: 0,
//                         slidesOffsetAfter: 0,
//                     });
//                     // console.log(data.result[0]);
//                     /**
//                      * 渲染导航条
//                      */
//                     $('.recp ul').on('click', '.nav-one', function() {
//                         typeName = $(this).text();
//                         if ($(this).attr('data-id') !== "") {
//                             $(this).addClass('nav-active').siblings().removeClass('nav-active');
//                             navID = parseInt($(this).attr('data-id'), 10);
//                             // getDataSource('', 1);
//                             classifyid = Number($(this).attr('data-id'));
//                             getDataSource(BASEURL + '/api/categories/category', 1, 1);
//                             sessionStorage.setItem('actionNav', $(this).attr('data-id'));
//                             var transformMatrix = $('.swiper-wrapper').css('transform').replace(/[^0-9\-.,]/g, '').split(',')
//                                 //console.log(transformMatrix[0].substring(1));
//                             if (transformMatrix[0].substring(1)) {
//                                 sessionStorage.setItem('actionNavPosition', transformMatrix[0].substring(1));
//                             }
//                         }
//                     })
//                     if (sessionStorage.getItem('actionNav')) {
//                         //console.log(sessionStorage.getItem('actionNav'));
//                         //console.log(sessionStorage.getItem('actionNavPosition'));
//                         $('.swiper-wrapper').css('transform', 'translate3d(' + sessionStorage.getItem('actionNavPosition') + 'px, 0px, 0px)');
//                         $('li div[data-id="' + sessionStorage.getItem('actionNav') + '"]').click();
//                     }
//                 }
//                 if (replace === 1) {
//                     showEpisode.newShowEpisodeOne(data.result[0], 0, 1);
//                 } else if (replace === 2) {
//                     showEpisode.newShowEpisodeOne(data.result[0], 0, 2);
//                 } else {
//                     showEpisode.newShowEpisodeOne(data.result[0], 0, 0);
//                 }
//             } else {
//                 $('main').html('完蛋了,你要找的资源不见了...');
//                 $('main').addClass('game-over');
//             }
//         })
//     }
//     getDataSource(BASEURL + '/api/categories/category', '', 0);
//     window.onscroll = function() {
//         console.log('=========正在滑动============')
//         if (document.body.scrollTop + $(window).height() > $(document).height() - 10 && isLoading === true) {
//             console.log('==============到屏幕最底部了!!!=============')
//             $('.get-more').show();
//             classifyid = $('.nav-one').attr('data-id');
//             getDataSource(BASEURL + '/api/categories/category', $('.get-more').attr('data-page'), 0);
//             isLoading = false;
//         }
//     }
// }


mobile.recp = function () {
	// $('.get-more').hide();
	// abstractTools.hideLoading();
	var param,
		currentTitle,
		httpURL,
		navID = '',
		classifyid = '',
		navType = 'index';
	param = abstractTools.getUrlParam('cp');
	cacheKey = 'index';
	/**
	 * cacheKey 全局变量定义资源来源
	 */

	function getDataSource(url, page, replace) {
		var navSource = '',
			allsource = '';
		var dataParam = {
			type: navType,
			id: classifyid,
			page: page || 1
		};
		var getUrl = url + '/' + dataParam.type + '/' + dataParam.page + '/' + dataParam.id;
		wb.getDataSource(getUrl, 'GET', function (data) {
			if (data.code === 200 && data.result.length > 0) {
				// console.log(data.result);
				if (!dataParam.id && dataParam.id !== 0) {
					var navDataSource = data.result[1];
					for (var i = 0, j = navDataSource.length; i < j; i++) {
						navSource = navSource + '<div class="swiper-slide nav-one" data-id="' + navDataSource[i].id + '">' + navDataSource[i].name + '</div>';
					}
					$('.swiper-wrapper').append(navSource);
					$('.swiper-wrapper div:first-child').addClass('nav-active');
					var swiper = new Swiper('.swiper-container', {
						pagination: '.swiper-pagination',
						slidesPerView: 'auto',
						centeredSlides: false,
						spaceBetween: 0,
						// freeMode: true,
						//设定slide与左边框右边框的预设偏移量（单位px）
						slidesOffsetBefore: 0,
						slidesOffsetAfter: 0,
					});
					// console.log(data.result[0]);
					/**
					 * 渲染导航条
					 */
					$('.recp ul').on('click', '.nav-one', function () {
						typeName = $(this).text();
						if ($(this).attr('data-id') !== "") {
							$(this).addClass('nav-active').siblings().removeClass('nav-active');
							navID = parseInt($(this).attr('data-id'), 10);
							// getDataSource('', 1);
							if ($(this).attr('data-id') !== "100") {
								navType = 'youtube';
								cacheKey = 'youtube';
								classifyid = Number($(this).attr('data-id'));
								getDataSource(BASEURL + '/api/cps/cps', 1, 1);
							} else {
								navType = 'index';
								cacheKey = 'index';
								classifyid = 0;
								getDataSource(BASEURL + '/api/home', '', 2);
							}

							sessionStorage.setItem('actionNav', $(this).attr('data-id'));
							var transformMatrix = $('.swiper-wrapper').css('transform').replace(/[^0-9\-.,]/g, '').split(',')
								//console.log(transformMatrix[0].substring(1));
							if (transformMatrix[0].substring(1)) {
								sessionStorage.setItem('actionNavPosition', transformMatrix[0].substring(1));
							}
						}
					})
					if (sessionStorage.getItem('actionNav')) {
						//console.log(sessionStorage.getItem('actionNav'));
						//console.log(sessionStorage.getItem('actionNavPosition'));
						$('.swiper-wrapper').css('transform', 'translate3d(' + sessionStorage.getItem('actionNavPosition') + 'px, 0px, 0px)');
						$('li div[data-id="' + sessionStorage.getItem('actionNav') + '"]').click();
					}
				}
				if (replace === 1) {
					showEpisode.newShowEpisodeOne(data.result[0], 0, 1);
				} else if (replace === 2) {
					showEpisode.newShowEpisodeOne(data.result[0], 0, 2);
				} else {
					showEpisode.newShowEpisodeOne(data.result[0], 0, 0);
				}
			} else {
				$('main').html('完蛋了,你要找的资源不见了...');
				$('main').addClass('game-over');
			}
		})
	}

	getDataSource(BASEURL + '/api/home', '', 0);


	window.onscroll = function () {
		console.log('=========正在滑动============')
		if(document.body.scrollTop + $(window).height() > $(document).height() - 10 && isLoading === true){
			console.log('==============到屏幕最底部了!!!=============')
			$('.get-more').show();
			if ($('.nav-active').attr('data-id') !== '100') {
				navType = 'youtube';
				classifyid = Number($('.nav-active').attr('data-id'));
				getDataSource(BASEURL + '/api/cps/cps', $('.get-more').attr('data-page'), 0);
			} else {
				classifyid = $('.get-more').attr('data-classifyid');
				getDataSource(BASEURL + '/api/home', $('.get-more').attr('data-page'), 0);
			}
			isLoading = false;
		}
	}

}

mobile.login = function() {
    var can_login = false,
        signin_service = "http://chinavrs.ottcloud.tv/api/v1/signin.json";
    // signout_service         http://chinavrs.ottcloud.tv/api/v1/signout.json
    $('#register-emial').bind('blur', function() {
        console.log($("#register-emial").val())
    });
    $('#register-emial').bind('tap', function(e) {
        console.log("register");
        return false
    });
    $('#register-login').bind('tap', function() {
        var params = {
            email: $('#register-emial').val(),
            password: $('#register-pwd').val()
        };
        //user verification
        abstractTools.fetchService(signin_service, "POST", params, function(data) {
            // user verification success goto index page
            if (data.token) {
                abstractTools.setLocalStorage('user_token', data.token);
                location.href = "../index.html"
            } else { // login error show error tip
                $(".error-tip").show();
            }
        })
    });
    //register page
    $('#register-sign').bind('tap', function() {
        location.href = "../register.html"
    });
}
mobile.register = function() {
    var signup_service = "http://chinavrs.ottcloud.tv/api/v1/signup.json",
        email_flag = false;
    pwd_flag = false;
    rpwd_flag = false;
    //verification user email
    $("#login-email").bind('blur', function() {
        var email = $("#login-email").val();
        email_flag = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(email);
        show_err_tip("#email-err-tip", email_flag);
    });
    //verification user password
    $("#login-pwd").bind('blur', function() {
            pwd_flag = $("#login-pwd").val().length >= 8;
            show_err_tip("#pwd-err-tip", pwd_flag);
        })
        //verification entered passwords differ
    $("#login-rpwd").bind('blur', function() {
        rpwd_flag = $("#login-pwd").val() == $("#login-rpwd").val();
        show_err_tip("#rpwd-err-tip", rpwd_flag);
    });
    /**
     * [show_err_tip show or hide error-tip]
     * @param  {[type]} ele  [description]
     * @param  {[type]} flag [description]
     */
    var show_err_tip = function(ele, flag) {
        if (!flag) {
            $(ele).show();
            return
        }
        $(ele).hide();
    };
    $("#register-span").bind('tap', function() {
        if (email_flag == false || pwd_flag == false || rpwd_flag == false) {
            return
        }
        var params = {
                'member[email]': $("#login-email").val(),
                'member[password]': $("#login-pwd").val(),
                'member[password_confirmation]': $("#login-rpwd").val(),
            }
            //login service
        abstractTools.fetchService(signup_service, "POST", params, function(data) {
            //register success goto login page
            if (data.token) {
                location.href = '../login.html';
            } else if (data.status = -1) { //already register
                setTimeout(function() {
                    location.href = '../login.html'
                }, 3000)
            }
        })
    });
};
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
    var mp4 = ['avc1.42E01E', 'avc1.58A01E', 'avc1.4D401E', 'avc1.64001E', 'mp4v.20.8', 'mp4v.20.240', 'mp4a.40.2'].map(
        function(codec) {
            return 'video/mp4; codecs="' + codec + ', mp4a.40.2"'
        })
    var support = video.canPlayType('application/x-mpegurl')
    if (!support) {
        //console.log('ad');
        //alert('该浏览器不支持视频播放');
    }
    /*
    video.addEventListener('error', function(err){
    	abstractTools.log(video.currentSrc,video.error.code)
    })
    */
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
        }, 300);
    }, false);
    video.addEventListener("pause", function() {
        $('.play-pause').removeClass('paused').addClass('played');
    }, false);
    video.addEventListener("playing", function() {
        $('.play-pause').removeClass('played').addClass('paused');
    }, false);
    /**
     * [description]点击进度条事件
     * @param  {[type]} event) {		console.log(event.clientX);		var x [description]
     * @return {[type]}        [description]
     */
    $('.progress-bar').on('click', function(event) {
        console.log(event.clientX);
        var x = event.clientX - document.querySelector('.progress-bar').offsetLeft;
        var y = x / document.querySelector('.progress-bar').offsetWidth;
        video.currentTime = video.duration * y;
    })

    /**
     * [description]进度条拖拽事件，有点延迟，需优化
     * @param  {[type]} event) {		var       _self [description]
     * @return {[type]}        [description]
     */
    $('.current-ball').on('mousedown', function(event) {
        var _self = this;
        var x = event.clientX;
        var w = parseInt($('.current-bar').css('width'));
        var currentTime = video.currentTime;
        video.pause();
        $(document).on('mousemove.drag', function(e) {
            var addLeft = e.clientX - x;
            var lastWidth = w + addLeft;
            if (lastWidth > document.querySelector('.progress-bar').offsetWidth) {
                lastWidth = document.querySelector('.progress-bar').offsetWidth;
            }
            if (lastWidth < 0) {
                lastWidth = 0;
            }
            var g = lastWidth / document.querySelector('.progress-bar').offsetWidth;
            currentTime = video.duration * g;
        })
        $(document).on('mouseup', function() {
            $(this).off('mousemove').off('mouseup');
            video.currentTime = currentTime;
            video.play();
        })
        return false;
    })
    statusHandover();

}