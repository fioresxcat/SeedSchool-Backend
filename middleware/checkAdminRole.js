const jwt = require('jsonwebtoken')
const Admin = require('../models/admin')

const checkAdminRole = async (req, res, next) => {
    const token = req.cookies.userToken // lấy token từ cookie
    if (!token) return res.redirect('./admin/login') // nếu ko có token, trả lại trang login
    
    const _id = jwt.verify(token, 'mk') // decrypt lại id người dùng từ cookie
    try {
        const admin = await Admin.findById(_id) // lấy admin từ id tương ứng
        if (admin) {
            req.admin = admin
            next()
        } else {
            console.log('you need to login as admin')
            return res.redirect('/admin/login')
        }
    } catch(err) {
        console.log(err)
        return res.redirect('/admin/login')
    }
}

module.exports = checkAdminRole