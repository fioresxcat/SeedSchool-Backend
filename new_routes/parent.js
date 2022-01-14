const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const checkParentRole = require('../middleware/checkParentRole')
const parentController = require('../controller/parentController')

// cac chuc nang cua parent


// khi nguoi dung nhan nut dang nhap
router.post('/api/parent/login', parentController.login);
// lay thong tin hoc sinh tuong ung
router.get('/api/parent/getstudent', checkParentRole, parentController.getStudent)
// lay thong tin so theo doi
router.get('/api/parent/getlogbook', checkParentRole, parentController.getLogBook)

module.exports = router