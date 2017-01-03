var express 				= require('express')
var path 						= require('path')
var fs              = require('fs')
var favicon 				= require('serve-favicon')
var logger 					= require('morgan')
var cookieParser 		= require('cookie-parser')
var bodyParser 			= require('body-parser')
var redis						= require('redis')
var csurf 					= require('csurf')
var session 				= require('express-session')
var responseTime 		= require('response-time')
var debug 					= require('debug')('app')
var mongoose 				= require('mongoose')
var settings 				= require('node-weixin-settings')
var exec 						= require('child_process').exec

var RedisStore 			= require('connect-redis')(session);
var csrfProtection 	= csurf({ cookie: true })

var app 						= express()
var WECHAT_BASE 		= '/service/wechat'
var webpackConfig 	= require(__dirname + '/webpack.config')
var siteConfig 			= require(__dirname + '/config/site')
var util 						= require(__dirname + '/lib/util')
var routes 					= require('./routes/index')
var selfSetting 		= require(__dirname + '/lib/settings')
var WEBHOOK         = __dirname + '/webhook.js';

exec('git rev-parse --short HEAD', function (error, stdout, stderr){
	if(error){
		return
	}
	app.locals.sha = stdout
})


app.locals.site = siteConfig

function setup_redis(){
	// redis
	var redis_config = {
		"host": process.env.REDIS_HOST || "localhost",
		"port": process.env.REDIS_PORT || 6379,
		"db": process.env.REDIS_DB || 1
	}
	if(process.env.REDIS_AUTH){
		redis_config['auth_pass'] = process.env.REDIS_AUTH
	}

	var client = redis.createClient(redis_config);
	client.on('ready',function(){
		debug('redis reday')
		app.set('subscribe',redis.createClient(redis_config))
		app.set('publish',redis.createClient(redis_config))
		app.emit('db', 'redis', client)
		if(process.env.CLEAR){
			//client.flushdb()
		}
	})
	client.on('error',console.error.bind(console, 'redis error:'))
	return client
}

var client = setup_redis()

// init client
selfSetting.init(client)

settings.set = selfSetting.set
settings.get = selfSetting.get
settings.all = selfSetting.all

/**
 * [watchFile description]监听本地数据更新
 * @param  {[type]} "./data/home.json" [description]
 * @param  {[type]} function(current,  previous      [description]
 * @return {[type]}                    [description]
 */

(function(){
	var cps = require(__dirname + '/config/cps')
	var keys = Object.keys(cps)
	keys.map(function(file){
		var p = __dirname + '/data/' + file + '.json';
		fs.watchFile(p, function(current, previous) {
			var name = require.resolve(p);
			delete require.cache[name];
		});
	})
}())

// mongo
var mongodb =  siteConfig.mongo
mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost/wechat', mongodb.options)
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongodb error:'))
db.once('open', function() {
	app.emit('db', 'mongo', mongoose)
})

util.files(__dirname + '/schemas', /\.js|\.coffee/, function(file){
	var module = require(file)
	if(process.env.CLEAR){
		module.remove({})
	}
})

// all db event
var events = ['redis', 'mongo'];
app.on('db', function(name, client){
	var ind = events.indexOf(name)
	if(ind > -1){
		events.splice(ind, 1)
		debug('Set db ' + name)
		app.set(name, client)
	}
	if(events.length === 0){
		app.removeAllListeners('db')
		app.emit('ready')
	}
})

app.set('port', process.env.PORT || 4000)
app.set('redis', client)
app.set('wechatBaseUrl', WECHAT_BASE)
// trust proxy
app.enable('trust proxy')

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')
app.use(favicon(__dirname + '/assets/icon/favicon.ico'))
app.use(logger('dev'))

// for webpack server
if (app.get('env') === 'development' && process.env.WEBPACK) {
	app.use(require(__dirname + '/devEnv')(webpackConfig, app))
}
// 静态文件目录
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'assets')))

// middleware
// response time
app.use(responseTime(function (req, res, time) {
	res.setHeader('X-Powered-By', 'VWS')
	res.setHeader('X-Response-Time', time.toFixed(3) + 'ms')
}))

// ten years
var COOKIES_MAXAGE = 1000 * 60 * 60 * 24 * 365 * 10

// session
app.use(session({
  secret: siteConfig.key || 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: {
	  path: '/',
	  domain: app.get('env') === 'production' ? '.vego.tv' : '.vego.dev',
	  httpOnly: false,
	  maxAge: COOKIES_MAXAGE
  },
	store: new RedisStore({client:app.get('redis')})
}))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser(siteConfig.key))

if(fs.existsSync(WEBHOOK)){
  var hook = require(WEBHOOK)
	var request = require('request')
  console.log('Start hook with %s', WEBHOOK)
  app.post('/webhook', function(req, res, next){
    request.post('http://localhost:' + hook.port, {form: req.body}).pipe(res);
  });
}


// 初始化设置
app.use(function(req, res, next){
	if (!req.session) {
		return next(new Error('Database not valid'))
	}
	var referrer = req.get('Referrer') || ''
	var d = referrer.match(/http(?:s*):\/\/[^/]+/)
	if(d){
		res.header('Access-Control-Allow-Origin', d[0]);
		res.header('Access-Control-Allow-Credentials', true)
		res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , token');
		res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
	}
	var domain = req.hostname
	if(/\.dev$/.test(domain)){
		if(/\./.test(domain)){
			var _tmp = domain.split('.')
			if(_tmp.length > 2){
				_tmp = _tmp.slice(_tmp.length - 2, _tmp.length)
			}
			domain = _tmp.join('.')
		}
		// set openid and wechat
		// exprire at 7 days
		res.cookie('openid', process.env.OPENID, {domain: domain, path: '/', maxAge: 1000 * 60 * 60 * 24 * 7, signed: true});
		res.cookie('oauth', 'wechat', { domain: domain, path: '/', maxAge: 1000 * 60 * 60 * 24 * 7, signed: true});
		res.cookie('appid', 'sadfsfsafasfsa', {domain: domain, path: '/', maxAge: 1000 * 60 * 60 * 24 * 7, signed: true});
	}
	

	// set appid and openid
	var appid = req.signedCookies.appid || req.cookies.appid
	appid && !req.session.appid  && (req.session.appid = appid)
	var openid = req.signedCookies.openid || req.cookies.openid || process.env.OPENID
	openid && !req.session.openid  && (req.session.openid = openid)
	var oauth = req.signedCookies.oauth || req.cookies.oauth || process.env.OAUTH || 'wechat'
	oauth && !req.session.oauth  && (req.session.oauth = oauth)
	res.locals._csrf = req.csrfToken && req.csrfToken()
	var agent = req.get('User-Agent')
	res.locals.isWechat =  /micromessenger/i.test(agent)
	var _routes = {
		HOME : '/api/cps/home',
		INDEX : '/api/cps/index',
		TXB : '/api/cps/tuxiaobei',
		HUACE : '/api/cps/huace',
		CHINABLUE : '/api/cps/zhonguolan',
		YOUTUBE: '/api/cps/youtube'
	}
	var host = req.get('Host')
	if(host){
		host = host.split(':')
	}
	var keys = Object.keys(_routes)
	for(var i = 0; i < keys.length; i++){
		var key = keys[i]
		_routes[key] =  req.protocol + '://' + req.hostname + (host && host[1] && (host[1] != '80' || !req.secure) ? ':' + host[1] :  '') +  _routes[key]
	}
	res.locals._routes = _routes
	var parser  = require('ua-parser')
	var agent = parser.parse(req.get('User-Agent'))
	res.locals.isMobile = agent.device.family != 'Other'
	next()
})

/**
 * [use description]在此验证api token
 * @param  {[type]} '/api/'  [description]
 * @param  {[type]} function (req,         res, next [description]
 * @return {[type]}          [description]
 */
app.use('/api/', function (req, res, next) {
	var _url = req.originalUrl;
	debug("======当前请求经过API======");
	debug(req.get('token'));
	if (req.get('token') !== '3RZ6hfzUGHUAha') {
		// return next(new Error('token not valid'))
	}
	next()
})

var DIR = __dirname + '/routes'
var REG = /\.coffee|\.js$/
// 修复覆盖 Object.keys 导致 request 模块出错的 Bug https://github.com/calidion/node-form-validator/blob/master/lib/index.js
var objectKeys = Object.keys
// 动态路由
util.files(DIR, REG, function(file){
	var module = require(file)
	var path = file.replace(DIR, '').replace(REG, '').replace(/index$/,'')
	if(!module.stack && !module.all && !module.head && !module.get){
		return
	}
	if(/\.init\.\w+$/.test(file)){
		app.use(module)
	}else{
		app.use(path, module)
	}
})
Object.keys = objectKeys


app.get('/404', function(req, res, next){
	// trigger a 404 since no other middleware
	// will match /404 after this one, and we're not
	// responding here
	next()
})

app.get('/403', function(req, res, next){
	// trigger a 403 error
	var err = new Error('not allowed!')
	err.status(403)
	next(err)
})

app.get('/500', function(req, res, next){
    // trigger a generic (500) error
    next(new Error('keyboard cat!'))
})

// Error handlers
app.use(function(req, res, next){
	res.status(404)

	// respond with html page
	if (req.accepts('html')) {
			res.render('404', { url: req.url })
			return
	}

	// respond with json
	if (req.accepts('json')) {
			res.send({ error: 'Not found' })
			return
	}

	// default to plain-text. send()
	res.type('txt').send('Not found')
})

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500)
		res.render('error', {
			message: '服务器开小差了。',
			error: err
		})
	})
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500)
	res.render('error', {
		message: err.message,
		error: {}
	})
})

const unhandledRejections = new Map();
process.on('unhandledRejection', (reason, p) => {
  unhandledRejections.set(p, reason);
});
process.on('rejectionHandled', (p) => {
  unhandledRejections.delete(p);
});

app.get('/stat', function(req, res, next){
	var items = {
		unhandledRejections: unhandledRejections
	}
	res.json(items)
})


process.once('beforeExit', function(){
	client.quit()
})

process.on('uncaughtException', function(err){
	console.error(err.stack)
	process.exit(1)
})



if (!module.parent) {
	app.on('ready', function(){
		  var server = app.listen(app.get('port'), function() {
  		console.log('Express server listening on port ' + server.address().port)
			/*
			var config = require(__dirname + '/config/wechat')
			var request = require('request')
			request.post({
				url: 'http://127.0.0.1:' + app.get('port') + app.get('wechatBaseUrl') + '/config',
				headers: {
					'Content-Type': 'aplication/json'
				},
				body:JSON.stringify(config)
			},function(error, response, body){
				console.log(body)
				if (!error && response.statusCode == 200) {
						console.log(body)
				}
			})
			*/
		})
	})
}else{
  module.exports = app
}
