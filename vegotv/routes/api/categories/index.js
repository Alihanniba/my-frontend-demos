var express = require('express')
var router = express.Router()
var errors = require('web-errors').errors
var tools = require(__dirname + '/../../../lib/tool')
var consts = require(__dirname + '/../../../config/const')
var rp = require('request-promise')
var sourceData = tools.getJson('index');


router.get('/', function(req, res, next){
    if (!sourceData) {
        res.jsonp(
            tools.jsonRes(
                consts.ERROR_MESSAGE_INFO,
                '查询信息不存在'
            )
        );
    }
    var result = [];
    var genreList = sourceData['jsonGraph']['genreList'];
    if (!genreList) {
        return res.jsonp(
            tools.jsonRes(
                consts.ERROR_MESSAGE_INFO,
                '查询信息不存在'
            )
        )
    }
    for (var i = 0, j = genreList.length; i < j; i++) {
        result.push({
            id: i,
            name: genreList[i].name
        })
    }
    return res.jsonp(
        tools.jsonRes(
                consts.SUCCESS_CODE,
                '查询成功',
                result
            )
        )
})

module.exports = router
