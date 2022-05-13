//const { Int32 } = require('mongodb')
const mongoose = require('mongoose')

const querySchema = new mongoose.Schema({

    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    response: {
        type: String,
        default: '-'
    }

})

module.exports = mongoose.model('Query', querySchema)