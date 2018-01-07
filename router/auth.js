var router = require('koa-router')();
var userInfoController = require('../controller/userInfo.js')

var routes = router
.get('/', function(ctx){
	ctx.body = 'this is home page'
})
.post('/signUp', userInfoController.signUp)
.post('/signIn', userInfoController.signIn)

module.exports = routes;