const mongoose = require('mongoose')
// const User = require('./models/user')
const Parent = require('./models/parent')
const Student = require('./models/student')
const Class = require('./models/class')
const Teacher = require('./models/teacher')


mongoose.connect('mongodb://localhost/seedschool')
const connection = mongoose.connection
connection.on('error', error => console.error(error))
connection.once('open', () => console.log('Connected to MongoDB!')) // khi kết nối lần đầu, hiện ra thông báo connected to môngdb

// const user = new User({
//     username: 'trongnd',
//     password: '20194389',
//     role: 'parent'
// })

const parent = new Parent({
    username: 'trongnd',
    password: '20194389',
    role: 'parent',
    name: "nguyễn đức trọng",
    birth: new Date(2001, 5, 22),
    sex: "Nam",
    phoneNumber: "0988168182",
    address: "Hà Nội",
})

const student = new Student({
    name: "trần xuân tùng",
    birth: new Date(2001, 7, 20),
    sex: "Nam",
    teacher: "61ca8bdb29660c8b3849f1b4",
    parent: "61ca8c7b7bb9b6cd6969ad09",
})

const classs = new Class({
    name: "1A",
})

const teacher = new Teacher({
    username: 'anhdt',
    password: '20194219',
    role: 'teacher',
    name: "dinh tuan anh",
    birth: new Date(2001, 8, 25),
    sex: "Nam",
    phoneNumber: "0852252482",
    class: '61ca8bdb29660c8b3849f1b4'
})

save(student)


//findParent(student)


async function findParent(student) {
    const parent = await Parent.findById(student.parent)
    console.log(parent.name)
}

async function save(entity) {
    try {
        await entity.save()
    } catch (err) {
        console.log(err)
    }
}