var express = require('express')
var router = express.Router()
var errors = require('web-errors').errors
var tools = require(__dirname + '/../../../lib/tool')
var consts = require(__dirname + '/../../../config/const')
var config = require(__dirname + '/../../../config/cps')
var rp = require('request-promise')
// var bodyParser = require('body-parser');
var app = express();
var debug = require('debug')('app')
// var multer = require('multer');
// var upload = multer();
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

router.get('/:id/:istitle/:type', function(req, res, next){
    var id = Number(req.params.id);
    var istitle = req.params.istitle;
    var type = req.params.type;
    var sourceData = '';
    var getClassifyByType = '';
    var getSourceByID = '';

    if (!id || !istitle || !type) {
        return res.jsonp(
            tools.jsonRes(
                consts.ERROR_PARAMETERS,
                '缺少参数'
            )
        );
    }
    if (type === 'tuxiaobei' || type === 'zhongguolan' || type === 'huace' || type === 'index' || type === 'youtube') {
        sourceData = tools.getJson(type)
    }

    getClassifyByType = (istitle === 'true' || istitle === true) ? 'titlesById' : 'episodesById';

    if (!sourceData) {
        return res.jsonp(
            tools.jsonRes(
                consts.ERROR_MESSAGE_INFO,
                '查询信息不存在'
            )
        );
    }
    var getSourceByID = sourceData['jsonGraph'][getClassifyByType][id];
    if (!getSourceByID) {
        return res.jsonp(
            tools.jsonRes(
                consts.ERROR_MESSAGE_INFO,
                '查询信息不存在'
            )
        );
    }

    var items = [];
    if (getClassifyByType === 'titlesById') {
        var episodeSource = getSourceByID.episodes;
        if (episodeSource.length > 0) {
            episodeSource = Array.from(episodeSource);
            for (var i = 0, j = episodeSource.length; i < j; i++) {
                var itemInfo = episodeSource[i].value;
                var item = {};
                item['id'] = itemInfo[1];
                if (itemInfo[1]) {
                    try {
                        item['name'] = sourceData['jsonGraph'][itemInfo[0]][itemInfo[1]].name;
                        item['landscape_poster'] = sourceData['jsonGraph'][itemInfo[0]][itemInfo[1]].landscape_poster;
                        item['description'] = sourceData['jsonGraph'][itemInfo[0]][itemInfo[1]].description;
                        item['source_url'] = sourceData['jsonGraph'][itemInfo[0]][itemInfo[1]].stream_url ? sourceData['jsonGraph'][itemInfo[0]][itemInfo[1]].stream_url : sourceData['jsonGraph'][itemInfo[0]][itemInfo[1]].source_url;
                    } catch (e) {
                        debug('==========获取istitle 里 单集 出错==============')
                    }
                }
                items.push(item);
            }
        }
    } else {
        var result = {};
        result['id'] = getSourceByID.id;
        result['name'] = getSourceByID.name;
        result['landscape_poster'] = getSourceByID.landscape_poster;
        result['description'] = getSourceByID.description;
        result['source_url'] = getSourceByID.stream_url ? getSourceByID.stream_url : getSourceByID.source_url;
        items.push(result);
    }
    return res.jsonp(
        tools.jsonRes(
            consts.SUCCESS_CODE,
            '查询成功',
            items
        )
    )
})

module.exports = router
