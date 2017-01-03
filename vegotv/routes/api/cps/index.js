var express = require('express')
var request = require('request')
var errors = require('web-errors').errors

var router = express.Router()
var config = require(__dirname + '/../../../config/cps')

router.get('/:id', function(req, resp, next) {
	var id = req.param('id')
	if(!config[id]){
		return next()
	}

	if(id === 'home'){
		return resp.jsonp(require(config[id]))
	}
	request.get(config[id]).pipe(resp)

});


module.exports = router
