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
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ["Học phí", "Hoạt động chung"],
        required: true
    },
    registered: {
        type: Boolean,
        default: false
    },
    commonActivity: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'activity'
    }
}, {
    collection: "parentMails"
})



module.exports = mongoose.model("parentMail", parentMailSchema);

