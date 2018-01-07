var mongoose = require('mongoose');
var Schema = mongoose.Schema;
let ObjectId = Schema.Types.ObjectId
var articleSchema = new Schema({
    title: String,
    content: String,
    category: {
        type:[String]
    },
    author:String,
    createdAt:{
        type: Date,
        default: Date.now()
    },
    updatedAt:Date,
    funs:[{
        type:ObjectId,
        ref: 'user'
    }],
    hates:[{
        type:ObjectId,
        ref: 'user'
    }]
})
module.exports = mongoose.model('article', articleSchema);