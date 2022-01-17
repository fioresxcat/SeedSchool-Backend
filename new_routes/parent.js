const express = require('express')
const router = express.Router()
const checkParentRole = require('../middleware/checkParentRole')
const parentController = require('../controller/parentController')

// cac chuc nang cua parent


// khi nguoi dung nhan nut dang nhap
router.post('/api/parent/login', parentController.login);
// lay thong tin hoc sinh tuong ung de hien thi ra trang xem thong tin hoc sinh
router.get('/api/parent/getstudent', checkParentRole, parentController.getStudent)
// lay thong tin so theo doi 
router.get('/api/parent/getlogbooks', checkParentRole, parentController.getLogBooks)
// lay thong tin hoc phi
router.get('/api/parent/gettuition', checkParentRole, parentController.getTuition)


module.exports = router