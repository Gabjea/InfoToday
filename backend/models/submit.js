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
        default: new Date
    }
})

module.exports = mongoose.model('Submit', SubmitSchema)