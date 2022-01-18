const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const teacherSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique:true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['teacher'],
        required: true
    },
    name: {
        type: String,
        required: true
    },
    birth: {
        type: Date,
        required: true
    },
    sex: {
        type: String,
        enum: ["Nam","Nữ"],
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    // class: {
    //     type: mongoose.SchemaTypes.ObjectId,
    //     required: true,
    //     ref: "class"
    // },
    className: {
        type: String,
        required: true,
        unique: true
    },
    numStudent: {
        type: Number,
        default: 0
    }
}, {
    collection: "teachers"
})

module.exports = mongoose.model("teacher",teacherSchema);

