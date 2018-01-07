let TaskModel = require('../models/task.js')
let Result = require('../services/result.service')


module.exports = {
	async addTask(ctx){
        let token = ctx.state.user;
		const task = Object.assign({
            createdAt: Date.now(),
			user: token.userId
		}, ctx.request.body)

		let newTask = new TaskModel(task)
		let doc = await newTask.save();
		if( !doc.errors ){
            ctx.body = Result.success('保存成功');
		} else {
			ctx.body = Result.error('添加任务失败');
		}


	},
	async getTasks(ctx){
        let token = ctx.state.user;
        try{
            let docs = await TaskModel
                .find({user : token.userId})
                .populate('user', 'username');

            ctx.body = Result.success('获取任务成功', docs);
		} catch(e){
            ctx.body = Result.error('获取任务失败');
		}
	},
	async deleteTask(ctx){
		try{
            let docs = await TaskModel.remove({_id : ctx.params.taskId})
            ctx.body = Result.success('删除成功', docs);
		} catch (e){
			console.log(e);
            ctx.body = Result.error('删除失败');
		}

	},
	async deleteCompletedTask(ctx){
		try{
            let docs = await TaskModel.remove({user: ctx.state.user.userId, finishedAt:{$gt: 0}});
            ctx.body = Result.success('删除成功', docs);
		}catch (e){
            ctx.body = Result.error('删除失败');
		}
	},
	async updateTask(ctx){
		let taskId = ctx.params.taskId;
		let finishedAt = ctx.request.body.finishedAt;
		let doc = await TaskModel.findById(taskId);
		doc.finishedAt = finishedAt;
		let result = await doc.save()
        if(result.errors){
            ctx.body = Result.error('更新失败');
        } else {
            ctx.body = Result.success('更新成功', result);
        }
	}
}