const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    Email:{
        type:String,
        required:true,
        unique:true

    },
    UserName:{
        type:String,
        required:true

    },
    Role:{
        type:String,
        required:true
    },
    Passwords:{
        type:String,
        required:true
    }

},{ timestamps: true });
const User = mongoose.model('User', UserSchema);
module.exports = User;
