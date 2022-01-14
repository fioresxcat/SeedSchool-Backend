const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const teacherMailBoxSchema = new Schema({
    teacher: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: "teacher"
    },
    date: {
        type: Date,
        required: true
    },
    commentOfParent: {
        type: String
    },
    absentForm: {
        date: Date,
        content: String
    }
}, {
    collection: "teacherMailBoxs"
})

module.exports = mongoose.model("teacherMailBox",teacherMailBoxSchema)
