const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const tuitionSchema = new Schema({
    teacher: {
        type: mongoose.SchemaTypes.ObjectId,
        required:true,
        ref:'teacher'
    },
    student: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: "student"
    },
    date: { // cái này là tháng này
        type: Date,
        required: true
    },
    baseTuition: {
        type: mongoose.SchemaTypes.Decimal128,
        required: true,
        default: 5
    },
    validAbsence: {
        type: Number,
        required: true
    },
    invalidAbsence: {
        type: Number,
        required: true
    },
    late1: {
        type: Number,
        required: true
    },
    late2: {
        type: Number,
        required: true
    }
}, {                               
    collection: "tuitions"
})

// virtual method: totalTuition
tuitionSchema.virtual('totalTuition').get(function() {
    const totalTuition = this.baseTuition + late1 * 0.01 + late2 * 0.05 - validAbsence * 0.05
    return totalTuition
})

module.exports = mongoose.model("tuition", tuitionSchema);

// khi giáo viên bấm vào phần "quản lý học phí"
// + nếu giáo viên yêu cầu xem học phí tháng hiện tại, mà ngày truy cập chưa phải cuối tháng,
//   hiển thị "chưa có dữ liệu học phí cho tháng này"
// + nếu giáo viên yêu cầu xem học phí của các tháng trước, load từ database ra cho giáo viên xem
// + nếu ngày hiện tại là cuối tháng, server xử lí lấy thông tin từ sổ theo dõi và lưu học phí vào database 