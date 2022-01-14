const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const logBookSchema = new Schema({
    student: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: "student"
    },
    teacher: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: "teacher"
    },
    date: {
        type: Date,
        required: true
    },
    attendancePicture: {
        type: String,   
        required: true        
    },
    schedule: {
        type: [String],
        required: true
    },
    comment: {
        type: String, 
    },
    lookAfterLate: { 
        type: Number,
        enum: [0,1,2], // 0 - dung gio, 1 - tu 5r den 6r, 2 - sau 6r
        required: true
    },
    lateForSchool: {
        type: Number,
        enum: [0,1],   
        required: true
    }
}, {
    collection: "logBooks"
})

module.exports = mongoose.model("logBook",logBookSchema);

//các thao tác
// + thêm logbook cho ngày mới
// + sửa logbook
