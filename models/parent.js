const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const parentSchema = new Schema({
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
        enum: ['parent'],
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
        enum: ["Nam", "Nữ"],
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
}, {
    collection: "parents"
})

parentSchema.virtual('student', {
    ref: 'student',
    localField: '_id',
    foreignField: 'parent',
    justOne: true
})

module.exports = mongoose.model("parent", parentSchema);

// tài khoản phụ huynh do trường cấp
// các thao tác
// + thêm phụ huynh: thêm luôn username, password và các trường thông tin vào