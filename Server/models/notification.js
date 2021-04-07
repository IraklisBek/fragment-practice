const mongoose = require("mongoose");

const notificationSchema = mongoose.Schema({
    title: { type: String },
    kind: { type: String, enum: ['LIKE', 'EVENT_REMINDER', 'EVENT_NEW', 'SUPPORTED'] },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
    },
    users_involved: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    read: { type: Boolean, default: false }
}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } });

module.exports = mongoose.model("Notification", notificationSchema);