const jwt =  require("jsonwebtoken")
const express = require("express")

//Load User
const Teacher = require('../../models/teacher')
const Parent = require('../../models/parent')
const Admin = require('../../models/admin')


exports.checkAuth = async (req, res, next) => {
	try {
        const authHeader = req.header('Authorization')
	    const token = authHeader && authHeader.split(' ')[1]
		const idUser = jwt.verify(token,'admin')
        await Admin.findOne({idUser})
        .then((data)=>{
            if(data){
                res.json({success: true,message:'Bạn đã đăng nhập', token:token})
            }else{
               next()
            }
        }) 
	} catch (error) {
		next()
	}
}

exports.checkLogin = async (req, res, next) => {
	try {
        const authHeader = req.header('Authorization')
	    const token = authHeader && authHeader.split(' ')[1]
		const idUser = jwt.verify(token,'admin')
        await Admin.findOne({idUser})
        .then((data)=>{
            if(data){
                res.json({success: true,message:'Bạn đã đăng nhập', token:token})
            }else{
                res.json({success: false,message:'Chưa đăng nhập'})
            }
        }) 
	} catch (error) {
		res.json({success: false,message:"Chưa đăng nhập"})
	}
}


exports.checkTeacher =async (req, res,next ) => {
    try{
        const authHeader = req.header('Authorization')
	    const token = authHeader && authHeader.split(' ')[1]
        const idUser = jwt.verify(token,'longphu')
        await Teacher.findOne({
            idUser
        })
        .then(user => {
            if(user){
                next()
            }else{
                res.json({success: false, message: 'Bạn không đủ quyền'})
            }
        })
    }catch(err){
        res.json({success: false, message: 'Bạn chưa đăng nhập'})
    }
}


exports.checkAdmin =  (req, res, next) => {
    try{
        const authHeader = req.header('Authorization')
	    const token = authHeader && authHeader.split(' ')[1]
        const idUser = jwt.verify(token,'mk')
        Admin.findOne({
            idUser
        })
        .then(user => {
            if(user){
                next()
            }else{
                res.json({success: false, message: 'Bạn không đủ quyền'})
            }
        })
    }catch(err){
        res.json({success: false, message: 'Bạn chưa đăng nhập'})
    }
}

exports.checkParent = async (req, res, next) => {
    try{
        const authHeader = req.header('Authorization')
	    const token = authHeader && authHeader.split(' ')[1]
        const idUser = jwt.verify(token,'longphu')
        await Parent.findOne({
            idUser
        })
        .then(user => {
            if(user){
                next()
            }else{
                res.json({success: false, message: 'Bạn không đủ quyền'})
            }
        })
    }catch(err){
        res.json({success: false, message: 'Bạn chưa đăng nhập'})
    }
}
