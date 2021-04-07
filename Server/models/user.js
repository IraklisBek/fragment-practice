const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");

const supporSchema = mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
    },
    value: { type: Number }
}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } })

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },//unique is not validating, is for optimazation
    password: { type: String, required: true },
    username: { type: String, required: true },
    photo: {
        type: String,
        required: true
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
    }],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
    }],
    support: [supporSchema],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    notifications: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Notification",
    }],
}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } });

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);//collection will automatically be users