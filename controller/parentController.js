const Parent = require('../models/parent')
const Student = require('../models/student')
const LogBook = require('../models/logBook')
const Tuition = require('../models/tuition')
const Teacher = require('../models/teacher')
const Schedule = require('../models/schedule')
const ParentMail = require('../models/parentMail')
const TeacherMail = require('../models/teacherMail')
const FoodMenu = require('../models/FoodMenu')
const Activity = require('../models/activity')

const jwt = require('jsonwebtoken')

const login = async (req, res) => {
    console.log('call to login parent')
    if (req.body || req.headers.authorization.split(' ')[1] === 'undefined') { // neu khong co token gui len
        console.log('Đăng nhập không có authorization')
        // console.log(req.headers)
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
            console.log(err)
            return res.json({status:'fail', msg:'server error'})
        }
    } else { // nếu có token gửi kèm lên, tức là người dùng đã đăng nhập trong phiên đó rồi
        console.log('dang nhap co kem token')
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
        } else {
            console.log(token)
        }
    }
}


const getDetailStudent = async (req, res, next) => {
    console.log('call to get detail student parent')
    const parent = req.parent
    try {
        const student = await Student.findOne({ parent: parent._id }).populate('teacher')
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

// ---------------------------------------------- so theo doi ---------------------------------------------
const getLogBook = async (req, res) => {
    console.log('call to get log book parent')
    if (!req.query.date) {
        try {
            const student = await Student.findOne({ parent: req.parent._id })
            if (student) {
                const logBooks = await LogBook.find({ student: student._id }).populate('student').sort({ date: 1 }).limit(10)
                if (logBooks) {
                    // let schedules = []
                    // for (const logBook of logBooks) {
                    //     console.log(logBook.schedule)
                    //     schedules.push(logBook.schedule)
                    // }
                    return res.json({ status: 'ok', msg: 'get logbook ok', logBooks: logBooks })
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
        const date = new Date(req.query.date)
        console.log(date)
        try {
            const student = await Student.findOne({ parent: req.parent })
            if (student) {
                const logBook = await LogBook.findOne({ student: student.id, date: date }).populate('student')
                if (logBook) {
                    return res.json({ status: 'ok', msg: 'get logbook ok', logBook: logBook })
                } else {
                    return res.json({ status: 'fail', msg: 'cannot find logbook with this student and date' })
                }
            } else {
                return res.json()
            }
        } catch (err) {
            console.log(err)
            return res.json({ status: 'fail', msg: err.message })
        }
    }
}


// --------------------------------------- thoi khoa bieu -------------------------------------------
const getSchedule = async (req, res) => {
    console.log('call to get schedule parent')
    const date = req.query.date // yyyy-mm-dd
    if (!date) {
        try {
            const student = await Student.findOne({ parent: req.parent })
            const schedule = await Schedule.find({ student: student }).sort({ date: -1 }).limit(1)
            if (schedule.length) {
                return res.json({ status: 'ok', msg: 'get lastest schedule ok', schedule: schedule[0] })
            } else {
                return res.json({ status: 'fail', msg: 'cannot find schedule', schedule: schedule })
            }
        } catch (err) {
            console.log(err)
            return res.json({ status: 'ok', msg: err.message })
        }
    } else {
        try {
            const student = await Student.findOne({ parent: req.parent })
            const schedule = await Schedule.find({ student: student, date: new Date(date) })
            if (schedule) {
                return res.json({ status: 'ok', msg: 'get schedule with date ok', schedule: schedule })
            } else {
                return res.json({ status: 'fail', msg: 'cannot find schedule', schedule: schedule })
            }
        } catch (err) {
            console.log(err)
            return res.json({ status: 'ok', msg: err.message })
        }
    }
}

// ------------------------------------- hoc phi ---------------------------------------------

const getTuition = async (req, res) => {
    console.log('call to get tuition parent')
    const time = req.query.time // yyyy-mm
    if (!time) { // neu ko co thang gui len, tra lai hoc phi 10 thang gan nhat
        try {
            const student = await Student.findOne({ parent: req.parent._id })
            if (student) {
                const tuitions = await Tuition.find({ student: student._id }).populate('student').sort({ date: 1 }).limit(10)
                if (tuitions) {
                    return res.json({ status: 'ok', msg: 'get tuition ok', tuitions: tuitions })
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
    } else { // neu co thang gui len, tra lai hoc phi cua thang do
        const year = parseInt(time.split('-')[0])
        const month = parseInt(time.split('-')[1])
        // const date = new Date(Date.UTC(year, month - 1, 31))
        const date = new Date(`${time}-31`)

        try {
            const student = await Student.findOne({ parent: req.parent._id })
            if (student) {
                const tuitions = await Tuition.find({ student: student, date: date }).populate('student')
                if (tuitions.length) {
                    return res.json({ status: 'ok', msg: 'get tuition with month ok', tuitions: tuitions })
                } else {
                    console.log(tuitions)
                    return res.json({ status: 'fail', msg: 'cannot find tuition with month' })
                }
            } else {
                console.log(student)
                return res.json({ status: 'fail', msg: 'cannot find student to find tuition' })
            }
        } catch (err) {
            console.log(err)
            return res.json({ status: 'fail', msg: err.message })
        }
    }
}


// ------------------------------------- hom thu -----------------------------------------
// xem tat ca mail
const getAllMail = async (req, res) => {
    console.log('call to get all mail parent')
    try {
        const mails = await ParentMail.find({ parent: req.parent })
        if (mails.length) {
            return res.json({ status: 'ok', msg: 'get mailbox for parent ok', mails: mails })
        } else {
            console.log(mails)
            return res.json({ status: 'fail', msg: 'mailbox for this parent not found' })
        }
    } catch (err) {
        console.log(err)
        return res.json({ status: 'fail', msg: err.message })
    }
}

// lay mail dua vao id client truyen len
const getDetailMail = async (req, res) => {
    console.log('call to get detail mail parent')
    try {
        const mail = await ParentMail.findById(req.params.id)
        if (mail) {
            return res.json({ status: 'ok', msg: 'get mail detail ok', mail: mail })
        } else {
            console.log(mail)
            return res.json({ status: 'fail', msg: 'mail with this id not found' })
        }
    } catch (err) {
        console.log(err)
        return res.json({ status: 'fail', msg: err.message })
    }
}

// gui mail cho giao vien
const postMail = async (req, res) => {
    console.log('call to post mail parent')
    const { title, content } = req.body
    try {
        const teacher = await Teacher.findById(req.parent.student.teacher)
        if (teacher) {
            let mail = new TeacherMail({
                teacher: teacher,
                date: getCurrentDateWithUTC(Date.now()),
                parent: req.parent,
                title: title,
                content: content
            })
            mail.save((err, doc) => {
                if (err) {
                    console.log(err)
                    return res.json({ status: 'fail', msg: 'cannot post mail to teacher' })
                } else {
                    return res.json({ status: 'ok', msg: 'post mail to teacher ok', mail: doc })
                }
            })
        } else {
            console.log(teacher)
            return res.json({ status: 'fail', msg: 'cannot find teacher with this parent' })
        }
    } catch (err) {
        console.log(err)
        return res.json({ status: 'fail', msg: err.message })
    }
}

// dang ky tham gia hoat dong
const registerCommonActivity = async (req, res) => {
    console.log('call to register activity parent')
    // cap nhat parentMail
    try {
        let mail = await ParentMail.findById(req.params.id).populate('commonActivity')
        if (mail) {
            if (mail.registered == false) {
                mail.registered = true // sua thanh da dang ki
                mail.commonActivity.registerList.push(req.parent) // them phu huynh vao danh sach da dang ki
                mail.commonActivity.save((err, doc) => {
                    if (err) {
                        console.log(err)
                        return res.json({ status: 'fail', msg: 'error saving common activity' })
                    } else {
                        mail.save((err, doc) => {
                            if (err) {
                                console.log(err)
                                return res.json({ status: 'fail', msg: 'error registering hoat dong' })
                            } else {
                                return res.json({ status: 'ok', msg: 'dang ki hoat dong ok', mail: doc })
                            }
                        })
                    }
                })
            } else {
                return res.json({status:'fail', msg:'ban da dang ki hoat dong nay'})
            }
        } else {
            return res.json({ status: 'fail', msg: 'cannot find mail with this id' })
        }
    } catch (err) {
        console.log(err)
        return res.json({ status: 'fail', msg: err.message })
    }
}

// dang ky tham gia hoat dong
const unregisterCommonActivity = async (req, res) => {
    console.log('call to register activity parent')
    // cap nhat parentMail
    try {
        let mail = await ParentMail.findById(req.params.id).populate('commonActivity')
        if (mail) {
            if (mail.registered == true) {
                mail.registered = false // sua thanh da dang ki

                // remove
                const index = mail.commonActivity.indexOf(req.parent._id)
                if (index>-1) {
                    mail.commonActivity.splice(index, 1)
                }
                mail.commonActivity.save((err, doc) => {
                    if (err) {
                        console.log(err)
                        return res.json({ status: 'fail', msg: 'error saving common activity' })
                    } else {
                        mail.save((err, doc) => {
                            if (err) {
                                console.log(err)
                                return res.json({ status: 'fail', msg: 'error unregistering hoat dong' })
                            } else {
                                return res.json({ status: 'ok', msg: 'huy dang ki hoat dong ok', mail: doc })
                            }
                        })
                    }
                })
            } else {
                return res.json({status:'fail', msg:'ban da dang ki hoat dong nay'})
            }
        } else {
            return res.json({ status: 'fail', msg: 'cannot find mail with this id' })
        }
    } catch (err) {
        console.log(err)
        return res.json({ status: 'fail', msg: err.message })
    }

}

const getMenu = async (req, res) => {
    console.log('call to get menu parent ')
    if(req.params.id){
        const id = req.params.id;

        FoodMenu.findById(id)
            .then(data =>{
                if(!data){
                    res.status(404).send({ success: false, message : "Not found  with id "+ id})
                }else{
                    res.json(data)
                }
            })
            .catch(err =>{
                res.status(500).json({success: false, message: "Erro retrieving Food Menu with id " + id})
            })

    }else{
        FoodMenu.find()
            .then(data => {
                res.json(data)
            })
            .catch(err => {
                res.status(500).send({success: false, message : err.message || "Error Occurred while retriving Food Menu information" })
            })
    }
}


function getCurrentDateWithUTC(t) {
    const day = t.getDate()
    const month = t.getMonth()
    const year = t.getFullYear()
    return new Date(Date.UTC(year, month, day))
}

module.exports.login = login
module.exports.getDetailStudent = getDetailStudent
module.exports.getLogBook = getLogBook
module.exports.getTuition = getTuition
module.exports.getAllMail = getAllMail
module.exports.getDetailMail = getDetailMail
module.exports.getSchedule = getSchedule
module.exports.postMail = postMail
module.exports.registerCommonActivity = registerCommonActivity
module.exports.getMenu = getMenu
module.exports.unregisterCommonActivity = unregisterCommonActivity