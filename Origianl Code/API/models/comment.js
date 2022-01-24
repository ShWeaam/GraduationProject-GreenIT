const mongoose = require("mongoose");

// the comment model schema for db
const schema = new mongoose.Schema({
    date: {type: Date, default: Date.now()},
    text: {type: String, required: true, default: ``},
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
});

const Comment = mongoose.model("Comment", schema);

module.exports = Comment;
