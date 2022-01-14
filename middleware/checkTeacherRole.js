const jwt = require('jsonwebtoken')
const Teacher = require('../models/teacher')

const checkTeacherRole = async (req, res, next) => {
    const token = req.cookies.userToken // lấy token từ cookie
    if (!token) return res.redirect('./teacher/login') // nếu ko có token, trả lại trang login

    const _id = jwt.verify(token, 'mk') // decrypt lại id người dùng từ cookie
    try {
        const teacher = await Teacher.findById(_id) // lấy admin từ id tương ứng
        if (teacher) {
            req.admin = teacher
            next()
        } else {
            console.log('you need to login as teacher')
            return res.redirect('/teacher/login')
        }
    } catch (err) {
        console.log(err)
        return res.redirect('/teacher/login')
    }
}

module.exports = checkTeacherRole