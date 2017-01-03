var express = require('express');
var router = express.Router();

router.get('*', function(req, res) {
  return res.redirect('/service/wechat/order?url=' +( req.param('url') || req.get('Referer') || '/' ))
});


module.exports = router