const mongoose = require("mongoose");

const tagSchema = mongoose.Schema({
    name: String
}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } });

module.exports = mongoose.model("Tag", tagSchema);