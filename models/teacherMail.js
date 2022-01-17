const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const teacherMailSchema = new Schema({
    teacher: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: "teacher"
    },
    parent: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: "parent"
    },
    date: {
        type: Date,
        required: true,
        default: Date.now()
    },
    title: {
        type:String,
        required:true
    },
    content: {
        type: String,
        required: true
    }
}, {
    collection: "teacherMails"
})

module.exports = mongoose.model("teacherMail",teacherMailSchema)
