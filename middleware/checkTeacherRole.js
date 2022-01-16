const jwt = require('jsonwebtoken')
const Teacher = require('../models/teacher')

const checkTeacherRole = async (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1] // lấy token từ cookie
    console.log('Token gui len tu cilent: ' + token)
    if (token=='undefined') return res.json({ status: 'fail', msg: 'token not found'}) 

    const _id = jwt.verify(token, 'mk') // decrypt lại id người dùng từ cookie
    try {
        const teacher = await Teacher.findById(_id) // lấy teacher từ id tương ứng
        if (teacher) {
            req.teacher = teacher
            next()
        } else {
            console.log('you need to login as teacher')
            return res.json({ status: 'fail', msg: 'invalid teacher token'})
        }
    } catch(err) {
        console.log(err)
        return res.json({ status: 'fail', msg: 'server error'})
    }
}

module.exports = checkTeacherRole