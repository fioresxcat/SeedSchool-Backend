const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const adminSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin'],
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
}, {
    collection: "admins"
})

module.exports = mongoose.model("admin", adminSchema);

