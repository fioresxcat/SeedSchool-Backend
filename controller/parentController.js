const Parent = require('../models/parent')
const Student = require('../models/student')
const LogBook = require('../models/logBook')
const Tuition = require('../models/tuition')
const Teacher = require('../models/teacher')
const jwt = require('jsonwebtoken')
const schedule = require('../models/schedule')

const login = async (req, res) => {
    if (req.headers.authorization.split(' ')[1] === 'undefined') { // neu khong co token gui len
        console.log('Đăng nhập không có authorization')
        console.log(req.headers)
        const username = req.body.username
        const password = req.body.password
        console.log(username, password)
        try {
            const parent = await Parent.findOne({ username: username, password: password }) // tìm trong csdl xem có tk hợp lệ không
            if (parent) {
                const token = jwt.sign({ _id: parent._id }, 'mk') // mã hóa id của người dùng dưới dạng 1 chuỗi jwt
                return res.json({ status: 'ok', token: token, parent: parent })
            } else {
                console.log('parent not found')
                return res.json({ status: 'fail', msg: 'parent not found' })
            }
        } catch (err) {
            console.log('server error')
            console.log(err)
        }
    } else { // nếu có token gửi kèm lên, tức là người dùng đã đăng nhập trong phiên đó rồi
        const token = req.headers.authorization.split(' ')[1];
        if (token) {
            jwt.verify(token, 'mk', (err, result) => {
                if (err) return res.json({ status: 'fail', msg: 'invalid token' })
                else {
                    Parent.findById(result._id, (err, result) => {
                        if (err) return res.json({ status: 'fail', msg: 'server error' })
                        else if (result) {
                            return res.json({ status: 'ok', parent: result, msg: 'login ok', token: token })
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
            return res.json({ status: 'ok', msg: 'get student with this parent ok', student: student, parent: parent })
        } else {
            console.log('student of parent not found')
            return res.json({ status: 'fail', msg: 'student of parent not found' })
        }
    } catch (err) {
        console.log('server err')
        console.log(err)
        return res.json({ status: 'fail', msg: err.message })
    }
}


const getLogBooks = async (req, res) => {
    if(!req.body.date) {
        try {
            const student = await Student.findOne({ parent: req.parent._id })
            if (student) {
                const logBooks = await LogBook.find({ student: student._id }).populate('schedule').populate('student').sort({ date: 1 }).limit(10)
                if (logBooks) {
                    let schedules = []
                    for (const logBook of logBooks) {
                        console.log(logBook.schedule)
                        schedules.push(logBook.schedule)
                    }
                    return res.json({ status: 'ok', msg: 'get logbook ok', logBooks: logBooks, schedules: schedules })
                } else {
                    return res.json({ status: 'fail', msg: 'cannot find logbook with this student' })
                }
            } else {
                return res.json({ status: 'fail', msg: 'cannot find student with this parent' })
            }
        } catch (err) {
            console.log('Server error: ' + err)
            return res.json({ status: 'fail', msg: 'server err' })
        }
    } else {
        const date = new Date(req.body.date)
        const student = parent.student
        try {
            const logBook = await LogBook.findOne({student: student.id, date: date})
            if(logBook) {
                return res.json({ status: 'ok', msg: 'get logbook ok', logBook: logBook })
            } else {
                return res.json({ status: 'fail', msg: 'cannot find logbook with this student and date' })
            }
        } catch(err) {
            console.log(err)
            return res.json({ status: 'fail', msg: er.message })

        }
    }
}



const getTuition = async (req, res) => {
    try {
        const student = await Student.findOne({ parent: req.parent._id })
        if (student) {
            const tuition = await Tuition.find({ student: student._id }).sort({ date: 1 }).limit(10)
            if (tuition) {
                return res.json({ status: 'ok', msg: 'get tuition ok', tuition: tuition })
            } else {
                return res.json({ status: 'fail', msg: 'cannot find tuition with this student' })
            }
        } else {
            return res.json({ status: 'fail', msg: 'cannot find student with this parent' })

        }
    } catch (err) {
        console.log('Server error get tuition: ' + err)
        return res.json({ status: 'fail', msg: 'server error' })
    }
}

module.exports.login = login
module.exports.getStudent = getStudent
module.exports.getLogBooks = getLogBooks
module.exports.getTuition = getTuition