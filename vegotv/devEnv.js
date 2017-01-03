var webpack = require('webpack');
var localtunnel = require('localtunnel');
var WebpackDevServer = require('webpack-dev-server');
var debug = require('debug')('devEnv')

// for webpack server
module.exports = function (config, app){
	
		var items = config.entry;
		var path = config.output.path.replace('public','')

		if(!/\/$/.test(path)){
			path += '/'
		}
        
		var port = app.get('devPort') || 9010;
       
		new WebpackDevServer(webpack(config), {
			publicPath: config.output.publicPath,
			hot: true,
			noInfo: true,
			historyApiFallback: true,
			watchOptions: {
				aggregateTimeout: 300,
				poll: 1000
			}
		}).listen(port, config.ip, (err, result) => {
			if (err) {
				return debug(err);
			}
			debug('WebpackDevServer listen on %d', port)
		});

		return function(req, res, next){
			for(var key in items){
				if(req.path === path + key + '.js'){
					var url = '//'+ req.hostname + ':' + port + req.path
					debug('Redirect to url %d', url)
					return res.redirect(url);
				}
			}
			next();
		}
};