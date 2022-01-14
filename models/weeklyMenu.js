const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const weeklyMenuSchema = new Schema({
    date: {
        type: Date,
        required: true
    },
    meal: {
        type: String,
        enum: ["breakfast","lunch","tea"], // bữa xế chiều dịch là tea lmol
        required: true
    },
    dailyMenu: {
        type: [String],
        required: true
    }  
}, {
    collection: "weeklyMenus"
})

module.exports = mongoose.model("weeklyMenu",weeklyMenuSchema);
