var express = require('express');
var router = express.Router();


router.get('*', function(req, res) {
  res.render('cps/cp');
});


module.exports = router
