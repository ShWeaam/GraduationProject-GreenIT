const mongoose = require("mongoose");
const {isEmail} = require('validator');

const schema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    text:  {type: String, require: false, default: null},
    hashtags:  {type: String, require: false, default: null},
    fileUrl: {type: String, require: false, default: null},
    fileName: {type: String, require: false, default: null},
    fileSize: {type: String, require: false, default: null},
    fileKey: {type: String, require: false, default: null},
    date: {type: Date, require: true, default: Date.now()},
    originalPostId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: false,
        default: null,
    }
});

const Post = mongoose.model("Post", schema);

module.exports = Post;
