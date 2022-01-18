const Teacher = require('../models/teacher')
const Student = require('../models/student')
const Parent = require('../models/parent')
const LogBook = require('../models/logBook')
const Tuition = require('../models/tuition')
const Schedule = require('../models/schedule')
const ParentMail = require('../models/parentMail')
const TeacherMail = require('../models/teacherMail')

const jwt = require('jsonwebtoken')


const login = async (req, res) => {
    if (req.body || req.headers.authorization.split(' ')[1] === 'undefined') {
        console.log('Dang nhap khong co authorization')
        const username = req.body.username
        const password = req.body.password
        try {
            const teacher = await Teacher.findOne({ username: username, password: password }) // tìm trong csdl xem có tk hợp lệ không
            if (teacher) {
                const token = jwt.sign({ _id: teacher._id }, 'mk') // mã hóa id của người dùng dưới dạng 1 chuỗi jwt
                return res.json({ status: 'ok', token: token, teacher: teacher })
            } else {
                console.log('teacher not found')
                return res.json({ status: 'fail', msg: 'teacher not found' })
            }
        } catch (err) {
            console.log('server error')
            console.log(err)
        }
    } else {
        const token = req.headers.authorization.split(' ')[1];
        if (token) {
            jwt.verify(token, 'mk', (err, result) => {
                if (err) return res.json({ status: 'fail', msg: 'invalid token' })
                else {
                    Teacher.findById(result._id, (err, result) => {
                        if (err) return res.json({ status: 'fail', msg: 'server error' })
                        else if (result) {
                            return res.json({ status: 'ok', teacher: result, msg: 'login ok', token: token })
                        }
                    })
                }
            })
        }
    }
}



// get all students
const getStudents = async (req, res) => {
    try {
        const students = await Student.find({ teacher: req.teacher._id }).populate('parent').sort({ name: 1 })
        if (students.length) {
            return res.json({ status: 'ok', msg: 'get students ok', students: students })
        } else {
            return res.json({ status: 'fail', msg: 'cannot find students with this teacher' })
        }
    } catch (err) {
        console.log('Server err get students for teacher: ' + err)
        return res.json({ status: 'fail', msg: 'server error' })
    }
}



// get student with id param
const getStudent = async (req, res) => {
    try {

        const student = await Student.findById(req.params.id).populate('parent')
        if (student) {
            return res.json({ status: 'ok', msg: 'get student ok', student: student })
        } else {
            return res.json({ status: 'fail', msg: 'cannot find student with this id' })
        }
    } catch (err) {
        console.log('Server error get student with id: ' + err)
        return res.json({ status: 'fail', msg: 'server error' })
    }
}

const addStudent = async (req, res) => {
    console.log('API add student called')

    const { sInfo, pInfo } = req.body
    // console.log(sInfo)
    const { sName, sBirth, sSex } = sInfo
    // console.log(sName, sBirth, sSex)
    const { pUserName, pPassword, pName, pBirth, pSex, pPhoneNumber, pAddress } = pInfo
    // console.log(pUserName, pPassword, pName, pBirth, pSex, pPhoneNumber, pAddress)

    let newParent = new Parent({
        username: pUserName,
        password: pPassword,
        role: 'parent',
        name: pName,
        birth: new Date(pBirth),
        sex: pSex,
        phoneNumber: pPhoneNumber,
        address: pAddress
    })

    // console.log(newParent)

    try {
        const parent = await newParent.save()
        // console.log(parent)
        if (parent) {
            // console.log(parent)
            let newStudent = new Student({
                name: sName,
                birth: new Date(sBirth),
                sex: sSex,
                teacher: req.teacher,
                parent: parent
            })
            newStudent.save((err, rs) => {
                if (err) {
                    return res.json({ status: 'fail', msg: 'cannot save new student' })
                } else {
                    req.teacher.numStudent += 1
                    return res.json({ status: 'ok', msg: 'save new student ok', student: newStudent })
                }
            })
        } else {
            console.log('save parent fail')
            console.log(parent)
        }
    } catch (err) {
        console.log(err)
        return res.json({ status: 'fail', msg: err.message })
    }
}



// edit student with id param
//ok
const editStudent = async (req, res) => {
    let student
    try {
        student = await Student.findById(req.params.id).populate('parent')
        if (student) {
            const { sInfo, pInfo } = req.body
            const { sName, sBirth, sSex } = sInfo
            const { pUserName, pPassword, pName, pBirth, pSex, pPhoneNumber, pAddress } = pInfo

            // update student
            student.name = sName
            student.birth = new Date(sBirth)
            student.sex = sSex

            // update parent
            student.parent.username = pUserName
            student.parent.password = pPassword
            student.parent.name = pName
            student.parent.birth = new Date(pBirth)
            student.parent.sex = pSex
            student.parent.phoneNumber = pPhoneNumber
            student.parent.address = pAddress

            student.parent.save((err, doc) => {
                if (err) {
                    console.log(err)
                    return res.json({ status: 'fail', msg: err.message })
                } else {
                    student.save((err, doc) => {
                        if (err) {
                            console.log(err)
                            return res.json({ status: 'fail', msg: err.message })
                        } else {
                            return res.json({ status: 'ok', msg: 'edit student ok', student: doc })
                        }
                    })
                }
            })
        } else {
            return res.json({ status: 'fail', msg: 'cannot find student with this id to edit' })
        }
    } catch (err) {
        if (student != null) { // nếu bị lỗi đoạn await student.save()
            return res.json({ status: 'fail', msg: err.message })
        } else {
            console.log('Server error edit student with id: ' + err)
            return res.json({ status: 'fail', msg: err.message })
        }
    }
}


// delete student with id
//ok
const deleteStudent = async (req, res) => {
    let student
    try {
        student = await Student.findById(req.params.id).populate('parent')
        if (student) {
            await LogBook.deleteMany({ student: student })
            await student.remove()
            await student.parent.remove()
            return res.json({ status: 'ok', msg: 'delete student and parent ok' })
        } else {
            return res.json({ status: 'fail', msg: 'cannot find student with this id to delete' })
        }
    } catch (err) {
        console.log(err)
        if (student != null) {
            return res.json({ status: 'fail', msg: 'cannot delete student with this id' })
        } else {
            console.log('Server error delete student with id: ' + err)
            return res.json({ status: 'fail', msg: 'Server error delete student with id' })
        }
    }
}


// get logbooks
// + neu co student + co ngay => tra ve mot logbook duy nhat
// + neu ko co ngay + ko co student => tra ve danh sach logbook cua ngay moi nhat
// + neu co ngay + ko student => tra ve danh sach logbook trong ngay do
// + neu ko co ngay + co student => tra ve danh sach logbook cho student do
const getLogBooks = async (req, res) => {
    const { date, student } = req.query
    console.log(date, student)

    if (date && student) { // nếu có ngày + student gửi lên
        try {
            const logBook = await LogBook.find({ date: new Date(date), teacher: req.teacher, student: student }).populate('student')
            if (logBook) {
                return res.json({ status: 'ok', msg: 'get logbook ok', logBooks: logBook })
            } else {
                return res.json({ status: 'fail', msg: 'cannot get logbook with this date and teacher id' })
            }
        } catch (err) {
            console.log(err)
            return res.json({ status: 'ok', msg: 'Server error get logbook by student' })
        }
    } else if (!date && !student) { // sử dụng cho lần load trang đầu tiên, hien thi logbook trong ngay moi nhat
        try {
            const logBooks = await LogBook.find({ teacher: req.teacher }).populate('student').sort({ date: -1 })
            if (logBooks.length) {
                const lastestDate = logBooks[0].date
                const latestLogBooks = logBooks.filter(logBook => logBook.date.getTime() === lastestDate.getTime())
                return res.json({ status: 'ok', msg: 'get logbook ok', logBooks: latestLogBooks })
            } else {
                return res.json({ status: 'fail', msg: 'cannot get logbook with latestdate' })
            }
        } catch (err) {
            console.log('server error get logbooks for teacher')
            return res.json({ status: 'fail', msg: 'server error get logbooks for teacher' })
        }
    } else if (date && !student) { // co ngay + ko student: hien thi logbook trong ngay do
        try {
            const logBooks = await LogBook.find({ date: new Date(date), teacher: req.teacher }).populate('student')
            if (logBooks) {
                return res.json({ status: 'ok', msg: 'get logbook with date and no student ok', logBooks: logBooks })
            } else {
                return res.json({ status: 'fail', msg: 'no logbook with this date' })
            }
        } catch (err) {
            console.log(err)
            return res.json({ status: 'ok', msg: err.message })
        }
    } else if (!date && student) {
        try {
            const logBooks = await LogBook.find({ teacher: req.teacher, student: student }).populate('student').sort({ date: -1 })
            if (logBooks.length) {
                return res.json({ status: 'ok', msg: 'get logbook fr this student ok', logBooks: logBooks })
            } else {
                return res.json({ status: 'fail', msg: 'logbook with this student not found' })
            }
        } catch (err) {
            console.log(err)
            return res.json({ status: 'fail', msg: err.message })
        }
    }
}

const getLogBook = async (req, res) => {
    try {
        const logBook = await LogBook.findById(req.params.id)
        if(logBook) {
            return res.json({status:'ok', msg:'get single logbook ok', logBook: logBook})
        } else {
            return res.json({status:'fail', msg:'cannot get logbook with this id'})
        }
    } catch(err) {
        console.log(err)
        return res.json({ status: 'fail', msg: err.message })
    }
}

const editLogBook = async (req, res) => {
    const { student, date } = req.query
    const { attendancePicture, schedule, comment, lookAfterLate, lateForSchool } = req.body
    let logBook
    try {
        logBook = await LogBook.findOne({ teacher: req.teacher, student: student._id, date: new Date(date) })
        if (logBook) {
            logBook.attendancePicture = attendancePicture
            logBook.schedule = schedule
            logBook.comment = comment
            logBook.lookAfterLate = lookAfterLate
            logBook.lateForSchool = lateForSchool

            await logBook.save()
            return res.json({ status: 'ok', msg: 'edit logbook with student and date ok', logBook: logBook })
        } else {
            return res.json({ status: 'fail', msg: 'cannot find logBook with this student and date' })
        }
    } catch (err) {
        if (logBook != null) {
            return res.json({ status: 'fail', msg: 'cannot save logbook' })
        } else {
            return res.json({ status: 'fail', msg: 'server error finding logbook with this student and date' })
        }
    }
}


// add a new logbook
const addLogBook = async (req, res) => {
    const { student, attendancePicture, comment, status, lookAfterLate } = req.body.logbook
    let lookAfterLate1, lookAfterLate2, lateForSchool1, lateForSchool2

    if (status == "Đi học") {
        lateForSchool1 = 0
        lateForSchool2 = 0
    } else if (status == "Nghỉ học") {
        lateForSchool1 = 1
        lateForSchool2 = 0
    } else if (status == "Nghỉ không phép") {
        lateForSchool1 = 0
        lateForSchool2 = 1
    }

    if (lookAfterLate == "Không") {
        lookAfterLate1 = 0
        lookAfterLate2 = 0
    } else if (lookAfterLate == "5h30-6h30") {
        lookAfterLate1 = 1
        lookAfterLate2 = 0
    } else if (lookAfterLate == "Sau 6h30") {
        lookAfterLate1 = 0
        lookAfterLate2 = 1
    }

    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth()
    const day = date.getDate()

    let logBook = new LogBook({
        student: student,
        teacher: req.teacher,
        attendancePicture: attendancePicture,
        comment: comment,
        date: new Date(Date.UTC(year, month, day)),
        lookAfterLate1: lookAfterLate1,
        lookAfterLate2: lookAfterLate2,
        lateForSchool1: lateForSchool1,
        lateForSchool2: lateForSchool2,
    })

    try {
        const newLogBook = await logBook.save()
        return res.json({ status: 'ok', msg: 'add logbook ok', logBook: newLogBook })
    } catch (err) {
        console.log('server error add logbook: ' + err)
        return res.json({ status: 'fail', msg: err.message })
    }
}




// ----------------------------------- Thoi khoa bieu -----------------------------------------------
// xem thoi khoa bieu của một ngày
// + trả về một danh sách các hoạt động có trong ngày đó
const getSchedule = async (req, res) => {
    const date = req.query.date
    if (date) {
        try {
            const schedules = await Schedule.find({ teacher: req.teacher, date: new Date(date) })
            if (schedules) {
                return res.json({ status: 'ok', msg: 'get schedule with date ok', schedules: schedules })
            } else {
                return res.json({ status: 'fail', msg: 'cannot find any schedule with this teacher and date' })
            }
        } catch (err) {
            console.log(err)
            return res.json({ status: 'fail', msg: err.message })
        }
    } else {
        try {
            const latestSchedule = await Schedule.find({ teacher: req.teacher }).sort({ date: -1 }).limit(1)
            return res.json({ status: 'ok', msg: 'get latest activity ok', schedules: latestSchedule })
        } catch (err) {
            console.log(err)
            return res.json({ status: 'fail', msg: err.message })
        }
    }
}


// thêm hoạt động thời khóa biểu
const addActivitySchedule = async (req, res) => {
    const { scheduleId, newActivity } = req.body
    try {
        const schedule = await Schedule.findById(scheduleId)
        if (schedule) {
            for (const activity of schedule) {
                if ((activity.start < new Date(newActivity.start) && new Date(newActivity.start) < activity.end) || (activity.start < new Date(newActivity.end) && new Date(newActivity.end) < activity.end)) {
                    return res.json({ status: 'fail', msg: 'time overlap with another activity' })
                }
            }
            schedule.activityList.push(newActivity)
            schedule.save((err, rs) => {
                if (err) {
                    console.log(err)
                    return res.json({ status: 'fail', msg: 'cannot add activity to schedule' })
                } else {
                    return res.json({ status: 'ok', msg: 'add activity to schedule ok', schedule: schedule })
                }
            })
        } else {
            console.log(schedule)
            return res.json({ status: 'fail', msg: 'cannot find schedule to add activity' })
        }
    } catch (err) {
        console.log(err)
        return res.json({ status: 'fail', msg: err.message })
    }
}

// sua hoat dong thoi khoa bieu
const editActivitySchedule = async (req, res) => {
    const scheduleId = req.params.id
    const { editedSchedule, index } = req.body
    try {
        let schedule = await Schedule.findById(scheduleId)
        if (schedule) {
            schedule.activityList[index] = editedSchedule
            schedule.save((err, doc) => {
                if (err) {
                    console.log(err)
                    return res.json({ status: 'ok', msg: err.message })
                } else {
                    return res.json({ status: 'ok', msg: 'edit activity schedule ok', schedule: doc })
                }
            })
        } else {
            console.log(schedule)
            return res.json({ status: 'fail', msg: 'cannot find schedule to edit activity' })
        }
    } catch (err) {
        console.log(err)
        return res.json({ status: 'fail', msg: err.message })
    }
}

// xoa hoat dong tkb
const deleteActivitySchedule = async (req, res) => {
    const scheduleId = req.params.id
    const index = req.body.index
    try {
        let schedule = await Schedule.findById(scheduleId)
        if (schedule) {
            schedule.activityList.splice(index, 1)
            schedule.save((err, doc) => {
                if (err) {
                    console.log(err)
                    return res.json({ status: 'ok', msg: err.message })
                } else {
                    return res.json({ status: 'ok', msg: 'delete activity schedule ok', schedule: doc })
                }
            })
        } else {
            console.log(schedule)
            return res.json({ status: 'fail', msg: 'cannot find schedule to edit activity' })
        }
    } catch (err) {
        console.log(err)
        return res.json({ status: 'fail', msg: err.message })
    }
}


// ------------------------------- hoc phí -----------------------------------
const getTuitions = async (req, res) => {
    const time = req.query.time

    if (!time) { // nếu ko có thang gửi lên, hiển thị dữ liệu học phí của tháng gần nhất trong csdl
        try {
            const tuitions = await Tuition.find({ teacher: req.teacher }).sort({ date: -1 }).limit(req.teacher.numStudent)
            if (tuitions.length) {
                return res.json({ status: 'ok', msg: 'get tuition for latest month ok', tuitions: tuitions })
            } else {
                return res.json({ status: 'fail', msg: 'cannot find tuition with this teacher' })
            }
        } catch (err) {
            console.log(err)
            return res.json({ status: 'fail', msg: err.message })
        }
    } else { // neu co thang gui len, hien thi hoc phi cua thang do
        const month = parseInt(time.split('-')[1])
        const year = parseInt(time.split('-')[0])
        const start = `${year}-${month}-01`
        const end = `${year}-${month + 1}-01`

        try {
            const tuitions = await Tuition.find({
                teacher: req.teacher,
                date: { $gte: new Date(start), $lt: new Date(end) }
            })
            if (tuitions) {
                return res.json({ status: 'ok', msg: 'get tuitions with date ok', tuitions: tuitions })
            } else {
                return res.json({ status: 'fail', msg: 'no tuitions in database' })
            }
        } catch (err) {
            console.log('server error getting tuition: ' + err)
            return res.json({ status: 'fail', msg: err.message })
        }
    }

}


// ------------------------------------------- hom thu ----------------------------------------
// xem tat ca mail
const getAllMail = async (req, res) => {
    try {
        const mails = await TeacherMail.find({ teacher: req.teacher })
        if (mails.length) {
            return res.json({ status: 'ok', msg: 'get mailbox for teacher ok', mails: mails })
        } else {
            console.log(mails)
            return res.json({ status: 'fail', msg: 'mailbox for this teacher not found' })
        }
    } catch (err) {
        console.log(err)
        return res.json({ status: 'fail', msg: err.message })
    }
}

// xem chi tiet mail dua vao id client truyen len
const getDetailMail = async (req, res) => {
    try {
        const mail = await TeacherMail.findById(req.params.id)
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

// gui thong bao hoc phi
const sendTuitionNoti = async (req, res) => {
    try {
        const tuitions = await Tuition.find({ teacher: req.teacher }).populate('student').sort({ date: -1 }).limit(req.teacher.numStudent)
        if (tuitions.length) {
            for (const tuition of tuitions) {
                let content = `
                Nhà trường xin thông báo chi tiết về học phí tháng ${tuition.date.getMonth()} của cháu ${tuition.student.name}
                
                Học phí cơ bản: ${tuition.baseTuition} triệu / tháng
                Số buổi nghỉ có phép: ${tuition.validAbsence}
                Số buổi nghỉ không phép: ${tuition.invalidAbsence}
                Số buổi trông muộn trước 5 rưỡi chiều: ${tuition.late1}
                Số buổi trông muộn sau 5 rưỡi chiều: ${tuition.late2}

                Tổng cộng học phí tháng: ${tuition.totalTuition}

                Kính mong quý phụ huynh đóng học phí đầy đủ và đúng hạn. Nhà trường xin cảm ơn!
                `
                let mail = new ParentMail({
                    parent: tuition.student.parent,
                    title: 'Thông báo học phí',
                    content: content,
                    category: "học phí"
                })
                await mail.save()
            }
        } else {
            return res.json({ status: 'fail', msg: 'cannot find tuitions with this teacher' })
        }
    } catch (err) {
        console.log(err)
        return res.json({ status: 'fail', msg: err.message })
    }
}


const updateTuitionPaid = async (req, res) => {
    for (const id of req.body.tuitionId) {
        try {
            let tuition = await Tuition.findOneAndUpdate({ _id: id }, { paid: "Đã nộp" }, { new: true })
        } catch (err) {
            console.log(err)
            return res.json({ status: 'fail', msg: 'cannot update tuition paid' })
        }
    }
    return res.json({ status: 'ok', msg: 'update tuition paid ok' })
}


// ---------------------------------------- ultility functions ----------------------------------------
async function updateTuition(teacher, date) {
    let allStudentTuitions

    const month = date.getMonth()
    const year = date.getFullYear()
    const start = new Date(Date.UTC(year, month, 1))
    const end = new Date(Date.UTC(year, month + 1, 1))

    try {
        allStudentTuitions = await LogBook.aggregate([
            {
                $match: {
                    "teacher": mongoose.Types.ObjectId(teacher),
                    "date": { $gte: start, $lt: end }
                }
            },
            {
                $group: {
                    _id: '$student',
                    total_lookafter_late_1: {
                        $sum: "$lookAfterLate1"
                    },
                    total_lookafter_late_2: {
                        $sum: "$lookAfterLate2"
                    },
                    total_valid_absence: {
                        $sum: "$lateForSchool1"
                    },
                    total_invalid_absence: {
                        $sum: "$lateForSchool2"
                    }
                }
            }

        ])
        console.log(allStudentTuitions)

        // sử dụng thằng ở trên để uppdate vào tuition database
        for (const tuition of allStudentTuitions) {
            saveTuition(tuition, teacher, date)
        }


        return allStudentTuitions
    } catch (err) {
        console.log(err)
    }


}

async function saveTuition(tuition, teacher, date) {
    let newTuition = new Tuition({
        teacher: teacher,
        student: tuition._id,
        date: date,
        validAbsence: tuition.total_valid_absence,
        invalidAbsence: tuition.total_invalid_absence,
        late1: tuition.total_lookafter_late_1,
        late2: tuition.total_lookafter_late_2,
    })

    try {
        newTuition.save()
        console.log('save tuition ok')
    } catch (err) {
        console.log('cannot save new tuition')
    }
}

//function convertDateToUTC(date) { return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()); }

module.exports.login = login
module.exports.getStudents = getStudents
module.exports.getStudent = getStudent
module.exports.addStudent = addStudent
module.exports.editStudent = editStudent
module.exports.deleteStudent = deleteStudent
module.exports.getLogBooks = getLogBooks
module.exports.addLogBook = addLogBook
module.exports.editLogBook = editLogBook
module.exports.getSchedule = getSchedule
module.exports.addActivitySchedule = addActivitySchedule
module.exports.editActivitySchedule = editActivitySchedule
module.exports.deleteActivitySchedule = deleteActivitySchedule
module.exports.getTuitions = getTuitions
module.exports.sendTuitionNoti = sendTuitionNoti
module.exports.getAllMail = getAllMail
module.exports.getDetailMail = getDetailMail
module.exports.updateTuitionPaid = updateTuitionPaid
module.exports.getLogBook = getLogBook