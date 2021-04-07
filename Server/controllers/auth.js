//const bcrypt = require("bcrypt");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
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
    },
    {
        path: "notifications",
        populate: {
            path: "users_involved"
        }
    }
]


exports.createUser = (req, res, nexr) => {
    const url = req.protocol + '://' + req.get("host");

    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(req.body.password, salt, function (err, hash) {
            var main_photo = url + "/images/" + req.files?.photo[0].filename;
            const user = new User({
                email: req.body.email,
                password: hash,
                photo: main_photo,
                username: req.body.username,
                posts: [],
                likes: [],
                support: []
            });
            user.save()
                .then(result => {
                    res.status(201).json({
                        message: "User Created",
                        result: result
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        message: err
                    });
                });
        });
    });
}


exports.userLogin = (req, res, next) => {
    let fetchedUser;
    User.findOne({ email: req.body.email }).populate(populate)
        .then(user => {
            if (!user) {
                return res.status(401).json({
                    message: 'Wrong Email'
                });
            }
            fetchedUser = user;
            //return bcrypt.compareSync("B4c0/\/", hash);
            return bcrypt.compare(req.body.password, user.password);
        })
        .then(result => {
            if (!result) {
                return res.status(401).json({
                    message: 'Wrong password'
                });
            }
            const token = jwt.sign({
                email: fetchedUser.email, userId: fetchedUser._id
            },
                "secret_this_should_be_longer",
                {
                    expiresIn: "1h"
                });
            res.status(200).json({
                token: token,
                expiresIn: 3600,
                userId: fetchedUser._id,
                user: fetchedUser
            })
        })
        .catch(err => {
            return res.status(401).json({
                message: 'Invalid Authentication Credentials'
            });
        });
}