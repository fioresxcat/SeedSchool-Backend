const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const activityScheduleSchema = new Schema({
    teacher: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'teacher'
    },
    date: {
        type: Date,
        required: true,
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
})


module.exports = mongoose.model("activitySchedule", activityScheduleSchema);
