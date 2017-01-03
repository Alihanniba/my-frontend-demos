var express = require('express')
var router = express.Router()
var errors = require('web-errors').errors
var tools = require(__dirname + '/../../../lib/tool')
var consts = require(__dirname + '/../../../config/const')
var config = require(__dirname + '/../../../config/cps')
var rp = require('request-promise')
// var bodyParser = require('body-parser');
var app = express()
// var multer = require('multer');
// var upload = multer();
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({
    // extended: true
// }));

router.get('/:type/:page/:id?', function(req, res, next) {
    var type = req.params.type;
    var id = req.params.id ? Number(req.params.id) : 0;
    var currentPage = (req.params.page && Number(req.params.page) > 0) ? Number(req.params.page) : 1
    var num = 20;
    var sourceData = '';

    if (!type || (type !== 'tuxiaobei' && type !== 'zhongguolan' && type !== 'huace' && type !== 'youtube')) {
        var failsMsg = '',
            failsCode = 0;
        if (!type) {
            failsMsg = '缺少参数'
            failsCode = consts.ERROR_PARAMETERS_FAILS
        } else {
            failsMsg = '参数错误'
            failsCode = consts.ERROR_PARAMETERS_FAILS
        }
        return res.jsonp(
            tools.jsonRes(
                failsCode,
                failsMsg
            )
        );
    }

    sourceData = tools.getJson(type);

    if (!sourceData) {
        return res.jsonp(
            tools.jsonRes(
                consts.ERROR_MESSAGE_INFO,
                '查询信息不存在'
            )
        );
    }
    var result = [];
    var navList = [];
    var genreList = sourceData['jsonGraph']['genreList'];
    if (!req.params.id) {
        for (var i = 0, j = genreList.length; i < j; i++) {
            navList.push({
                id: i,
                name: genreList[i].name
            })
        }
    }

    var category = genreList[id];
    if (!category) {
        return res.jsonp(
            tools.jsonRes(
                consts.ERROR_MESSAGE_INFO,
                '查询信息不存在'
            )
        );
    }
    var genreListItems = category['genreListItems'];
    var items = [];
    if (genreListItems.length > 0) {
        genreListItems = Array.from(genreListItems);
        var newGenreListItems = genreListItems.slice((currentPage - 1) * num, currentPage * num);
        if (newGenreListItems.length > 0) {
            for (var i = 0, j = newGenreListItems.length; i < j; i++) {
                var itemInfo = newGenreListItems[i].value;
                var item = {};
                item['id'] = itemInfo[1];
                item['type'] = category.name;
                item['currentPage'] = currentPage;
                item['totalPage'] = Math.ceil(genreListItems.length/num);
                item['totalNum'] = genreListItems.length;
                item['istitle'] = itemInfo[0] === "titlesById" ? true : false;
                if (itemInfo[1]) {
                    try {
                        item['name'] = sourceData['jsonGraph'][itemInfo[0]][itemInfo[1]].name;
                        item['landscape_poster'] = sourceData['jsonGraph'][itemInfo[0]][itemInfo[1]].landscape_poster;
                        item['description'] = sourceData['jsonGraph'][itemInfo[0]][itemInfo[1]].description;
                    } catch (e) {
                        //debug('========获取分类剧集信息失败============')
                    }
                }
                items.push(item);
            }
            if (!req.params.type) {
                result = [items, navList];
            } else {
                result = [items];
            }
            return res.jsonp(
                tools.jsonRes(
                    consts.SUCCESS_CODE,
                    '查询成功',
                    result
                )
            )
        } else {
            return res.jsonp(
                tools.jsonRes(
                    consts.ERROR_MESSAGE_INFO,
                    '查询信息不存在'
                )
            )
        }
    } else {
        return res.jsonp(
            tools.jsonRes(
                consts.ERROR_MESSAGE_INFO,
                '查询信息不存在'
            )
        )
    }
})

module.exports = router
