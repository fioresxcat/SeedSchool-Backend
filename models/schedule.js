const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const scheduleSchema = new Schema({
    teacher: {
        type: mongoose.SchemaTypes.ObjectId,
        reuiqred: true
    },
    date: {
        type: Date,
        required: true
    },
    activityList: {
        type: [{
            start: Date,
            end: Date,
            content: String
        }]
    }
})

module.exports = mongoose.model("schedule", scheduleSchema);
