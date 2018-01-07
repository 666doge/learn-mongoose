var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserSchema = new Schema({
	username: {
        type: String,
        unique: true,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    email: {
        type: String,
    }
})

module.exports = mongoose.model('user', UserSchema);