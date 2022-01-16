const mongoose = require("mongoose");
const Schedule = require("./schedule");

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
        ref: "teacherattenda"
    },
    date: {
        type: Date,
        required: true
    },
    attendancePicture: {
        type: String,   
        required: true        
    },
    // schedule: {
    //     type: mongoose.SchemaTypes.ObjectId,
    //     required: true,
    //     ref:'schedule'
    // },
    comment: {
        type: String, 
    },
    lookAfterLate1: { 
        type: Number,
        enum: [0,1], // 0 - dung gio, 1 - tu 5r den 6r, 2 - sau 6r
        required: true
    },
    lookAfterLate2: { 
        type: Number,
        enum: [0,1], // 0 - dung gio, 1 - tu 5r den 6r, 2 - sau 6r
        required: true
    },
    lateForSchool1: {
        type: Number,
        enum: [0,1],   
        required: true
    },
    lateForSchool2: {
        type: Number,
        enum: [0,1],   
        required: true
    }
}, {
    collection: "logBooks"
})

logBookSchema.virtual('schedule', {
    ref: 'schedule',
    localField: ['teacher', 'date'],
    foreignField: ['teacher', 'date'],
    justOne: true
})

module.exports = mongoose.model("logBook",logBookSchema);

//các thao tác
// + thêm logbook cho ngày mới
// + sửa logbook
