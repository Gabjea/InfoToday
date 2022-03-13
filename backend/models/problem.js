const mongoose = require('../database/index')

const ProblemSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    creator: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    tests: {
        type: Array,
        required: true
    },
    submits: {
        type: Array,
        default: []
    } 
})

module.exports = mongoose.model('Problem', ProblemSchema)