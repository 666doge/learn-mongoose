let articleModel = require('../models/article.js');
let userModel = require('../models/user.js');
let Result = require('../services/result.service')

module.exports = {
    async createArticle(ctx) {
        const {author, title, content, category, createdAt, funs} = ctx.request.body;
        if (!author) {
            ctx.body = Result.error('没有作者');
        } else {
            let article = new articleModel({
                author,
                title,
                content,
                category,
                createdAt,
                funs
            })
            let doc = article.save();
            if (!doc.errors) {
                ctx.body = Result.success('文章发布成功');
            } else {
                ctx.body = Result.error('文章发布失败');
            }
        }
    },
    async retrieveArticleList(ctx) {
        let p = Object.assign({
            pageNo: 0,
            pageSize: 10,
            sortKey: 'createdAt',
            sort: 1,
            query: {}
        }, ctx.request.body);
        !p.query.author && delete p.query.author
        !p.query.category && delete p.query.category

        let totalCount = await articleModel.find(p.query).count();
        let docs = await articleModel.find(p.query).skip(p.pageSize * p.pageNo).limit(p.pageSize).sort({createdAt: p.sort});
        if (docs.errors) {
            ctx.body = Result.error('文章列表查询失败');
        } else {
            let data = {
                content: docs,
                totalCount: totalCount,
                pageNo: p.pageNo,
                pageCount: Math.ceil(totalCount / (p.pageSize))
            }
            ctx.body = Result.success('文章列表查询成功', data);
        }
    },
    getArticle (ctx){
        let articleId = ctx.params._id
        articleModel
            .findOne({_id: articleId})
            .populate('funs')
            .exec(function (err, doc) {
                if (err) {
                    ctx.body = Result.error('文章查询失败');
                } else {
                    ctx.body = Result.success('文章列表查询成功', doc);
                }
            });

    },
    async updateArticle(ctx) {
        var _id = ctx.params._id;
        var params = ctx.request.body;
        var doc = await articleModel.findByIdAndUpdate(_id, {$set: params}, {new: true})
        if (doc.errors) {
            console.log(errors);
            ctx.body = Result.error('文章修改失败');
        } else {
            ctx.body = Result.success('文章修改成功');
        }
    },
    async deleteArticle(ctx) {
        let articleId = ctx.params._id;
        await articleModel.findOne({_id: articleId}, async (error, article) => {
            if (error) {
                console.log(error);
                return;
            }
            if (!article) {
                ctx.body = Result.error('未找到该文章，请查看article id');
            } else {
                await articleModel.remove({_id: articleId}, (error, article) => {
                    if (error) {
                        console.log(error);
                        return;
                    }
                    ctx.body = Result.success('删除成功');
                })
            }
        })
    },
    getArticleParams(ctx) {
        var categories = articleModel.aggregate([
            {$project: {type: '$category'}},
            {$unwind: '$type'},
            {$group: {'_id': '$type', count: {$sum: 1}}},
            {$project: {label: '$_id', value: '$_id', _id: 0}}
        ])
        var authors = articleModel.aggregate([
            {$project: {author: '$author'}},
            {$group: {_id: '$author'}},
            {$project: {name: '$_id'}}
        ])

        return Promise.all([categories, authors]).then(result => {
            let data = {
                categories: result[0],
                authors: result[1]
            }
            ctx.body = Result.success('分类和作者获取成功', data);
        }).catch(error => {
            console.log(error)
            ctx.body = Result.error('分类和作者获取失败');
        })
    },
    async addFuns(ctx) {
        let articleId = ctx.params._id;
        let user = ctx.request.body.user;
        await articleModel.findOne({_id: articleId}, async (error, article) => {
            if (error) {
                console.log(error);
                return;
            }
            if (!article) {
                ctx.body = Result.error('未找到该文章，请查看article id');
            } else {
                let funs = article.funs
                let idx = funs.indexOf(user)
                try {
                    if (idx !== -1) {
                        funs.splice(idx, 1)
                        article.save();
                        ctx.body = Result.success('取消赞')
                    } else {
                        funs.push(user)
                        article.save();
                        ctx.body = Result.success('赞了一下')
                    }
                } catch (e) {
                    ctx.body = Result.error()
                }
            }
        })
    },
    async addHates(ctx) {
        let articleId = ctx.params._id;
        let user = ctx.request.body.user;
        await articleModel.findOne({_id: articleId}, async (error, article) => {
            if (error) {
                console.log(error);
                return;
            }
            if (!article) {
                ctx.body = Result.error('未找到该文章，请查看article id');
            } else {
                let hates = article.hates
                let idx = hates.indexOf(user)
                try {
                    if (idx !== -1) {
                        hates.splice(idx, 1)
                        article.save();
                        ctx.body = Result.success('取消踩')
                    } else {
                        hates.push(user)
                        article.save();
                        ctx.body = Result.success('踩了一下')
                    }
                } catch (e) {
                    ctx.body = Result.success()
                }
            }
        })
    }
}