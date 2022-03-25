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
        type: String,
        required: true
    },
    endDate: {
        type: String,
        required: true
    },
    cost: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: "ongoing"
    }
})

module.exports = mongoose.model('Session', SessionSchema)