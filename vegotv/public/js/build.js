var mobile = {};
var cacheKey,
	typeName,
	isLoading = true;
/*
var INDEX = '../../data/index.json';
var TXB = '../../data/tuxiaobei.json';
var HUACE = '../../data/huace.json';
var CHINABLUE = '../../data/zhonguolan.json';
*/

var HOME = '/api/cps/home';
var INDEX = '/api/cps/index';
var TXB = '/api/cps/tuxiaobei';
var HUACE = '/api/cps/huace';
var CHINABLUE = '/api/cps/zhonguolan';
var YOUTUBE = '/api/cps/youtube';

/**
 * [description]渲染剧集函数
 * @param  {[type]} function (             [description]
 * @return {[type]}          [description]
 */
var showEpisode = (function () {
	var showEpisodeOne,
		contentSource = '',
		divBox = '',
		showUpdateCover;
	return {
		/**
		 * data: 需要渲染的数据
		 * istv : 暂无,为0
		 * nav: 1->加载数据覆盖页面,0->加载数据添加进页面
		 */
		newShowEpisodeOne: function (data, istv, nav) {
			var description;
			for (var x = 0, y = data.length; x < y; x++) {
				var figcaptionName = data[x].name ? data[x].name : '';
				var description = data[x].description ? data[x].description : '';
				var landscape_poster = data[x].landscape_poster ? data[x].landscape_poster : '';
				if (!landscape_poster) {
					contentSource = contentSource + '<figure data-id="' + data[x].id + '" data-istitle="' + data[x].istitle + '" data-istv="' + istv + '">' +
					'<img >' +
					'<figcaption>' + figcaptionName + '</figcaption>' +
					'<p>' + description + '</p>' +
					'</figure>';
				} else {
					contentSource = contentSource + '<figure data-id="' + data[x].id + '" data-istitle="' + data[x].istitle + '" data-istv="' + istv + '">' +
					'<img src="' + data[x].landscape_poster + '" alt="' + data[x].name + '">' +
					'<figcaption>' + figcaptionName + '</figcaption>' +
					'<p>' + description + '</p>' +
					'</figure>';
				}
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
		},
		showUpdateCover: function (data, istv) {
			$('.recommend').html(
				'<figure data-id="' + data[0].data[0].id + '" data-istitle="' + data[0].data[0].istitle + '" data-istv="' + istv + '">' +
				'<img src="' + data[0].data[0].landscape_poster + '" alt="' + data[0].data[0].name + '" />' +
				'<figcaption>' + abstractTools.limitWord(data[0].data[0].name ? data[0].data[0].name : data[0].data[0].description, 23) + '</figcaption>' +
				'</figure>'
			);
		}
	}

})();



mobile.init = function () {
	resizeHtml();
	window.onresize = function () {
		resizeHtml();
	};
	//利用javasscript根据当前屏幕宽度动态设置适配的font-size;
	function resizeHtml() {
		//set <html> font-size for rem
		document.getElementsByTagName('html')[0].style.fontSize = window.innerWidth / 10 + 'px';
	}
	$('content,.index,.recommend').on('click', 'figure', function () {
		// console.log(navigator.vendor);
		/**
		 * 判断安卓webview 与微信
		 * [toLowerCase description]
		 * @return {[type]} [description]
		 */
		var ua = 'navigator' in window && 'userAgent' in navigator && navigator.userAgent.toLowerCase() || '';
		var vendor = 'vendor' in navigator && navigator.vendor.toLowerCase();
		var isWeiXin = /micromessenger/i.test(ua);
		var isAndroid = /android/i.test(ua);
		var isTestChrome = /google inc/i.test(vendor);
		// if (!isWeiXin && isAndroid) {
		// 	WebViewBridge.send('{"data-id": "' + $(this).attr("data-id") + '", "data-istitle": "' + $(this).attr("data-istitle")  + '", "type": "' + cacheKey + '", "data-istv": "' + $(this).attr("data-istv") + '"}');
		// } else {
		window.location.href = '/play/' + $(this).attr('data-id') + '/?id=' + $(this).attr('data-id') + '&istitle=' + $(this).attr('data-istitle') + '&istv=' + $(this).attr('data-istv') + '&type=' + cacheKey + '&isWechat=' + window["config"].isWechat + '&name=' + encodeURI(typeName);
		// }
	})
}

mobile.indexPage = function () {
	if (!window['config'].isWechat) {
		$('.classify-area a').attr('href', '/nowechat/');
	}

	var bannerHtml = '',
		splendidnessHtml = '',
		recommendHtml = '',
		hotupdateHtml = '';
	updateHtml = '';
	cacheKey = 'index';
	$.ajax({
			url: HOME,
			type: 'GET',
			dataType: 'json',
		})
		.done(function (data) {
			//console.log(data);
			if (data && data.length > 0) {
				var bannerSource = data[0];
				var splendidnessSource = data[1];
				var recommendSource = data[2];
				var hotUpdateSource = data[3];
				for (var i = 0, j = bannerSource.length; i < j; i++) {
					bannerHtml = bannerHtml + '<div class="swiper-slide">' +
						'<figure data-id="' + bannerSource[i].id + '" data-name="' + bannerSource[i].name + '"  data-istv="' + bannerSource[i].type + '" data-istitle="' + bannerSource[i].istitle + '">' +
						'<img src="' + bannerSource[i].landscape_poster + '" alt="' + bannerSource[i].name + '" />' +
						'<figcaption>' + abstractTools.limitWord(bannerSource[i].name, 20) + '</figcaption>' +
						'</figure>' +
						'</div>';
				}
				for (var x = 0, y = splendidnessSource.length; x < y; x++) {
					splendidnessHtml = splendidnessHtml + '<figure data-id="' + splendidnessSource[x].id + '" data-istv="' + splendidnessSource[x].type + '" data-istitle="' + splendidnessSource[x].istitle + '">' +
						'<img src="' + splendidnessSource[x].landscape_poster + '" alt="' + splendidnessSource[x].name + '">' +
						'<figcaption>' + abstractTools.limitWord(splendidnessSource[x].name, 10) + '</figcaption>' +
						'</figure>';
				}
				for (var p = 0, q = recommendSource.length; p < q; p++) {
					recommendHtml = recommendHtml + '<figure data-id="' + recommendSource[p].id + '" data-istv="' + recommendSource[p].type + '" data-istitle="' + recommendSource[p].istitle + '">' +
						'<img src="' + recommendSource[p].landscape_poster + '" alt="' + recommendSource[p].name + '">' +
						'<figcaption>' + abstractTools.limitWord(recommendSource[p].name, 10) + '</figcaption>' +
						'</figure>';
				}
				for (var w = 0, e = hotUpdateSource.length; w < e; w++) {
					hotupdateHtml = hotupdateHtml + '<figure data-id="' + hotUpdateSource[w].id + '" data-istv="' + hotUpdateSource[w].type + '" data-istitle="' + hotUpdateSource[w].istitle + '">' +
						'<img src="' + hotUpdateSource[w].landscape_poster + '" alt="' + hotUpdateSource[w].name + '">' +
						'<figcaption>' + abstractTools.limitWord(hotUpdateSource[w].name, 10) + '</figcaption>' +
						'</figure>';
				}
				bannerHtml = '<div class="swiper-container">' +
					'<div class="swiper-wrapper">' +
					bannerHtml +
					'</div>' +
					'<div class="swiper-pagination"></div>' +
					'</div>';
				updateHtml = '<p>精选推荐</p><div class="hot-pl-resource">' + splendidnessHtml + '</div>' +
					'<p>热门推荐</p><div class="hot-pl-resource">' + recommendHtml + '</div>' +
					'<p>热门播放</p><div class="hot-pl-resource">' + hotupdateHtml + '</div>';


				$('header.index').html(bannerHtml);
				$('content.hot-pl-content').html(updateHtml);
				var swiper = new Swiper('.swiper-container', {
					pagination: '.swiper-pagination',
					paginationClickable: true,
					mousewheelControl: true,
					speed: 500,
					loop: true,
					autoplayDisableOnInteraction: false,
					autoplayStopOnLast: false,
					autoplay: 5000
				});
				abstractTools.hideLoading();
			}
		})
		.fail(function (error) {
			console.log(error);
		})
}



mobile.playPage = function () {
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
	// console.log(simple);
	// console.log(window['config'].user.subscription);
	if (window['config'].user && window['config'].user.subscription && window['config'].user.subscription.expired === false) {
		//console.log('==============已订阅==================');
		subscription = true;
	}
	switch (type) {
		case 'huace':
			platform = HUACE;
			break;
		case 'tuxiaobei':
			platform = TXB;
			break;
		case 'zhongguolan':
			platform = CHINABLUE;
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
	var episode = (function () {
		var video = document.getElementById('film');
		var player
		function resize(){
			var container = $('.play-selection.play-box');
			var height = container.width() * 0.5625
			container.height(height)
			$('.player', container).height(height)
			$('#film', container).height(height)
			$('#youtube', container).height(height)
		}
		$(window).on('resize', resize)
		return {
			handover: function (src, title, free, id, landscape_poster) {
				document.title = shareTitle = title;
				shareID = id;
				shareImg = landscape_poster;
				$('main.play-selection h4').html('<span>' + title + '</span>' + '<i class="more under-more"></i>');
				var yid = abstractTools.youtubeID(src)
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
				var _src = "http://chinablue.ottcloud.tv/api/v1/devices/play.js?type=wechat&serial=abc&vid=" + src;
				video.setAttribute('src', _src);
				abstractTools.hideLoading();
				$('.loading-play').show();
				video.addEventListener("loadedmetadata", function (eve) {
					$('.loading-play').hide();
					// $('.player').css('opacity', 1);
					video.play();
				}, false);

				video.addEventListener('play', function(eve){
					!window['config'].isMobile && $('.module', container).hide()
				}, false)
				video.addEventListener('pause', function(eve){
					!window['config'].isMobile && $('.module', container).show()
				}, false)

				video.addEventListener('error', function (err) {
					abstractTools.log(id, src, video.error.code)
						//abstractTools.log(null, video.currentSrc, video.error.code)
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
					wx.ready(function () {
						/**
						 * 分享到朋友圈
						 */
						wx.onMenuShareTimeline({
							title: shareTitle, // 分享标题
							link: shareLink, // 分享链接
							imgUrl: shareImg, // 分享图标
							success: function () {
								// 用户确认分享后执行的回调函数
							},
							cancel: function () {
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
							success: function () {
								// 用户确认分享后执行的回调函数
							},
							cancel: function () {
								// 用户取消分享后执行的回调函数
							}
						});
					})
				}
			},
			youtube: function (yid, id, src, container) {
				$('.player').hide();
				// see https://developers.google.com/youtube/iframe_api_reference
				var height = container.width() * 0.5625
				
				function error (event) {
						// 2 – 请求包含无效的参数值。例如，如果您指定的视频ID不足11个字符，或者如果视频ID包含无效字符（例如感叹号或星号），就会发生此错误。
						// 5 – 请求的内容无法在HTML5播放器中播放，或者发生了与HTML5播放器有关的其他错误。
						// 100 – 找不到所请求的视频。当视频已被移除（无论是何种原因）或者被标记为私有状态时，就会发生此错误。
						// 101 – 所请求的视频的所有者不允许在嵌入式播放器中播放此视频。
						// 150 – 此错误与101相同，实际就是变相的101错误！
						abstractTools.log(id, src, event.data)
				}
				if(player){
					player.loadVideoById(yid)
					player.removeEventListener('onError', error)
					return player.addEventListener('onError', error)
				}
				window.onYouTubePlayerAPIReady = function (){
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
					player.addEventListener('onStateChange', function (event) {
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
					player.addEventListener('onReady', function (event) {
						//event.target.playVideo();
						//console.log(event.player.getDuration())
					})
					player.addEventListener('onApiChange', function (event) {
						//console.log(player.getOptions())
					})
				}
				var script = document.createElement('script');
				script.setAttribute('src', '//www.youtube.com/iframe_api');
				document.body.appendChild(script);
			},
			episodeInfo: function (data, episodeSource) {
				if (!data[0].description) {
					episodeInfo = '<h4>' + '<span>' + data[0].name + '</span>'  + '</h4>';
				} else {
					episodeInfo = '<h4>' + '<span>' + data[0].name + '</span>' + '<i class="more under-more"></i></h4>' +
						'<div class="file-info">' +
						'<div class="file-info-one">' +
						'<span>简介:</span>' +
						'<div class="clip">' + data[0].description + '</div>' +
						'</div>' +
						'</div>';
				}

				var playUrl = data[0].stream_url ? data[0].stream_url : data[0].source_url;
				//console.log("==========mp4:===" + data[0].source_url + "===========");
				//console.log("==========m3u8:==" + data[0].stream_url + "===========");
				this.handover(playUrl, data[0].name, data[0].free, data[0].id, data[0].landscape_poster);
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
	var getUrl = '/api/play/' + dataParam.id + '/' + dataParam.istitle + '/' + dataParam.type
	wb.getDataSource(getUrl, 'GET', function (data) {
		// console.log(data);
		if (data.code === 200 && data.result.length > 0) {
			if (istitle === 'false') {
				episode.episodeInfo(data.result, episodeSource);
			} else {
				for (var i = 0, j = data.result.length; i < j; i++) {
					var stream_url = data.result[i].source_url;
					episodeSource = episodeSource + '<li data-url="' + stream_url + '" data-id="' + data.result[i].id + '" data-landscape="' + data.result[i].landscape_poster + '" data-title="' + data.result[i].name + '" data-free="' + data.result[i].free + '">' + data.result[i].name + '</li>'
				}
				episodeSource = '<h4>选集</h4><div class="anthology"><div><ul class="variety">' + episodeSource + '</ul></div></div>';
				episode.episodeInfo(data.result, episodeSource);
				episodeSource = '';
				episodeInfo = '';
			}
			/**
			 * [$ description]点击下拉icon 显示隐藏简介
			 * @param  {[type]} '.play-selection .more'        [description]
			 * @return {[type]}                  [description]
			 */
			$('.play-selection').on('click', '.more', function () {
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
			$('content.play-selection').on('click', 'ul li', function () {
					//  var chidNodeLen = $(this).children().length;
					//  if (chidNodeLen > 0) {
					//      $(this).children().eq(0).hide().siblings().show().parent().siblings('.playing').children().eq(0).show().siblings().hide();
					//  }
					$(this).addClass('playing').siblings().removeClass('playing');
					// $('.container').scrollTo(0);
					$('body').scrollTop(0);
					// console.log($(this).attr('data-url'));
					episode.handover($(this).attr('data-url'), $(this).attr('data-title'), $(this).attr('data-free'), $(this).attr('data-id'), $(this).attr('data-landscape'));
				})
				/**
				 * 当从分享页面进来自动跳到分享剧集
				 */
			if (simple) {
				console.log($(".anthology li[data-id='" + simple + "']"));
				$(".anthology li[data-id='" + simple + "']").click();
			}
		}

		$('.pay-box button').on('click', function () {
			if (!window['config'].isWechat) {
				window.location.href = '/nowechat/';
				return;
			}
			window.location.href = '/service/wechat/order';
		})

	});



}

mobile.cp = function () {
	sessionStorage.removeItem('actionNav');
	sessionStorage.removeItem('actionNavPosition');
}

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
								getDataSource('/api/cps/cps/', 1, 1);
							} else {
								navType = 'index';
								cacheKey = 'index';
								classifyid = 0;
								getDataSource('/api/home/', '', 2);
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

	getDataSource('/api/home/', '', 0);


	window.onscroll = function () {
		console.log('=========正在滑动============')
		if(document.body.scrollTop + $(window).height() > $(document).height() - 10 && isLoading === true){
			console.log('==============到屏幕最底部了!!!=============')
			$('.get-more').show();
			if ($('.nav-active').attr('data-id') !== '100') {
				navType = 'youtube';
				classifyid = Number($('.nav-active').attr('data-id'));
				getDataSource('/api/cps/cps/', $('.get-more').attr('data-page'), 0);
			} else {
				classifyid = $('.get-more').attr('data-classifyid');
				getDataSource('/api/home/', $('.get-more').attr('data-page'), 0);
			}
			isLoading = false;
		}
	}

}

mobile.vipCenter = function () {
	var vipContent = '';
	if (window['config'].user && window['config'].user.subscription) {
		$('.renew-butt .weui_btn').text('续费');
	}
	if (window['config'].user && window['config'].user.subscription && window['config'].user.subscription.expired === false) {
		//console.log('==============已订阅==================');
		vipContent = '<h1>Vego会员已开通</h1>' +
			'<div class="opened">' +
			'<p>有效期: <span>' + window['config'].user.subscription.next_billed_on + '</span>为止</p>' +
			'<img src="/img/win@2x.png" alt="">' +
			'</div>';
		$('main.vip-center').html(vipContent);
	}
};

mobile.classify = function () {
	var classifySource = '';
	wb.getDataSource('/api/categories/', 'GET', '', function (data) {
		if (data.code === 200 && data.result.length > 0) {
			for (var i = 0, j = data.result.length; i < j; i++) {
				classifySource = classifySource + '<a class="classify-one" href="./category?tagid=' + data.result[i].id + '">' + data.result[i].name + '</a>';
			}
			$('.classify').html(classifySource);
			classifySource = '';
			abstractTools.hideLoading();
		}
	})
};

mobile.reclassify = function () {
	$('.get-more').hide();

	var tagid,
		currentTitle,
		getCacheData;
	tagid = abstractTools.getUrlParam('tagid');
	abstractTools.hideLoading();
	cacheKey = 'index';
	console.log(BASEURL);

	function getData(nextPage) {
		var dataParam = {
			id: tagid,
			page: nextPage
		}
		wb.getDataSource('/api/categories/category/', 'POST', dataParam, function (data) {
			console.log(data);
			if (data.code === 200 && data.result.length > 0) {
				showEpisode.newShowEpisodeOne(data.result, 0, 0);
			} else {
				$('main').html('完蛋了,你要找的资源不见了...');
				$('main').addClass('game-over');
			}
		})
	}
	getData(parseInt($('.get-more').attr('data-page'), 10))

	$('.get-more').on('click', function () {
		console.log(parseInt($('.get-more').attr('data-page'), 10));
		getData(parseInt($('.get-more').attr('data-page'), 10))
	})
};

mobile.video = function () {
	var video = document.getElementById('film');
	var vLength,
		totalTime,
		vTime,
		currenTime,
		progressBarWidth,
		currentWidth;

	var statusHandover = function () {
		/**
		 * [$ description]切换播放暂停状态
		 * @param  {[type]} '.play-pause' [description]
		 * @return {[type]}               [description]
		 */
		$('.play-pause').on('click', function () {
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

		$('.full-screen').on('click', function () {
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
		function (codec) {
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
	video.addEventListener("canplay", function () {
		$('.controls').show();
	}, false);
	video.addEventListener("loadedmetadata", function () {
		vLength = video.duration.toFixed(1);
		totalTime = abstractTools.timeTransform(vLength);
		console.log(totalTime);
		$('.total-time').text(totalTime);
	}, false);
	video.addEventListener("timeupdate", function () {
		vTime = video.currentTime.toFixed(1);
		console.log(vTime);
		currenTime = abstractTools.timeTransform(vTime);
		$('.current-time').text(currenTime);
		progressBarWidth = $('.progress-bar').width();

		var timer = setTimeout(function () {
			clearTimeout(timer);
			console.log('================' + vTime + '===============');
			console.log('================' + vLength + '===============');
			currentWidth = (vTime / vLength) * progressBarWidth;
			console.log(currentWidth);
			$('.current-bar').width(currentWidth + 'px');
		}, 2000);
	}, false);
	video.addEventListener("pause", function () {
		$('.play-pause').removeClass('paused').addClass('played');
	}, false);
	video.addEventListener("playing", function () {
		$('.play-pause').removeClass('played').addClass('paused');
	}, false);
	statusHandover();

}