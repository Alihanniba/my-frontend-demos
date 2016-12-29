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
    var type = req.params.type === 'index' ? 'index' : 'youtube';     //从哪个json文件取数据
    var id = req.params.id ? Number(req.params.id) : 0;
    var currentPage = (req.params.page && Number(req.params.page) > 0) ? Number(req.params.page) : 1
    var num = 20;
    var sourceData = '',
        youtubeNavList = '',
        genreList = '',
        category = '',
        genreListItems = '',
        items = [],
        result = [];
        

    /**
     * 先拿导航条数据
     */
    if (!req.params.id) {
        var navList = [
            {
                id: 100,
                name: '精品高清'
            }
        ];
        var youtubeNavData = tools.getJson('youtube');
        if (!youtubeNavData) {
            res.jsonp(
                tools.jsonRes(
                    consts.ERROR_MESSAGE_INFO,
                    '查询信息不存在'
                )
            );
        }
        try {
            youtubeNavList = youtubeNavData['jsonGraph']['genreList'];
            if (!youtubeNavList) {
                res.jsonp(
                    tools.jsonRes(
                        consts.ERROR_MESSAGE_INFO,
                        '查询信息不存在'
                    )
                )
            }
            if (youtubeNavList.length > 0) {
                for (var i = 0, j = youtubeNavList.length; i < j; i++) {
                    navList.push({
                        id: i,
                        name: youtubeNavList[i].name
                    })
                }
            }
        } catch (error) {
            // debug('===========youtubeNavList发生错误===================')
        }
        
    }
    
    try {
        sourceData = tools.getJson(type);
        genreList = sourceData['jsonGraph']['genreList'];
        if (!sourceData) {
            return res.jsonp(
                tools.jsonRes(
                    consts.ERROR_MESSAGE_INFO,
                    '查询信息不存在'
                )
            );
        }
        category = genreList[id];
        
        if (!category) {
            return res.jsonp(
                tools.jsonRes(
                    consts.ERROR_MESSAGE_INFO,
                    '查询信息不存在'
                )
            );
        }
        try {
            genreListItems = category['genreListItems'];
            
        } catch (error) {
            // debug('===========genreListItems发生错误===================')
        }
        if (genreListItems.length > 0) {
            genreListItems = Array.from(genreListItems);
            var newGenreListItems = genreListItems.slice((currentPage - 1) * num, currentPage * num);
            
            if (newGenreListItems.length > 0) {
                for (var i = 0, j = newGenreListItems.length; i < j; i++) {
                    var itemInfo = newGenreListItems[i].value;
                    
                    var item = {};
                    item['id'] = itemInfo[1];
                    item['type'] = category.name;
                    item['classifyId'] = id;
                    item['classifyNum'] = genreList.length;
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
                            // debug('========获取分类剧集信息失败============')
                        }
                    }
                    items.push(item);
                }
                
                if (!req.params.id) {
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
    } catch (error) {
       // debug('===========genreList发生错误===================')
    }
})

module.exports = router
