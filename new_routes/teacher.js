const express = require('express')
const router = express.Router()
const checkTeacherRole = require('../middleware/checkTeacherRole')
const teacherController = require('../controller/teacherController')

// khi nguoi dung bam nut login as teacher
router.post('/api/teacher/login', teacherController.login)

// -------------------------------- thong tin hoc sinh ---------------------------------
// xem bang quan ly thong tin hoc sinh
router.get('/api/teacher/getstudents', checkTeacherRole, teacherController.getStudents)
// xem thong tin hoc sinh cu the
router.get('/api/teacher/getstudent/:id', checkTeacherRole, teacherController.getStudent)
// sua thong tin hoc sinh cu the
router.get('/api/teacher/editstudent/:id', checkTeacherRole, teacherController.editStudent)
// xoa hoc sinh cu the
router.get('/api/teacher/deletestudent/:id', checkTeacherRole, teacherController.deleteStudent)
// them hoc sinh
router.post('/api/teacher/addstudent', checkTeacherRole, teacherController.addStudent)

// --------------------------------- so theo doi -------------------------------------------------
// xem so theo dõi
// + trong 1 ngay cu the
// + cua 1 hoc sinh cu the
// + cua duy nhat 1 hoc sinh + 1 ngay
router.get('/api/teacher/getlogbooks', checkTeacherRole, teacherController.getLogBooks)
// sua so theo doi (1 hoc sinh + 1 ngay)
router.put('/api/teacher/editlogbook', checkTeacherRole, teacherController.editLogBook)
// them so theo doi (1 hoc sinh + 1 ngay)
router.post('/api/teacher/addlogbook', checkTeacherRole, teacherController.addLogBook)

// ------------------------------------ thoi khoa bieu -----------------------------------------
// xem thoi khoa bieu
router.get('/api/teacher/getschedule', checkTeacherRole, teacherController.getSchedule)
// them hoat dong tkb
router.post('/api/teacher/addschedule', checkTeacherRole, teacherController.addActivitySchedule)
// sua hoat dong tkb
router.put('/api/teacher/editschedule', checkTeacherRole, teacherController.editActivitySchedule)
// xoa hoa dong tkb
router.delete('/api/teacher/deleteschedule', checkTeacherRole, teacherController.deleteActivitySchedule)

// ------------------------------- hoc phi ----------------------------
// xem hoc phi theo thang
router.get('/api/teacher/tuition', checkTeacherRole, teacherController.getTuition)
// 