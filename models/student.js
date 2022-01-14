const mongoose = require("mongoose");   
const Class = require('./class')

const Schema = mongoose.Schema;

const studentSchema = new Schema({   
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
    teacher: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: "teacher"   
    },
    parent: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: "parent"
    }
}, {
    collection: "students"   
})

// virtual method: className
studentSchema.virtual('className').get(async function() {
    const classs = await Class.findById(this.teacher.class)
    return classs.name
})

// virtual method: parentPhoneNumber
studentSchema.virtual('parentPhoneNumber').get(function() {
    return this.parent.phoneNumber
})

// virtual method:address
studentSchema.virtual('address').get(function() {
    return this.parent.address
})

module.exports = mongoose.model("student", studentSchema)  

// theem student
// + do giáo viên thêm
// + phụ huynh phải có trước học sinh
// + khi ấn vào thêm sẽ hiện ra 1 form để điền các thông tin của học sinh mới
// + trường phụ huynh 