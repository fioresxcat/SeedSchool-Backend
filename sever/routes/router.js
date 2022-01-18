const express = require('express');
const router = express.Router();
const path = require('path');
//Load User model 
const Teacher = require('../../models/teacher');

const check = require('../config/auth')
const teacher = require('../controller/admin/managerTeacher')
const login = require('../controller/login')
const activity = require('../controller/admin/activity')
const foodmenu = require('../controller/admin/foodMenu')


//login
// router.post('/api/parent/login', login.loginParent)
// router.post('/api/teacher/login',check.checkLogin,  login.loginTeacher)
router.post('/api/admin/login',check.checkAuth, login.loginAdmin)
router.post('/api/admin/login/check', check.checkLogin)


//ManagerTeacher
router.post('/api/admin/teacher',check.checkAdmin, teacher.add);
router.get('/api/admin/teacher', check.checkAdmin,teacher.find);
router.put('/api/admin/teacher/:id',check.checkAdmin, teacher.update);
router.delete('/api/admin/teacher/:id',check.checkAdmin, teacher.delete);
router.get('/api/admin/teacher/:id',check.checkAdmin, teacher.find )


//Activity
router.post('/api/admin', check.checkAdmin,check.checkAuth)
router.post('/api/admin/activities', check.checkAdmin,activity.create);
router.get('/api/admin/activities', check.checkAdmin,activity.find);
router.post('/api/admin/activities/find',check.checkAdmin, activity.findDate)
router.put('/api/admin/activities/:id',check.checkAdmin, activity.update);
router.delete('/api/admin/activities/:id',check.checkAdmin, activity.delete);
router.get('/api/admin/activities/:id',check.checkAdmin, activity.find);
router.get('/api/admin/activities/sendnoti/:id', check.checkAdmin, activity.sendNoti)

//FoodMenu7
router.post('/api/admin/foodmenu/add',check.checkAdmin, foodmenu.create);
router.get('/api/admin/foodmenu',check.checkAdmin, foodmenu.find);
router.get('/api/admin/foodmenu/:id',check.checkAdmin, foodmenu.find);
router.post('/api/admin/foodmenu/find',check.checkAdmin, foodmenu.findDate)
router.put('/api/admin/foodmenu/:id', check.checkAdmin,foodmenu.update);
router.delete('/api/admin/foodmenu/:id',check.checkAdmin, foodmenu.delete);



module.exports = router;

