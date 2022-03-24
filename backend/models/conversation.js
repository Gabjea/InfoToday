const mongoose = require('../database/index')

const ConversationSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    user1: {
        type: String,
        required: true
    },
    user2: {
        type: String,
        required: true
    }
    
})

module.exports = mongoose.model('Conversation', ConversationSchema)