var express = require('express');
var router = express.Router();


router.get('/', function(req, res) {
  res.render('categories/index');
});


module.exports = router
