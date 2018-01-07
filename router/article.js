var router = require('koa-router')();
var articleController = require('../controller/articleInfo.js');

var routes = router
    .post('/new', articleController.createArticle)
    .post('/list', articleController.retrieveArticleList)
    .get('/params', articleController.getArticleParams)
    .delete('/:_id', articleController.deleteArticle)
    .get('/:_id', articleController.getArticle)
    .put('/:_id/addLikes', articleController.addFuns)
    .put('/:_id/addHates', articleController.addHates)
    .put('/:_id', articleController.updateArticle);

module.exports = routes;