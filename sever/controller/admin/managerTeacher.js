const express = require('express');
const bcrypt = require('bcryptjs');
//const passport = require('passport');
//const flash = require('connect-flash');
// Load User model
const Teacher = require('../../../models/teacher')

exports.add =  (req, res) => {
    const { name, birth ,username,className, password, password2,phoneNumber, sex, numStudent } = req.body;

    if (password != password2) {
      res.json({success:false, message: 'Passwords do not match' });
    }
     else {
      Teacher.findOne({ username: username }).then(user => {
        if (user) {
          res.json({success:false, message: 'Tài khoản đã tồn tại'})
        } else {
          const newUser = new Teacher({
            name,
            username,
            password,
            className,
            phoneNumber,
            numStudent,
            sex,
            birth
          });
           newUser.save()
          .then((data) => {
            res.json({
              success: true, message: '', user: newUser
            })
          })
        }
      });
    }
}

exports.find = async(req, res) => {
  try{
    if(req.params.id){
      const id = req.params.id;

      await Teacher.findById(id)
          .then(data =>{
              if(!data){
                  res.status(404).json({ message : "Not found teacher with id "+ id})
              }else{
                  res.json(data)
              }
          })
          .catch(err =>{
              res.status(500).json({ message: "Erro retrieving teacher with id " + id})
          })

  }else{
      await Teacher.find()
          .then(data => {
              res.json(data)
          })
          .catch(err => {
              res.status(500).json({ success: false, message : "Error Occurred while retriving teacher information" })
          })
      }
  
  }catch{
    res.status(500).json({ success: false, message: 'Thất bại' })
  }
}

exports.update = (req, res)=>{
  if(!req.body){
      return res  
          .status(400)
          .json({success:false, message : "Data to update can not be empty"})
  }

  const id = req.params.id;
  Teacher.findByIdAndUpdate(id, req.body, { useFindAndModify: false})
      .then(data => {
          if(!data){
              res.status(404).json({ success:false,message : `Cannot Update teacher with ${id}. Maybe teacher not found!`})
          }else{
              res.json({success:true, message:'Sửa thành công'})
          }
      })
      .catch(err =>{
          res.status(500).json({success:false, message : "Error Update teacher information"})
      })
}

// Delete a user with specified user id in the request
exports.delete = (req, res)=>{
  const id = req.params.id;

  Teacher.findByIdAndDelete(id)
      .then(data => {
          if(!data){
              res.status(404).json({success:false, message : `Cannot Delete with id ${id}. Maybe id is wrong`})
          }else{
              res.json({success:true,
                  message : "Teacher was deleted successfully!"
              })
          }
      })
      .catch(err =>{
          res.status(500).json({
              success:false,
              message: "Could not delete teacher with id=" + id
          });
      });
}