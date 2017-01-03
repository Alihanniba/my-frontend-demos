var weixin = require('node-weixin-api');
var express = require('express');

var app = express();
var port = 8000;

app.use(express.static(__dirname + '/public'))

var token = 'ihfcV2AWZi6kgJ';

app.use('/service/wechat', function(req, res, next){
	var data = weixin.auth.extract(req.query);
	weixin.auth.ack(token, data, function(err, data){
		if(err){
				return res.send('not matched.')
		}
		res.send(data)
	});
});

routers.errors(app, {});

if (!module.parent) {
  app.listen(port);
  console.log('Express started on port ' + port);
}else{
  module.exports = app;
}
