var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var Task = new Schema({
	user : {
		require: true,
		type: ObjectId,
		ref: 'user'
	},
	title: String,
	createdAt: {
		type:Date,
		default: Date.now()
    },
	finishedAt: Date,
	content: String
})
module.exports = mongoose.model('task', Task);