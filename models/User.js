const { Schema, model } = require('mongoose')

const UserSchema = new Schema({
    
    fullName: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        enum: ['normal', 'admin'],
        default: 'normal'
    }

}, {timestamps: true})

module.exports = model('User', UserSchema)