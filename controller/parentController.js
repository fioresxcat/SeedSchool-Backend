const Parent = require('../models/parent')
const Student = require('../models/student')
const jwt = require('jsonwebtoken')

const login = async (req, res) => {
    if (req.headers.authorization.split(' ')[1]==='undefined') {
        console.log('Khong co authoorixation ne')
        console.log(req.headers)
        const username = req.body.username
        const password = req.body.password
        // console.log(username, password)
        try {
            const parent = await Parent.findOne({ username: username, password: password }) // tìm trong csdl xem có tk hợp lệ không
            if (parent) {
                const token = jwt.sign({ _id: parent._id }, 'mk') // mã hóa id của người dùng dưới dạng 1 chuỗi jwt
                return res.json({ status: 'success', token: token, parent: parent })
            } else {
                console.log('parent not found')
                return res.json({status: 'fail', msg: 'parent not found'})
            }
        } catch (err) {
            console.log('server error')
            console.log(err)
        }
    } else {
        const token = req.headers.authorization.split(' ')[1];
        if (token) {
            jwt.verify(token, 'mk', (err, result) => {
                if (err) return res.json({status:'fail', msg: 'invalid token'})
                else {
                    Parent.findById(result._id, (err, result) => {
                        if(err) return res.json({status:'fail', msg:'server error'})
                        else if(result) {
                            return res.json({status:'success', parent: result, msg: 'login successfully', token: token})
                        }
                    })
                }
            })
        }
    }
}


const getStudent = async (req, res, next) => {
    const parent = req.parent
    try {
        const student = await Student.findOne({ parent: parent._id })
        if (student) {
            return res.json({ status: 'success', msg: 'find successfully', student: student })
        } else {
            console.log('student of parent not found')
            return res.json({ status: 'fail', msg: 'not found student' })
        }
    } catch (err) {
        console.log('server err')
        console.log(err)
        return res.json({ status: 'fail', msg: 'server err' })
    }
}

const getLogBook = async (req, res) => {

}

module.exports.login = login
module.exports.getStudent = getStudent
module.exports.getLogBook = getLogBook