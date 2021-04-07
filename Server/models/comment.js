const mongoose = require('mongoose');

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

module.exports = mongoose.model('Comment', commentsSchema);