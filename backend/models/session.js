const mongoose = require('../database/index')

const SessionSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    student: {
        type: String,
        required: true,
    },
    teacher: {
        type: String,
        required: true,
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
})

module.exports = mongoose.model('Session', SessionSchema)