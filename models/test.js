const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const testSchema = new Schema({
    name: String,
    age: Number
})

module.exports = mongoose.model("test",testSchema);