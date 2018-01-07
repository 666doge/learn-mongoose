let router = require('koa-router')();
let commentController = require('../controller/comment.js');

let routes = router
.get('/list/:articleId', commentController.getComments)
.post('/new',commentController.addComment)
.put('/:commentId',commentController.AddReply);

module.exports = routes;