// xem đang ở trong production env hay development env
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

// import các thứ
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const parentRouter = require('./new_routes/parent')
const teacherRouter = require('./new_routes/teacher')

const app = express()

// mongodb connection
mongoose.connect(process.env.DATABASE_URL)
const connection = mongoose.connection
connection.on('error', error => console.error(error))
connection.once('open', () => console.log('Connected to MongoDB!')) // khi kết nối lần đầu, hiện ra thông báo connected to môngdb

// cors setup
const corsOpts = {
    origin: '*',
    methods: [
        'GET',
        'POST',
        'PUT',
        'DELETE'
    ],

    allowedHeaders: [
        'Content-Type',
        'Authorization'
    ],
};

// set, use các thứ
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors(corsOpts))
app.use(methodOverride('_method'))
app.use(cookieParser())

// routes
app.use(parentRouter, function(req,res,next){
    next()
})
app.use(teacherRouter, function(req,res,next){
    next()
})
app.use('/', require('./sever/routes/router'))

// app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')

app.listen(3000)

