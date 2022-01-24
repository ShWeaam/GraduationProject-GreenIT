const mongoose = require("mongoose");

// the like model schema for db
const schema = new mongoose.Schema({
    date: {type: Date, default: Date.now()},
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
});

const Like = mongoose.model("Like", schema);

module.exports = Like;
