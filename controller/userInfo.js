const userModel = require('../models/user')
const CONFIG = require('../config/const.config.js')
const Result = require('../services/result.service.js')
const jwt = require('jsonwebtoken');

module.exports = {
	async signIn (ctx) {
		const {username, password} = ctx.request.body;
		await userModel.findOne(
				{username : username},
				(error, user) => {
					if(error){
						console.log(error);
						return;
					}
					if( !user ){
						ctx.body = Result.error('用户不存在');
					} else {
						if(user.password === password){
							const userName = user.username;
							const userId = user._id;
                            const token = jwt.sign({
                                userName,
								userId,
                                exp: Math.floor(Date.now() / 1000) + 2 * 60 * 60,  //过期时间，2小时
                            }, CONFIG.TOKEN_SECRET)

							let data = {
                                token: token,
                                user: user
                            }
                            ctx.body = Result.success('登陆成功', data);
						} else{
                            ctx.body = Result.error('密码不正确');
						}
					}
				}
			)
	},
	async signUp (ctx) {
		const {username, password, email} = ctx.request.body;
		if( !username || !password){
            ctx.body = Result.error('缺少用户名或密码');
		} else{
			let user = await userModel.findOne({username: username});
			if(!user){
				let newUser = new userModel({
					username: username,
					password: password,
					email: email
				})
				let doc = await newUser.save()
				if(!doc.errors){
                    ctx.body = Result.success('注册成功');
				} else{
					ctx.body = Result.error('注册失败');
				}

			} else{
				ctx.body = Result.error('用户名已存在');
			}
		}
	}
}