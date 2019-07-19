const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    username:{
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password:{
        type: String,
        required: true
    }


},{
    collection: 'users'
})
const User = mongoose.model('users',UserSchema)
module.exports = User