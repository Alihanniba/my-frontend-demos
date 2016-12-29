var express = require('express')
var router = express.Router()
var app = express()
var errors = require('web-errors').errors

router.use('/', function (req, res, next) {
    // if (req.method.toLowerCase() === 'get') {
    //     res.send(req.method);
    // } else {
    //     res.send("request method error");
    // }
    next()
})


module.exports = router
