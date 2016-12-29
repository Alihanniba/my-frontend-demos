var express = require('express')
var router = express.Router()



router.post('/', function(req, res) {
	console.log(req.body)
	res.status(204).end();
});

module.exports = router