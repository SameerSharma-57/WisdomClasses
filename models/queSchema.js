const mongoose = require('mongoose');
const schema = mongoose.Schema;

const queSchema = new schema({
    question: {
        type : String,
        required: true
    },
    op1: {
        type : String,
        required : true
    },
    op2: {
        type : String,
        required : true
    },
    op3: {
        type : String,
        required : true
    },
    op4: {
        type : String,
        required : true
    },
    ans: {
        type: String,
        required:true
    }
})

module.exports = mongoose.model('Questions',queSchema)