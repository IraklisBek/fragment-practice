const Notification = require("../models/notification")
const User = require("../models/user")

const populate = [
    {
        path: "users_involved"
    },
    {
        path: "post"
    }
]

exports.getNotifications = (req, res, next) => {
    Notification.find().populate(populate)
        .then(notifications => {
            res.status(200).json({
                notifications: notifications
            })
        })
        .catch(err => {
            res.status(500).json({
                message: err
            })
        })
}

exports.addNotification = (req, res, next) => {
    const notification = new Notification(req.body)
    notification.save()
        .then(createdNotification => {
            res.status(201).json(
                createdNotification
            )
        })
        .catch(err => {
            res.status(500).json({
                message: err
            })
        })
}

exports.getNotification = (req, res, next) => {
    Notification.findOne({ _id: req.params.id }).populate(populate)
        .then(notification => {
            if (notification) {
                res.status(200).json(notification);
            } else {
                res.status(404).json({ message: 'Notification not found!' });
            }
        })
        .catch(error => {
            res.status(500).json({
                message: "Fetching notification failed"
            })
        });
}

exports.getNotificationByPostAndKind = (req, res, next) => {
    Notification.findOne({ post: req.params.postid, kind: req.params.kind }).populate(populate)
        .then(notification => {
            if (notification) {
                res.status(200).json(notification);
            } else {
                res.status(200).json({ message: 'Notification by post and kind not found!' });
            }
        })
        .catch(error => {
            res.status(500).json({
                message: error
            })
        });
}

exports.updateNotification = (req, res, next) => {
    const user = req.body
    // console.log(user)
    Notification.updateOne({ _id: req.params.id }, req.body).populate(populate)
        .then(result => {
            // console.log(user)
            res.status(200).json(result);
        })
        .catch(error => {
            res.status(500).json({
                message: error
            })
        });
}

exports.deleteNotification = (req, res, next) => {
    Notification.deleteOne({ _id: req.params.id })
        .then(result => {
            console.log(req.params.userid)
            User.findByIdAndUpdate(req.params.userid, { $pullAll: { notifications: [req.params.id] } }, { new: true })
                .then(result2 => {
                    res.status(200).json({
                        message: 'Notification Deleted!'
                    });
                })
                .catch(error => {
                    res.status(500).json({
                        message: "Update User failed"
                    })
                });
        })
        .catch(error => {
            res.status(500).json({
                message: "Delete notiffication failed"
            })
        });
}
