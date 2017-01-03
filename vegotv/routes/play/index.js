var express = require('express');
var router = express.Router();


router.get('*', function(req, res) {
  res.render('play/index');
});

module.exports = router
