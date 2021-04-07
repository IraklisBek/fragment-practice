const User = require("../models/user");

const populate = [
    {
        path: "posts"
    },
    {
        path: "likes"
    },
    {
        path: "support",
        populate: {
            path: "post"
        }
    },
    {
        path: "following"
    },
    {
        path: "followers"
    },
    {
        path: "notifications",
        populate: {
            path: "post"
        }
    }
]

exports.getUsers = (req, res, next) => {
    User.find().populate(populate)
        .then(users => {
            res.status(200).json({
                message: "Users fetched succesfully!",
                posts: users
            });
        })
        .catch(error => {
            res.status(500).json({
                message: "Fetching users failed"
            })
        });
}


exports.getUsersLikedAPost = (req, res, next) => {
    // console.log(req.params.post_id)
    User.find({ likes: { $all: [req.params.post_id] } }).populate(populate)
        .then(users => {
            res.status(200).json({
                message: "Users fetched succesfully!",
                users: users
            });
        })
        .catch(error => {
            res.status(500).json({
                message: "Get likes failed"
            })
        });
}

exports.getUser = (req, res, next) => {
    User.findById(req.params.id).populate(populate)
        .then(user => {
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).json({ message: 'User not found!' });
            }
        })
        .catch(error => {
            res.status(500).json({
                message: "Fetching user failed"
            })
        });
}

exports.updateUser = (req, res, next) => {
    const user = req.body
    // console.log(user)
    User.updateOne({ _id: req.params.id }, req.body).populate(populate)
        .then(result => {
            // console.log(user)
            res.status(200).json({
                message: 'Update successful!',
                user: user
            });
        })
        .catch(error => {
            res.status(500).json({
                message: error
            })
        });
}
