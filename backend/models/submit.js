const mongoose = require('../database/index')

const SubmitSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    user: {
        type: String,
        required: true
    },

    problem: {
        type: String,
        required: true
    },
    score: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    }
})

module.exports = mongoose.model('Submit', SubmitSchema)