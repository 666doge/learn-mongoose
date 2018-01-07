let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let ObjectId = Schema.Types.ObjectId;

let Comment = new Schema({
    article : {
        type: ObjectId,
        ref: 'article',
        required: true
    },
    from : {
        type: ObjectId,
        ref: 'user',
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now()
    },
    content : String,
    reply: [{
        from : {
            type: ObjectId,
            ref: 'user',
            required: true
        },
        to : {
            type: ObjectId,
            ref: 'user',
            required: true
        },
        content: String,
        createdAt:{
            type: Date,
            default: Date.now()
        }
    }]
})
module.exports = mongoose.model('comment', Comment);