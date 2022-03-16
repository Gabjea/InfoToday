const mongoose = require('../database/index')

const UserSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    profile_pic: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    coins: {
        type: Number,
        default: 0,
        required: true
    },
    desc: {
        type: String,
        required: false
    },
    cost: {
        type: Number,
        required: false,
    },
    students: {
        type: Array,
        required: false,
    }
})

module.exports = mongoose.model('User', UserSchema)