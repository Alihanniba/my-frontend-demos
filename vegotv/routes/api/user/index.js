var express = require('express')
var router = express.Router()
var mongoose = require('mongoose');
var errors = require('web-errors').errors

var db = require(__dirname + '/../../../lib/db') 

router.get('*', function(req, res, next){
	res.jsonp(res.locals.user)
})

module.exports = router
