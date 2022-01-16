const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const parentMailBoxSchema = new Schema({
    parent: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: "parent"
    },
    date: {
        type: Date,
        required: true
    },
    content: {
        type: String,
        required: true
    }    
}, {
    collection: "parentMailBoxs"
}) 
module.exports = mongoose.model("parentMailBox",parentMailBoxSchema);

