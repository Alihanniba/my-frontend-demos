"use strict";

var share = {};

/**
 * [initWindow: init a new window to open]
 * @param  {[type]} url    [which url you want to locate]
 * @param  {[type]} width  [the width of the new window]
 * @param  {[type]} height [the height of the new window]
 * @return {[type]}        [description]
 */
var initWindow = function (url, width, height) {
	var iWidth = width; //弹出窗口的宽度;
    var iHeight = height; //弹出窗口的高度;
    //获得窗口的垂直位置
    var iTop = (window.screen.availHeight - iHeight) / 2;
    //获得窗口的水平位置
    var iLeft = (window.screen.availWidth - iWidth) / 2;
    window.open(url, "testwin", 'height=' + iHeight + ', innerHeight=' + iHeight + ',width=' + iWidth + ',innerWidth=' + iWidth + ',top=' + iTop + ',left=' + iLeft);
};

/**
 * [initTencent: for tencent like qzone, qq or qqweibo]
 * @param  {[type]} type   [type of tencent: 'qq', 'qzone', 'qqweibo']
 * @param  {[type]} object [the object which you want to bind to]
 * @param  {[type]} title  [set the title of the share]
 * @param  {[type]} image  [set the image of the share]
 * @return {[type]}        [description]
 */
share.initTencent = function (type, object, title, image) {
"use strict";
    var p = {
        url: location.href,
        desc: '',
        /*默认分享理由(可选)*/
        summary: '',
        /*分享摘要(可选)*/
        title: title,
        /*分享标题(可选)*/
        site: 'Voice In',
        /*分享来源*/
        pics: image
        /*分享图片的路径(可选)*/
    };
    var s = [];
    for (var i in p) {
        s.push(i + '=' + encodeURIComponent(p[i] || ''));
    }
    
    switch (type) {
		case 'qq':
			object.click(function() {
		    	initWindow('http://connect.qq.com/widget/shareqq/index.html?' + s.join('&'), 730, 588);
		    });
			break;
		case 'qzone':
			object.click(function() {
		    	initWindow('http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?' + s.join('&'), 600, 588);
		    });
			break;
	}
};

/**
 * [initWeibo: for sina weibo]
 * @param  {[type]} appkey [the app key from sina open api(http://open.weibo.com/)]
 * @param  {[type]} object [the object which you want to bind to]
 * @param  {[type]} title  [set the title of the share]
 * @param  {[type]} image  [set the image of the share]
 * @return {[type]}        [description]
 */
share.initWeibo = function (appkey, object, title, image) {
"use strict";
	$.getScript('http://tjs.sjs.sinajs.cn/open/api/js/wb.js?appkey=' + appkey)
	.done(function(){
		WB2.anyWhere(function(W){
		    W.widget.publish({
		        'id': object.selector.substr(1, object.selector.length - 1),
		        'default_text': title + ' ' + location.href,
		        'default_image': image
		    });
		});
	})
	.fail(function(){
		console.log('failed to load sina javascript');
	});
}

/**
 * [initRenren: for renren]
 * @param  {[type]} object [the object which you want to bind to]
 * @param  {[type]} title  [set the title of the share]
 * @param  {[type]} image  [set the image of the share]
 * @return {[type]}        [description]
 */
share.initRenren = function (object, title, image) {
"use strict";
	$.getScript('http://widget.renren.com/js/rrshare.js')
	.done(function(){
		object.click(function() {
			var rrShareParam = {
				resourceUrl: location.href,	//分享的资源Url
				srcUrl: location.href,	//分享的资源来源Url,默认为header中的Referer,如果分享失败可以调整此值为resourceUrl试试
				pic: image,		//分享的主题图片Url
				title: title,		//分享的标题
				description: ''	//分享的详细描述
			};
			rrShareOnclick(rrShareParam);
		});
	})
	.fail(function(){
		console.log('failed to load renren javascript');
	});
};
/**
 * Created by aleen42 in sublime text 3
 * time: Nov 13rd, 2015
 * description: this is the src of initializing share components of different social platform like qq, qzone, weibo, etc.
 */

"use strict";

var share = {};

var options = {
    tencent: {
        url: 'url',
        title: 'title',
        desc: 'desc',
        summary: 'summary',
        site: 'site',
        image: 'pics'
    },
    tieba: {
        url: 'url',
        title: 'title',
        desc: 'desc',
        summary: 'summary',
        site: 'site',
        image: 'pic'
    },
    tencentweibo: {
        url: 'url',
        title: 'title',
        desc: 'desc',
        summary: 'summary',
        site: 'site',
        image: 'pic'
    }
};

/**
 * [initWindow: init a new window to open]
 * @param  {[type]} url    [which url you want to locate]
 * @param  {[type]} width  [the width of the new window]
 * @param  {[type]} height [the height of the new window]
 * @return {[type]}        [description]
 */
var initWindow = function(url, width, height) {
    "use strict";
    var iWidth = width; //弹出窗口的宽度;
    var iHeight = height; //弹出窗口的高度;
    //获得窗口的垂直位置
    var iTop = (window.screen.availHeight - iHeight) / 2;
    //获得窗口的水平位置
    var iLeft = (window.screen.availWidth - iWidth) / 2;
    window.open(url, "testwin", 'height=' + iHeight + ', innerHeight=' + iHeight + ',width=' + iWidth + ',innerWidth=' + iWidth + ',top=' + iTop + ',left=' + iLeft);
};

/**
 * [setOption: set the options of urls]
 * @param {[type]} option [set the option of different platforms]
 * @param {[type]} title [set the title of the share]
 * @param {[type]} image [set the image of the share]
 * @param {String} site  [set the site of the share]
 * @param {[type]} url   [set the url of the share]
 */
var setOption = function(option, title, image, site, url) {
    "use strict";
    site = site || 'Voice In';
    url = url || location.href;

    var p = {};
    p[option.url] = url;
    p[option.desc] = '';
    p[option.summary] = '';
    p[option.title] = title;
    p[option.site] = site;
    p[option.image] = image;

    var s = [];
    for (var i in p) {
        s.push(i + '=' + encodeURIComponent(p[i] || ''));
    }
    return s.join('&');
}

/**
 * [initTencent: for tencent like qzone, qq or qqweibo]
 * @param  {[type]} type   [type of tencent: 'qq', 'qzone', 'qqweibo']
 * @param  {[type]} object [the object which you want to bind to]
 * @param  {[type]} title  [set the title of the share]
 * @param  {[type]} image  [set the image of the share]
 * @return {[type]}        [description]
 */
share.initTencent = function(type, object, title, image) {
    "use strict";
    switch (type) {
        case 'qq':
            object.click(function() {
                initWindow('http://connect.qq.com/widget/shareqq/index.html?' + setOption(options.tencent, title, image), 730, 588);
            });
            break;
        case 'qzone':
            object.click(function() {
                initWindow('http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?' + setOption(options.tencent, title, image), 600, 588);
            });
            break;
    }
};

/**
 * [initWeibo: for sina weibo]
 * @param  {[type]} appkey [the app key from sina open api(http://open.weibo.com/)]
 * @param  {[type]} object [the object which you want to bind to]
 * @param  {[type]} title  [set the title of the share]
 * @param  {[type]} image  [set the image of the share]
 * @return {[type]}        [description]
 */
share.initWeibo = function(appkey, object, title, image) {
    "use strict";
    object.on("click", function () {
        (function(s, d, e) {
            var f = 'http://v.t.sina.com.cn/share/share.php?',
                u = d.location.href,
                p = ['url=', e(u), '&title=', e(d.title), '&appkey=' + appkey].join('');
            function a() {
                if (!window.open([f, p].join(''), 'mb', ['toolbar=0,status=0,resizable=1,width=620,height=450,left=', (s.width - 620) / 2, ',top=', (s.height - 450) / 2].join(''))) {
                    u.href = [f, p].join('')
                }
            };
            if (/Firefox/.test(navigator.userAgent)) {
                setTimeout(a, 0);
            } else {
                a();
            }
        })(screen, document, encodeURIComponent);
    });
}

/**
 * [initRenren: for renren]
 * @param  {[type]} object [the object which you want to bind to]
 * @param  {[type]} title  [set the title of the share]
 * @param  {[type]} image  [set the image of the share]
 * @return {[type]}        [description]
 */
share.initRenren = function(object, title, image) {
    "use strict";
    $.getScript('http://widget.renren.com/js/rrshare.js')
        .done(function() {
            object.click(function() {
                var rrShareParam = {
                    resourceUrl: location.href, //分享的资源Url
                    srcUrl: location.href, //分享的资源来源Url,默认为header中的Referer,如果分享失败可以调整此值为resourceUrl试试
                    pic: image, //分享的主题图片Url
                    title: title, //分享的标题
                    description: '' //分享的详细描述
                };
                rrShareOnclick(rrShareParam);
            });
        })
        .fail(function() {
            console.log('failed to load renren javascript');
        });
};

/**
 * [initTieba: for tieba]
 * @param  {[type]} object [the object which you want to bind to]
 * @param  {[type]} title  [set the title of the share]
 * @param  {[type]} image  [set the image of the share]
 * @return {[type]}        [description]
 */
share.initTieba = function(object, title, image) {
    "use strict";
    object.click(function() {
        initWindow('http://tieba.baidu.com/f/commit/share/openShareApi?' + setOption(options.tieba, title, image), 730, 588);
    });
}

/**
 * [initWeibo: for sina weibo]
 * @param  {[type]} appkey [the app key from sina open api(http://open.weibo.com/)]
 * @param  {[type]} object [the object which you want to bind to]
 * @param  {[type]} title  [set the title of the share]
 * @param  {[type]} image  [set the image of the share]
 * @return {[type]}        [description]
 */
share.initTencentWeibo = function(appkey, object, title, image) {
    "use strict";
    object.click(function() {
        initWindow('http://v.t.qq.com/share/share.php?' + 'appkey=' + appkey + '&' + setOption(options.tencentweibo, title, image), 730, 588);
    });
}