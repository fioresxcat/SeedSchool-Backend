const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
// const checkRole = require('../middleware/checkRole')
// const User = require('../models/user')
const checkParentRole = require('../middleware/checkParentRole')
const Student = require('../models/student')
const Parent = require('../models/parent')
const LogBook = require('../models/logBook')
const Tuition = require('../models/tuition')

// router.use(checkRole('parent'))
// ------------------------------------------- get method ---------------------------------------------


// 1. hien thi trang login
router.get('/login', (req, res) => {
    var temp = {
        name: "tung",
        age: 20
    }

    console.log(temp.name, temp.age)
    res.render('./parents/login1', {temp: temp})
})


// 2. hien thi thong tin chao mung phu huynh
router.get('/dashboard',  async (req, res) => {
    res.render('./parents/template/index1')
    // res.send(`Chao mung phu huynh ${req.parent.name} den voi he thong quan tri cuar truong mam non seed school`)
})


// 3. xem thong tin cua hoc sinh tuong ung voi phu huynh
/*
giao diện: 
+ chỉ hiển thị ra tất cả những thông tin cơ bản về học sinh đó
+ ko có thêm đường link nào cả
*/
router.get('/viewStudentInfo', checkParentRole, async (req, res) => {
    try {
        const student = await Student.findOne({ parent: req.parent._id }) // lấy ra học sinh tương ứng với user phụ huynh
        if (student) {
            res.render('./parents/viewStudentInfo', { student: student })
        } else {
            console.log('Can not find student with this parent')
            return res.redirect('./dashboard')
        }
    } catch (err) {
        console.log('server err')
        console.log(err)
    }
})


// 4. xem thong tin so theo doi 10 ngay gan nhat
/* 
giao dien: 
+ lần đầu vào link sẽ hiển thị ra sổ theo dõi của ngày gần nhất
+ sẽ có một ô để chọn ngày, khi chọn ngày sẽ tự động load sổ theo dõi của ngày đó
+ sổ theo dõi gồm các trường: 
    - stt
    - tên học sinh
    - ngày
    - ảnh điểm danh,
    - TKB trong ngày
    - nhận xét trong ngày
    - trông muộn hay ko: có hoặc ko
    - đi muộn hay ko: có hoặc ko
+ có làm được thế ko, hay cần bấm 1 nút để submit
+ KHÔNG CẦN THÊM ĐƯỜNG LINK ĐỘNG NÀO CẢ
*/
router.get('/viewLogBook', async (req, res) => {
    const date = req.query.date // lay ngay tu request
    const student = await Student.findOne({ parent: req.parent._id }) // lấy ra học sinh tương ứng với user phụ huynh

    if (date) {
        // chon so theo doi trong database tuong ung voi ngay
        const logBook = await LogBook.findOne({ date: date , student: student._id})
        res.render('./parents/logbook.ejs', { logBook: logBook })
    } else {
        // tim logbook cua ngay gan nhat trong database
        const newestLogBook = await LogBook.find({ student: student._id }).sort({ date: 1 }).limit(1)
        // gui no cho front end
        res.render('./parents/viewLogBook', { logbook: newestLogBook })
    }
})


// 5. lien he giao vien
/*
giao diện:
+ trang nay chi hien thi ra 2 cai link
    - 1 cai de gui loi cam on
    - 1 cai de xin pheps nghi hoc
*/
router.get('/contactTeacher', (req, res) => {
    res.render('./parents/contact')
})

// 5.1 xin phep nghi hoc
// can 1 phuong thuc post cho cai nay
router.get('/contactTeacher/askForLeave', (req, res) => {
    res.render('./parents/leave_form')
})

// 5.2 gui loi cam on
// chi can res.render ra trang front end la duoc
// can 1 phuong thuc post cho cai nay
router.get('/contactTeacher/sendMessage', (req, res) => {
    res.render('./parents/message_form')
})

// 6. xem thong tin hoc phi
/*
giao diện:
+ sẽ có 1 ô để chọn tháng
+ hiển thị thông tin học phí của học sinh tương ứng với tháng đó
+ gồm các trường sau: 
    - tháng
    - tên học sinh
    - số buổi nghỉ có phép (xin phép trước 8h, được bù tiền ăn của ngày hôm đó vào tháng sau)
    - số buồi nghỉ ko phép (xin phép sau 8h)
    - số buổi trông muộn loại 1 (từ 5r-6r)
    - số buổi trông muộn loại 2 (sau 6r)
    - tổng học phí
+ Lúc đầu mới vào trang thì hiện thông tin học phí của 10 tháng gần nhất dưới dạng bảng như trên
*/
router.get('/viewTuition', checkParentRole, async (req, res) => {
    // lay hoc sinh tuong ung
    const student = await Student.findOne({ parent: req.parent._id })
    // lay thong tin tu bang hoc phi tuong ung voi hoc sinh
    // const tuitions = await Tuition.find({ student: student._id }).sort(month: )
    // nhet no cho front end
    res.render('./parents/viewTuition')
})


// ----------------------------------------- post method ------------------------------------------------


// login
router.post('/login', async (req, res) => {
    const username = req.body.username
    const password = req.body.password
    console.log(username, password)
    try {
        const parent = await Parent.findOne({ username: username, password: password }) // tìm trong csdl xem có tk hợp lệ không
        if (parent) {
            const token = jwt.sign({ _id: parent._id }, 'mk') // mã hóa id của người dùng dưới dạng 1 chuỗi jwt
            res.cookie('userToken', token) // gửi id đã mã hóa về cho client dưới dạng cookie
            // res.send('login ok, cookie set')
            res.redirect('./dashboard')
        } else {
            console.log('parent not found')
            return res.redirect('./login') // nếu thất bại (ko tìm thấy tk hợp lệ), load lại trang login
        }
    } catch (err) {
        console.log('server error')
        console.log(err)
    }
})


// khi parent submit đơn xin nghỉ học sẽ gọi đến cái này
router.post('/contactTeacher/askForLeave', async (req, res) => {
    // get current teacher
    const teacher = await Teacher.findOne({})
})

router.post('/contactTeacher/sendMessage', (req, res) => {

})

module.exports = router