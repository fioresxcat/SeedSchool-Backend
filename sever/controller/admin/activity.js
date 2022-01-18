const Activity = require('../../../models/activity')
const Parent = require('../../../models/parent')
const ParentMail = require('../../../models/parentMail')

const mongoose = require('mongoose')

exports.create = async (req, res) => {
    // validate request
    if (!req.body) {
        return res.status(400).json({ success: false, message: "Content can not be emtpy!" })
    }

    const { title, description, place, date, timeStart, timeFinish } = req.body
    // new user
    try{const newActivity = new Activity({
        title,
        description,
        place,
        date,
        timeStart,
        timeFinish
    })

    await newActivity.save()
    .then(res.json({ success: true, message: 'Thêm thành công', activity : newActivity }))
    
    }catch{
            res.status(500).json({ success: false, message: 'Thất bại' })
        };

}

// retrieve and return all users/ retrive and return a single user
exports.find = async (req, res) => {

   try{ if(req.params.id){
        const id = req.params.id;

            await Activity.findById(id).populate('registerList')
                .then(data => {
                    if (!data) {
                        res.status(404).json({ message: "Not found activity with id " + id })
                    } else {
                        res.json(data)
                    }
                })
                .catch(err => {
                    res.status(500).json({ message: "Erro retrieving activity with id " + id })
                })

        } else {
            await Activity.find()
                .then(data => {
                    res.json(data)
                })
                .catch(err => {
                    res.status(500).json({ success: false, message: "Error Occurred while retriving activity information" })
                })
        }
    } catch {
        res.status(500).json({ success: false, message: 'Thất bại' })
    }
}

exports.findDate = async (req, res) => {
    if (!req.body) {
        return res.json({ success: false, message: 'Bạn hãy nhập ngày' })
    }
    const date = new Date(req.body.date)
    await Activity.find({ date })
        .then((data) => {
            if(data){
                return res.json({activity: data })
            }else{
                return res.json({success:false, message:"Không có hoạt động trong ngày này"})
            }
        })
        .catch(err=>{
            res.status(500).json({success:false, message : "Lỗi tìm kiếm"})
        })
}

// Update a new idetified user by user id
exports.update = (req, res) => {
    if (!req.body) {
        return res
            .status(400)
            .json({ success: false, message: "Data to update can not be empty" })
    }

    const id = req.params.id;
    Activity.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if(!data){
                res.status(404).json({ success:false,message : `Cannot Update activity with ${id}. Maybe user not found!`})
            }else{
                res.json({success:true, message:'Sửa thành công'})
            }
        })
        .catch(err =>{
            res.status(500).json({success:false, message : "Error Update activity information"})
        })
}

// Delete a user with specified user id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Activity.findByIdAndDelete(id)
        .then(data => {
            if(!data){
                res.status(404).json({success:false, message : `Cannot Delete with id ${id}. Maybe id is wrong`})
            }else{
                res.json({success:true,
                    message : "Activity was deleted successfully!"
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                success:false,
                message: "Could not delete activity with id=" + id
            });
        });
}

exports.sendNoti = async (req, res) => {
    const id = req.params.id
    try {
        const activity = await Activity.findById(id)
        const allParents = await Parent.find({})
        let title = `[Hoạt động chung] ${activity.title}`
        let content = `
        Kính gửi quý phụ huynh!
        
        Sắp tới, nhà trường có một hoạt động chung muốn thông báo đến quý phụ huynh như sau. 

        Tên hoạt động: ${activity.title}
        Thời gian: ${activity.date}, từ ${activity.timeStart}-${activity.timeFinish}
        Địa điểm: ${activity.place}
        Chi tiết hoạt động: 
        ${activity.description}

        Hi vọng quý phụ huynh có thể sắp xếp để đăng kí cho bé tham gia. Nhà trường xin cảm ơn!
        `
        for (const parent of allParents) {
            let mail = new ParentMail({
                parent: parent,
                title: title,
                content: content,
                category: "Hoạt động chung",
                commonActivity: activity
            })
            mail.save((err, doc) => {
                if(err){
                    console.log(err)
                    return res.status(500).json({ success: false, message: err.message })
                }
            })
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({ success: false, message: err.message })
    }
}