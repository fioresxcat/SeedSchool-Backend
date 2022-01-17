const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const parentMailSchema = new Schema({
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
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }    
}, {
    collection: "parentMails"
}) 
module.exports = mongoose.model("parentMail",parentMailSchema);

