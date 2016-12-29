var express = require('express')
var router = express.Router()
var errors = require('web-errors').errors
var tools = require(__dirname + '/../../../lib/tool')
var consts = require(__dirname + '/../../../config/const')
var rp = require('request-promise')
var bodyParser = require('body-parser');
var app = express()
var sourceData = tools.getJson('index');

router.get('/:page/:id?',  function(req, res, next){
    var id = req.params.id ? Number(req.params.id) : 0
    var currentPage = (req.params.page &&  Number(req.params.page) > 0) ? Number(req.params.page) : 1
    var num = 20;
    var navList = [],
        navListData,
        items = [],
        result = [];

    if (!sourceData) {
        return res.jsonp(
            tools.jsonRes(
                consts.ERROR_MESSAGE_INFO,
                '查询信息不存在'
            )
        );
    }

    var category = sourceData['jsonGraph']['genreList'][id];
    if (!category) {
        return res.jsonp(
            tools.jsonRes(
                consts.ERROR_MESSAGE_INFO,
                '查询信息不存在'
            )
        );
    }

    if (!req.params.id) {
        try {
            navListData = sourceData['jsonGraph']['genreList'];
            if (navListData.length > 0) {
                for (var i = 0, j = navListData.length; i < j; i++) {
                    navList.push({
                        id: i,
                        name: navListData[i].name
                    })
                }
            }
        } catch (error) {
            // debug('===========youtubeNavList发生错误===================')
        }
    }


    var genreListItems = category['genreListItems'];
    if (genreListItems.length > 0) {
        genreListItems = Array.from(genreListItems);
        var newGenreListItems = genreListItems.slice((currentPage-1)*num, currentPage*num);
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
                        item['name'] = sourceData['jsonGraph'][itemInfo[0]][itemInfo[1]].name ? sourceData['jsonGraph'][itemInfo[0]][itemInfo[1]].name : '';
                        item['landscape_poster'] = sourceData['jsonGraph'][itemInfo[0]][itemInfo[1]].landscape_poster ? sourceData['jsonGraph'][itemInfo[0]][itemInfo[1]].landscape_poster : '';
                        item['description'] = sourceData['jsonGraph'][itemInfo[0]][itemInfo[1]].description ? sourceData['jsonGraph'][itemInfo[0]][itemInfo[1]].description : '';
                    } catch (error) {
                        
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
})

module.exports = router
