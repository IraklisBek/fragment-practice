const mongoose = require('mongoose');

const supporSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    value: { type: Number }
}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } })

const commentsSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    comment: { type: String },
    repliedBy: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        comment: { type: String },
    }]
}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } })

const postSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    kind: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag"
    }],
    photo: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    title: {
        type: String,
        required: true
    },
    photos: {
        type: [String]
    },
    videos: {
        type: [String]
    },
    music: {
        type: [String]
    },
    likedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    supportedBy: [supporSchema],
    comments: [commentsSchema]
}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } });

module.exports = mongoose.model('Post', postSchema);
// module.exports = mongoose.model('Comment', commentsSchema);