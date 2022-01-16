const Teacher = require('../models/teacher')
const Student = require('../models/student')
const LogBook = require('../models/logBook')
const Tuition = require('../models/tuition')
const ActivitySchedule = require('../models/activitySchedule')
const jwt = require('jsonwebtoken')


const login = async (req, res) => {
    if (req.headers.authorization.split(' ')[1] === 'undefined') {
        console.log('Dang nhap khong co authorization')
        const username = req.body.username
        const password = req.body.password
        try {
            const teacher = await Teacher.findOne({ username: username, password: password }) // tìm trong csdl xem có tk hợp lệ không
            if (teacher) {
                const token = jwt.sign({ _id: teacher._id }, 'mk') // mã hóa id của người dùng dưới dạng 1 chuỗi jwt
                return res.json({ status: 'success', token: token, teacher: teacher })
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
                            return res.json({ status: 'success', teacher: result, msg: 'login successfully', token: token })
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
        const students = await Student.find({ teacher: req.teacher._id }).sort({ name: 1 })
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
        const student = await Student.findById(req.params.id)
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

// edit student with id param
const editStudent = async (req, res) => {
    let student
    try {
        student = await Student.findById(req.params.id)
        if (student) {
            const { name, birth, sex } = req.body

            student.name = name
            student.birth = new Date(birth)
            student.sex = sex

            await student.save()
            return res.json({ status: 'ok', msg: 'edit student ok', student: student })
        } else {
            return res.json({ status: 'fail', msg: 'cannot find student with this id to edit' })
        }
    } catch (err) {
        if (student != null) { // nếu bị lỗi đoạn await student.save()
            return res.json({ status: 'fail', msg: 'cannot edit student with this is' })
        } else {
            console.log('Server error edit student with id: ' + err)
            return res.json({ status: 'fail', msg: 'Server error edit student with id' })
        }
    }
}


// delete student with id
const deleteStudent = async (req, res) => {
    let student
    try {
        student = await Student.findById(req.params.id)
        if (student) {
            await student.remove()
            return res.json({ status: 'ok', msg: 'delete student ok' })
        } else {
            return res.json({ status: 'fail', msg: 'cannot find student with this id to delete' })
        }
    } catch (err) {
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
    const date = new Date(req.query.date) // co the sua thanh req.query
    const student = req.query.student
    if (date) { // nếu có ngày gửi lên
        try {
            const logBooks = await LogBook.find({ date: date, teacher: req.teacher._id, student: student._id })
            if (logBooks || logBooks.length) {
                return res.json({ status: 'ok', msg: 'get logbook ok', logBooks: logBooks })
            } else {
                return res.json({ status: 'fail', msg: 'cannot get logbook with this date and teacher id' })
            }
        } catch (err) {
            console.log('Server error get logbook by student')
            return res.json({ status: 'ok', msg: 'Server error get logbook by student' })
        }
    } else if (!date && !student) { // sử dụng cho lần load trang đầu tiên
        try {
            const logBooks = await LogBook.find({}).sort({ date: -1 })
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
    }
}


const editLogBook = async (req, res) => {
    const { student, date } = req.query
    const { attendancePicture, schedule, comment, lookAfterLate, lateForSchool } = req.body
    let logBook
    try {
        logBook = await LogBook.findOne({ student: student._id, date: new Date(date) })
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
    const { student, teacher, date, attendancePicture, schedule, comment, lookAfterLate, lateForSchool } = req.body
    let logBook = new LogBook({
        student: student,
        teacher: teacher,
        date: new Date(date),
        attendancePicture: attendancePicture,
        schedule: schedule,
        comment: comment,
        lookAfterLate: lookAfterLate,
        lateForSchool: lateForSchool
    })

    try {
        const newLogBook = await logBook.save()
        return res.json({ status: 'ok', msg: 'add logbook ok', logBook: newLogBook })
    } catch (err) {
        console.log('server error add logbook: ' + err)
        return res.json({ status: 'fail', msg: err.message })
    }
}


// xem thoi khoa bieu của một ngày
// + trả về một danh sách các hoạt động có trong ngày đó
const getSchedule = async (req, res) => {
    const date = new Date(req.query.date)
    if (date) {
        try {
            const activitySchedules = await ActivitySchedule.find({ teacher: req.teacher._id, date: date })
            if (activitySchedules) {
                return res.json({ status: 'ok', msg: 'get activity schedule ok', activitySchedules: activitySchedules })
            } else {
                return res.json({ status: 'fail', msg: 'cannot find any activity with this teacher and date' })
            }
        } catch (err) {
            console.log('server error getting activity schedule: ' + err.message)
            return res.json({ status: 'fail', msg: err.message })
        }
    } else {
        try {
            const allActivitySchedules = ActivitySchedule.find({}).sort({ date: -1 })
            const latestDate = allActivitySchedules[0].date
            const latestActivitySchedules = (await allActivitySchedules).filter(activity => activity.date.getTime() === latestDate.getTime())
            return res.json({ status: 'ok', msg: 'get latest activity ok', activitySchedules: latestActivitySchedules })
        } catch (err) {
            console.log('server error getting activity schedule: ' + err.message)
            return res.json({ status: 'ok', msg: err.message })
        }
    }
}


// thêm hoạt động thời khóa biểu
const addActivitySchedule = async (req, res) => {
    const teacher = req.teacher
    const { date, start, end, name, content } = req.body
    let activitySchedule = new ActivitySchedule({
        teacher: teacher,
        date: date,
        start: start,
        end: end,
        name: name,
        content: content
    })

    try {
        const newActivitySchedule = await activitySchedule.save()
        return res.json({ status: 'ok', msg: 'add activity schedule ok', activitySchedule: newActivitySchedule })
    } catch (err) {
        console.log('server error adding activity schedule: ' + err.message)
        return res.json({ status: 'fail', msg: err.message })
    }
}

// sua hoat dong thoi khoa bieu
const editActivitySchedule = async (req, res) => {
    const teacher = req.teacher
    const { id, date, start, end, name, content } = req.body // id được gửi lên bởi client
    let activitySchedule
    try {
        activitySchedule = await ActivitySchedule.findById(id)
        if (activitySchedule) {
            activitySchedule.start = new Date(start)
            activitySchedule.end = new Date(end)
            activitySchedule.name = name
            activitySchedule.content = content
            await activitySchedule.save()
            return res.json({ status: 'ok', msg: 'edit activity schedule ok', activitySchedule: activitySchedule })
        } else {
            return res.json({ status: 'fail', msg: 'cannot find activity to update' })
        }
    } catch (err) {
        if (activitySchedule != null) {
            console.log('error saving activity schedule: ' + err.message)
            return res.json({ status: 'fail', msg: err.message })
        } else {
            console.log('server error saving activity: ' + err)
            return res.json({ status: 'fail', msg: err.message })
        }
    }
}

// xoa hoat dong tkb
const deleteActivitySchedule = async (req, res) => {
    const id = req.body.id
    let activitySchedule
    try {
        activitySchedule = await ActivitySchedule.findById(id)
        if (activitySchedule) {
            await activitySchedule.remove()
            return res.json({ status: 'ok', msg: 'delete activity ok' })
        } else {
            return res.json({ status: 'fail', msg: 'cannot find activity to delete' })
        }
    } catch (err) {
        if (activitySchedule != null) {
            console.log('error deleting activity schedule: ' + err.message)
            return res.json({ status: 'fail', msg: err.message })
        } else {
            console.log('server error deleting activity: ' + err)
            return res.json({ status: 'fail', msg: err.message })
        }
    }
}


// ------------------------------- hoc phí -----------------------------------
const getTuitions = async (req, res) => {
    const date = new Date(req.query.date)

    if (!date) { // nếu ko có date gửi lên, tức là lần đầu bấm vào trang
        if (new Date(date.getTime() + 86400000).getDate() === 1) {
            // neu la ngay cuoi cung cua thang
            // cap nhat hoc phi cua thang nay
            const tuitions = updateTuition(req.teacher, date)
            return res.json({ status: 'ok', msg: 'update tuition ok', tuitions: tuitions })
        } else {
            return res.json({ status: 'fail', msg: 'date is not the end of month' })
        }
    } else {
        const month = date.getMonth() + 1
        const year = date.getFullYear()
        const start = `${year}-${month}-01`
        const end = `${year}-${month + 1}-01`
        try {
            const tuitions = await Tuition.find({
                teacher: req.teacher,
                date: { $gte: start, $lt: end }
            })
            if(tuitions) {
                return res.json({status:'ok', msg:'get tuitions with date ok', tuitions:tuitions})
            } else {
                return res.json({status:'fail', msg:'no tuitions in database'})
            }
        } catch(err) {
            console.log('server error getting tuition: ' + err)
            return res.json({status:'fail', msg:err.message})
        }
    }

}




// ---------------------------------------- ultility functions ----------------------------------------
async function updateTuition(teacher, date) {
    let allStudentTuitions

    const month = date.getMonth()
    const year = date.getFullYear()
    const start = new Date(Date.UTC(year, month, 1))
    const end = new Date(Date.UTC(year, month+1, 1))

    try {
        allStudentTuitions = await LogBook.aggregate([
            {
                $match: {
                    "teacher": mongoose.Types.ObjectId(teacher),
                    "date": {$gte: start, $lt: end} 
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