// const express = require('express')
// const router = express.Router()
// const jwt = require('jsonwebtoken')
// const cookieParser = require('cookie-parser')
// const User = require('../models/user')

// // ---------------------------- get method -----------------------------

// // login
// router.get('/login', (req, res) => {
//     res.render('./login.ejs')
// })


// // ----------------------------- post method -------------------------------

// // khi điền username và password xong và baamsa vào nút login thì sẽ gọi đến method này
// router.post('/login', async (req, res) => {
//     const username = req.body.username
//     const password = req.body.password

//     try {
//         const user = await User.findOne({ username: username, password: password }) // tìm trong csdl xem có tk hợp lệ không
//         if (user) {
//             const token = jwt.sign({ _id: user._id }, 'mk') // mã hóa id của người dùng dưới dạng 1 chuỗi jwt
//             res.cookie('userToken', token) // gửi id đã mã hóa về cho client dưới dạng cookie
//             // res.send('login ok, cookie set')
//             res.redirect(`${user.role}/dashboard`)
//         } else {
//             console.log('user not found')
//             return res.redirect('/user/login') // nếu thất bại (ko tìm thấy tk hợp lệ), load lại trang login
//         }
//     } catch (err) {
//         console.log('server error')
//         console.log(err)
//     }
// })

// module.exports = router