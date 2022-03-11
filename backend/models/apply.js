const mongoose = require('../database/index')

const ApplySchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    student: {
        type: String,
        required: true
    },
    teacher: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    
})

module.exports = mongoose.model('Apply', ApplySchema)