const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const classSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    // numberOfStudent: {
    //     type: Number,
    //     required: true
    // }, // cũng đéo cần luôn
    // teacher: {
    //     type: mongoose.SchemaTypes.ObjectId,
    //     required: true,
    //     ref: "teacher"
    // } // khi them class ko can phai co giao vien luon
}, {
    collection: "classes"
})

module.exports = mongoose.model("class",classSchema);


// use case
// + khi admin thêm giáo viên thì chọn 1 trong các lớp
// + là model để giáo viên ref đến

// thêm lớp
// + chỉ cần cung cấp tên là được
// + khi muốn tính sĩ số thì lấy giáo viên -> lấy số học sinh tương ứng với giáo viên