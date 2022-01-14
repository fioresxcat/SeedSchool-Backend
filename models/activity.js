const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const activitiSchema = new Schema({
    time: { 
        type: Date, 
        required: true
    },
    content: {
        type: String,
        required: true
    },
    note: {
        type: String,
        required: true
    }
}, {
    collection: "activities"
})

module.exports = mongoose.model("activity",activitiSchema);

