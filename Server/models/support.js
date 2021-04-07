const mongoose = require("mongoose");

const supporSchema = mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "post",
    },
    value: { type: Number }
}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } })

module.exports = mongoose.model("Support", supporSchema);