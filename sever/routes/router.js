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
router.post('/api/admin/login',check.checkLogin,  login.loginAdmin)


//ManagerTeacher
router.post('/api/admin/teacher',check.checkAdmin, teacher.add);
router.get('/api/admin/teacher',check.checkAdmin, teacher.find);
router.put('/api/admin/teacher/:id', teacher.update);
router.delete('/api/admin/teacher/:id',check.checkAdmin, teacher.delete);
router.get('/api/admin/teacher/:id', check.checkAdmin,teacher.find )


//Activity
router.post('/api/admin/activities', activity.create);
router.get('/api/admin/activities', activity.find);
router.post('/api/admin/activities/find', activity.findDate)
router.put('/api/admin/activities/:id', activity.update);
router.delete('/api/admin/activities/:id', activity.delete);
router.get('/api/admin/activities/:id', activity.find);

//FoodMenu7
router.post('/api/admin/foodmenu/add', foodmenu.create);
router.get('/api/admin/foodmenu', foodmenu.find);
router.get('/api/admin/foodmenu/:id', foodmenu.find);
router.post('/api/admin/foodmenu/find', foodmenu.findDate)
router.put('/api/admin/foodmenu/:id', foodmenu.update);
router.delete('/api/admin/foodmenu/:id', foodmenu.delete);


module.exports = router;

