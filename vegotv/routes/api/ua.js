var express = require('express')
var router = express.Router()
var app = express()
var parser  = require('ua-parser')

router.use('/', function (req, res, next) {
    var agent = parser.parse(req.get('User-Agent'))
		res.jsonp(agent)
		//res.locals.isMobile = agent.device.family != 'Other'
})


module.exports = router


	