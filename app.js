const Koa = require('koa');
const cors = require('@koa/cors')
const app = new Koa();
const router = require('./router/index.js');
const json = require('koa-json');
const logger = require('koa-logger');
const mongoose = require('mongoose');
const koaJwt = require('koa-jwt');
const CONFIG = require('./config/const.config.js')


app.use( require('koa-bodyparser')() );
app.use(json());
app.use(cors());
app.use(logger());

// 验证token
app.use(function(ctx, next){
    return next().catch((err) => {
        if (401 === err.status) {
            ctx.status = 401;
            ctx.body = {
                success:false,
                msg: 'invalid token'
            }
        } else {
            throw err;
        }
    });
});

app.use(koaJwt({ secret: CONFIG.TOKEN_SECRET}).unless({ path: [/\/sign|\/uploads/] }));

//打印日志
app.use( async (ctx, next) => {
	let start = new Date();
	await next();
	let ms = new Date() - start;
	console.log('%s %s - %s', ctx.method, ctx.url, ms)
})

app.use( router.routes() )
app.on('error', function(error, ctx) {
	console.log('server error', error)
})
app.listen(8889, () => {
	console.log('Koa is listening in 8889');
})
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/todolist');
module.exports = app;