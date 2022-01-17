const express = require('express')
const router = express.Router()
const checkTeacherRole = require('../middleware/checkTeacherRole')
const teacherController = require('../controller/teacherController')

// khi nguoi dung bam nut login as teacher
router.post('/api/teacher/login', teacherController.login)

// -------------------------------- thong tin hoc sinh ---------------------------------

// xem bang quan ly thong tin hoc sinh
//ok
// return: students
router.get('/api/teacher/getstudents', checkTeacherRole, teacherController.getStudents)

// xem thong tin hoc sinh cu the
//ok
router.get('/api/teacher/getstudent/:id', checkTeacherRole, teacherController.getStudent)

// them hoc sinh cu the
//ok
router.post('/api/teacher/addstudent', checkTeacherRole, teacherController.addStudent)

// sua thong tin hoc sinh cu the
//ok
router.put('/api/teacher/editstudent/:id', checkTeacherRole, teacherController.editStudent)

// xoa hoc sinh cu the
//ok
router.delete('/api/teacher/deletestudent/:id', checkTeacherRole, teacherController.deleteStudent)

// --------------------------------- so theo doi -------------------------------------------------
// xem so theo dõi
// + neu co student + co ngay => tra ve mot logbook duy nhat
// + neu ko co ngay + ko co student => tra ve danh sach logbook cua ngay moi nhat
// + neu co ngay + ko student => tra ve danh sach logbook trong ngay do
// + neu ko co ngay + co student => tra ve danh sach logbook cho student do
//ok
router.get('/api/teacher/getlogbooks', checkTeacherRole, teacherController.getLogBooks)

// sua so theo doi (1 hoc sinh + 1 ngay)
//ok
router.put('/api/teacher/editlogbook', checkTeacherRole, teacherController.editLogBook)

// them so theo doi (1 hoc sinh + 1 ngay)
//ok
router.post('/api/teacher/addlogbook', checkTeacherRole, teacherController.addLogBook)


// ------------------------------------ thoi khoa bieu -----------------------------------------
// xem thoi khoa bieu
// ok
router.get('/api/teacher/getschedule', checkTeacherRole, teacherController.getSchedule)
// them tkb
router.post('/api/teacher/addactivity', checkTeacherRole, teacherController.addActivitySchedule)
// sua tkb
router.put('/api/teacher/editactivity', checkTeacherRole, teacherController.editActivitySchedule)
// xoa tkb
router.delete('/api/teacher/deleteactivity', checkTeacherRole, teacherController.deleteActivitySchedule)

// ------------------------------------- hoc phi ----------------------------
// xem hoc phi theo thang
// router.get('/api/teacher/gettuition', checkTeacherRole, teacherController.getTuition)
// 



// ----------------------------------------- hom thu -------------------------------
// // xem tat ca thu
// router.get('/api/teacher/mail', checkTeacherRole, teacherController.getAllMail)
// // xem chi tiet mot thu
// router.get('/api/teacher/mail/:id', checkTeacherRole, teacherController.getDetailMail)

module.exports = router