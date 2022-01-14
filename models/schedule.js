const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const scheduleSchema = new Schema({
    class: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: "lop"
    },
    date: {
        type: Date,
        required: true
    },
    Cachd: { 
        type: [String], 
        required: true
    }
}, {
    collection: "schedule"
})

module.exports = mongoose.model("schedule",scheduleSchema);

