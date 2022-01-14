// const jwt = require('jsonwebtoken')
// const User = require('../models/user')

// function checkRole(role) {
//     return async (req, res, next) => {
//         const token = req.cookies.userToken // lấy token từ cookie
//         if (!token) return res.redirect('/user/login') // nếu ko có token, trả lại trang login
        
//         const _id = jwt.verify(token, 'mk') // decrypt lại id người dùng từ cookie
//         try {
//             const user = await User.findById(_id) // lấy user từ id tương ứng
//             if (user) {
//                 if (user.role === role) {
//                     req.user = user // gán user vào request
//                     next()
//                 } else {
//                     console.log('ban can phai dang nhap voi tu cach phu huynh')
//                     return res.redirect('/user/login')
//                 }
//             } else {
//                 console.log('Cant find user with this id !!!')
//                 return res.redirect('/user/login')
//             }
//         } catch(err) {
//             console.log(err)
//             return res.redirect('/user/login')
//         }
//     }
// }

// module.exports = checkRole