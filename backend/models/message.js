const mongoose = require('../database/index')

const MessageSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    sender: {
        type: String,
        required: true
    },
    receiver: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    
})

module.exports = mongoose.model('Message', MessageSchema)