var express = require('express')
var router = express.Router()
var middlewares = require(__dirname + '/../lib/middlewares') 
var config = require(__dirname + '/../config/wechat')
var debug = require('debug')('app:index')

var client = null

/* GET home page. */
router
  .all('*', middlewares.wechatOAUTH, function(req, res, next){
    if(process.env.OPENID){
      res.locals.user = require(__dirname + '/../config/mockdata')
      return next()
    }
    // 非微信用户可访问
    if(!res.locals.isWechat){
      return next()
    }
    if(!client){
      client = req.app.get('redis')
    }
    var db = require(__dirname + '/../lib/db')
    var appid = req.session.appid
    var openid = req.session.openid
    var oauth = req.session.oauth
    client.get('global:boss:'+oauth+':' + openid, function(err, val){
      if(err){return next(err)}
      // 非微信注册用户不可可访问
      if(!val){
        //return  next(new Error('Not a ' + oauth + ' user'))
        return next()
      }
      Promise
        .all([db.getUser(req, oauth), db.subscription(req, config.planID, openid)])
        .then(function(result){
          var user = result[0]
          delete user.refreshToken
          delete user.accessToken
          user.subscription = result[1] && result[1].subscription
          res.locals.user = user
          debug('res.locals.user %j', req.user)
          next()
        })
        .catch(function(err){
          next(err)
        })    
    })
  })
  .get('/', function(req, res) {
    res.render('index');
  });


module.exports = router