const jwt = require('jsonwebtoken')
const Parent = require('../models/parent')

const checkParentRole = async (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1] // lấy token từ cookie
    console.log('Token gui len tu cilent: ' + token)
    if (token=='undefined') return res.json({ status: 'fail', msg: 'token not found. cannot access parent functionality'}) 

    const _id = jwt.verify(token, 'mk') // decrypt lại id người dùng từ cookie
    try {
        const parent = await Parent.findById(_id).populate('student') // lấy parent từ id tương ứng
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