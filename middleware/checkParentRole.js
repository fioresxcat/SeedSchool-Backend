const jwt = require('jsonwebtoken')
const Parent = require('../models/parent')

const checkParentRole = async (req, res, next) => {
    const token = localStorage.getItem('token') // lấy token từ cookie
    if (!token) return res.json({ status: 'fail', msg: 'token not found'}) 

    const _id = jwt.verify(token, 'mk') // decrypt lại id người dùng từ cookie
    try {
        const parent = await Parent.findById(_id) // lấy parent từ id tương ứng
        if (parent) {
            req.parent = parent
            next()
        } else {
            console.log('you need to login as parent')
            return res.json({ status: 'fail', msg: 'invalid parent token'})
        }
    } catch(err) {
        console.log(err)
        return res.json({ status: 'fail', msg: 'server error'})
    }
}

module.exports = checkParentRole