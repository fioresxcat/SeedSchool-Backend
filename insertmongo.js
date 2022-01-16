const mongoose = require('mongoose')
const moment = require('moment')
const Parent = require('./models/parent')
const Student = require('./models/student')
const Teacher = require('./models/teacher')
const LogBook = require('./models/logBook')
const ActivitySchedule = require('./models/activitySchedule')
const Tuition = require('./models/tuition')
const Test = require('./models/test')
const Schedule = require('./models/schedule')

mongoose.connect('DATABASE_URL=mongodb+srv://fiores:nncnpm@cluster0.u51hn.mongodb.net/seedschool?retryWrites=true&w=majority')
const connection = mongoose.connection
connection.on('error', error => console.error(error))
connection.once('open', () => console.log('Connected to MongoDB!')) // khi kết nối lần đầu, hiện ra thông báo connected to môngdb

// const user = new User({
//     username: 'trongnd',
//     password: '20194389',
//     role: 'parent'
// })

const parent = new Parent({
    username: 'phunl',
    password: '20194111',
    role: 'parent',
    name: "nguyen long phu",
    birth: new Date(Date.UTC(2001, 3, 5)),
    sex: "Nam",
    phoneNumber: "987654321",
    address: "Hà Nội",
})
// save(parent)

const student = new Student({
    name: "ta duc trung",
    birth: new Date(Date.UTC(2005, 6, 10)),
    sex: "Nam",
    teacher: "61ca8c2b5877b1ca3bbad3d1",
    parent: "61e3c7a090ec436b507e3810",
})
// save(student)


const teacher = new Teacher({
    username: 'longnd',
    password: '20194100',
    role: 'teacher',
    name: "Nguyen Duc Long",
    birth: new Date(Date.UTC(2001, 8, 5)),
    sex: "Nam",
    phoneNumber: "0852252482",
    class: '1B'
})
// save(teacher)

const activitySchedule = new ActivitySchedule({
    teacher: '61ca8c2b5877b1ca3bbad3d1',
    date: new Date(Date.UTC(2022, 0, 10)),
    startTime: new Date(Date.UTC(2022, 0, 14, 20, 0, 0)),
    endTime: new Date(Date.UTC(2022, 0, 14, 21, 0, 0)),
    name: 'di ngu trung',
    content: 'di ngu nao trung'
})
// save(activitySchedule)

const schedule = new Schedule({
    teacher: '61e38b1be874b5dbe5aae671',
    date: new Date(Date.UTC(2022, 0, 13)),
    activityList: [
        {
            start: new Date(Date.UTC(2022, 0,13,14,00,00)),
            end: new Date(Date.UTC(2022, 0,13,15,00,00)),
            content:'tap the duc thay long'
        },
        {
            start: new Date(Date.UTC(2022, 0,13,16,00,00)),
            end: new Date(Date.UTC(2022, 0,13,17,00,00)),
            content:'tap the duc tiep thay long'
        }
    ]
})
// save(schedule)

const logBook = new LogBook({
    student: '61e3c7ca3c4eb8d6d7dd41d0', //ttrung
    teacher: '61ca8c2b5877b1ca3bbad3d1', //anhdt
    date: new Date(Date.UTC(2022, 0, 18)),
    attendancePicture: 'anh diem danh',
    schedule: '61e3d032c60a154258d19b00',
    comment: 'chau trung ngoan lam',
    lookAfterLate1: 0,
    lookAfterLate2: 1,
    lateForSchool1: 1,
    lateForSchool2: 0
})
// save(logBook)

async function findParent(student) {
    const parent = await Parent.findById(student.parent)
    console.log(parent.name)
}

async function save(entity) {
    try {
        await entity.save()
        console.log("save ok")

    } catch (err) {
        console.log(err)
    }
}

// LogBook.findById('61e3d50e5b7ebc88af65f850').populate('newSchedule').exec(function(err, doc) {
//     if(err) {
//         console.log(err)
//     } else {
//         console.log(doc.newSchedule.activityList)
//     }
// })


updateTuition('61ca8c2b5877b1ca3bbad3d1', new Date(Date.UTC(2022, 0, 31)))
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