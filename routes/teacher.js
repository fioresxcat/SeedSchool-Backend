const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const checkTeacherRole = require('../middleware/checkTeacherRole')
const Teacher = require('../models/teacher')
const Student = require('../models/student')
const Parent = require('../models/parent')
const Tuition = require('../models/tuition')
const LogBook = require('../models/logBook')

// router.use(checkRole('teacher'))

// ------------------------------------------ get method --------------------------------------


// 1. hien thi trang login
router.get('/login', (req, res) => {
    res.render('./teachers/login')
})


// 3. xem bang quan ly thong tin hoc sinh
/*
giao dien:
+ sẽ có 1 bảng hiển thị hết tất cả thông tin của tất cả học sinh trong lớp
+ bảng gồm các trường
    - stt
    - tên hs
    - ngày sinh
    - giới tính
    - lớp
    - địa chỉ
    - tên phụ huynh
    - sđt phụ huynh
+ phần tên học sinh sẽ là 1 link, khi giáo viên click vào đó sẽ ra thông tin chi tiết của phụ huynh
+ phần tên phụ huynh sẽ là 1 link, khi giáo viên click vào đó sẽ ra thông tin chi tiết của phụ huynh
*/
router.get('/view/students', checkTeacherRole, async (req, res) => {
    // lay ra tat ca hoc sinh co ma GV tuong ung voi giao vien da dang nhap
    const students = await Student.find({ teacher: req.teacher._id })
    // truyen sang cho frontend
    res.render('./teachers/viewStudents', { students: students })
})

// 3.1 xem thong tin chi tiet cua mot hoc sinh
// bam vao mot hoc sinh trong bang quan ly hoc sinh de hien thi chi tiet thong tin ve hoc sinh do
// lay hoc sinh theo id tu database ra nhet cho frontend
router.get('/view/students/:id', async (req, res) => {
    const student = await Student.findById(req.params.id)
    res.render('./teachers/studentDetail', { student: student })
})

// 3.2 sua thong tin chi tiet cua mot hoc sinh
// can post tuong ung
router.get('/edit/students/:id', async (req, res) => {
    const student = await Student.findById(req.params.id)
    res.render('./teachers/editStudent', { student: student })
})

// 3.3 xoa mot hoc sinh
/* giao diện:
+ hien thi mot thong bao xac nhan xoa hoc sinh
+ có 1 tùy chọn để xóa luôn cả phụ huynh (có thể không cần xóa phụ huynh vì nhỡ th đó chuyển lớp)
+ hiển thị dưới dạng form pop up (có được ko ?)
*/
// can 1 delete tương ứng



// 4. xem so theo doi cua ca lop 10 ngay gan nhat
/* giao diện
+ lần đầu vào trang chỉ hiện danh sách tên các học sinh trong lớp
+ bấm vào học sinh nào thì số theo dõi của ngày đó của học sinh đó sẽ xổ xuống
+ hiển thị theo ngày. lần đầu vào link sẽ hiển thị ra sổ theo dõi của ngày gần nhất
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
*/
router.get('/view/logbooks', async (req, res) => {
    const logBooks
    if (req.query.date) { // nếu có nhập date vào ô date
        // lay so theo doi co date tuong ung ra
        logBooks = await LogBook.find({ teacher: req.teacher._id, date: req.query.date })
    } else { // nếu không có date kèm theo, hay nói cách khác trong lần load trang đầu tiên
        const newestLogBook = await LogBook.find({ teacher: req.teacher._id }).sort({ date: -1 }).limit(1)
        const newestDate = newestLogBook.date
        // lay so theo doi ngay moi nhat ra
        logBooks = await LogBook.find({ teacher: req.teacher._id, date: newestDate })
    }
    // send logBook to frontend
})

// 4.1 xem chi tiet so theo doi cua mot hoc sinh
router.get('/view/logbooks/:id', async (req, res) => {
    // id là id của logbook, ko phải của student
    // lấy 1 document trong schema "sổ theo dõi" tương ứng ra để hiển thị
    const logBook = await LogBook.findById(req.params.id)
    // nên hiển thi phần thông tin bên trái, ảnh điểm danh bên phải
    res.render('./teachers/viewLogBookDetail')
})

// 4.2 sua so theo doi
// hien thi ra trang de edit
// can put tuong ung
router.get('/edit/logbooks/:id', (req, res) => {
    // id là id của logbook
})

// 4.3 thêm sổ theo dõi cho ngày hôm nay
// cần post tương ứng


// 5. xem thoi khoa bieu
router.get('/view/schedule', (req, res) => {
    if (req.query.date) { // nếu có nhập date vào ô date
        // lay tkb co date tuong ung ra
    } else { // nếu không có date kèm theo, hay nói cách khác trong lần load trang đầu tiên
        // lay tkb ngay moi nhat ra
    }
})

// them thoi khoa bieu theo ngay
// hien thi ra mot form de dien thoi khoa bieu
// can post tuong ung
router.get('/add/schedule', (req, res) => {

})

// quan ly hoc phi ca lop
router.get('/view/tuition', (req, res) => {

})

// sua thong tin hoc phi cua mot hoc sinh
// chi cho sua thong tin ve so buoi hoc, so buoi nghi, so lan di muon, ...
// sua xong he thong se tu tinh hoc phi
router.get('/edit/tuition/:id', (req, res) => {

})


// ----------------------------------------- post and put method -----------------------------------------

// có một nút bấm "Gửi thông báo" ở trang học phí
// làm thế nào để khi bấm vào nút đó thì server nhận biết được đây
// có thể wrap button đó trong một cái form 
router.post('/viewTuition/sendNoti', (req, res) => {
    // tạo cho mỗi phụ huynh 1 thông báo về học phí của con mình theo form có sẵn
    // các phụ huynh khác nhau chỉ cần thay số khác thôi
    // update vào schema "hộp thư phụ huynh"
    // bên parents khi ấn vào phần "thông báo" sẽ luôn lấy dữ liệu từ Schema này ra để hiển thị
})

// sua thong tin chi tiet cua mot hoc sinh
router.put('student/:id', (req, res) => {
    // nhan du lieu tu ben client roi update thoi
})

// sua so theo doi
router.put('logbook/:id', (req, res) => {
    // nhan du lieu tu ben client roi update thoi
})

// thêm sổ theo dõi
router.post('/logbook', async (req, res) => {

})

// them thoi khoa bieu theo ngay
router.post('/schedule', (req, res) => {
    // thêm dữ liệu từ client vào schema "thời khóa biểu"
})



module.exports = router