const express = require('express')
const router = express.Router()
const checkParentRole = require('../middleware/checkParentRole')
const parentController = require('../controller/parentController')

// cac chuc nang cua parent
// ok het roi

// khi nguoi dung nhan nut dang nhap
// return : token, parent
router.post('/api/parent/login', parentController.login)

// lay thong tin hoc sinh tuong ung de hien thi ra trang xem thong tin hoc sinh
// return: student, parent
router.get('/api/parent/student', checkParentRole, parentController.getDetailStudent)

// lay thong tin so theo doi 
// vua lay tất cả sổ theo dõi: return: logBooks: so theo doi 10 ngay gan nhat
// vừa lấy sổ theo dõi theo ngày: return logBook: so theo doi cua ngay do
router.get('/api/parent/logbook', checkParentRole, parentController.getLogBook)

// lay thong tin hoc phi
// api này vừa xử lý lấy tất cả học phí: return: tuitions: hoc phi 10 thang gan nhat
// vừa xử lí lấy học phí theo tháng: tuitions: hoc phi cua thang do
router.get('/api/parent/tuition', checkParentRole, parentController.getTuition)

// lay thong tin thoi khoa bieu
// lay tkb moi nhat: schedule
// lay tkb theo ngay: schedule
router.get('/api/parent/schedule', checkParentRole, parentController.getSchedule)


// lay thong tin tat ca thong bao
// return : mails: chua tat ca mails
router.get('/api/parent/mail', checkParentRole, parentController.getAllMail)

// lay thong tin mot thong bao cu the
// return: mail
router.get('/api/parent/mail/:id', checkParentRole, parentController.getDetailMail)

// gui 1 thong bao den giao vien 
// return: mail: mail da gui
router.post('/api/parent/mail', checkParentRole, parentController.postMail)

module.exports = router