let router = require('koa-router')();

let task = require('./task')
let auth = require('./auth')
let article = require('./article')
let comment = require('./comment')
let path = require('path')
let xlsx = require('node-xlsx')


/*const multer = require('koa-multer');//加载koa-multer模块
//文件上传
//配置
let storage = multer.diskStorage({
    //文件保存路径
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    //修改文件名称
    filename: function (req, file, cb) {
        let fileFormat = (file.originalname).split(".");
        cb(null,Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
})
//加载配置
let upload = multer({ storage: storage });
//路由
router.post('/upload', upload.single('file'), async (ctx) => {
    ctx.body = {
        filename: ctx.req.file.filename//返回文件名
    }
})*/
router.post('/excel', async ctx => {

})

router.use('/todo', task.routes(), task.allowedMethods());
router.use('/auth', auth.routes(), auth.allowedMethods());
router.use('/article', article.routes(), article.allowedMethods());
router.use('/comment', comment.routes(), comment.allowedMethods());

module.exports = router;