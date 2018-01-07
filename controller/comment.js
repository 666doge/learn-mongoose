let commentModel = require('../models/comment.js');
let Result = require('../services/result.service');

module.exports = {
    async addComment(ctx){
        let params = ctx.request.body;

        try {
            let comment = new commentModel(params);
            let doc = await comment.save();
            if(!doc || doc.errors){
                ctx.body = Result.error('评论添加失败');
            } else {
                ctx.body = Result.success('评论添加成功');
            }
        } catch (e){
            console.log(e)
            ctx.body = Result.error('评论添加失败');
        }
    },
    async getComments(ctx){
        let articleId = ctx.params.articleId;
        var docs = await commentModel
            .find({article: articleId})
        if(!docs || docs.errors){
            ctx.body = Result.error('查找评论失败');
        } else {
            ctx.body = Result.success('查找评论成功', docs);
        }
    },
    async AddReply(ctx){
        let commentId = ctx.params.commentId;
        let reply = ctx.request.body
        let doc = await commentModel.findById(commentId);
        if(!doc || doc.errors){
            ctx.body = Result.error('未找到该评论');
        } else {
            doc.reply.push(reply)
            let result = await doc.save();
            if( result && ! result.errors){
                ctx.body = Result.success('添加回复成功');
            }
        }
    }
}