const Comment = require('../models/comment');

// wrapping all comment related DB operations inside an object
module.exports = {
    // this will save a new comment in the database
    create: async data => {
        let t = new Comment({
            date: data.date,
            text: data.text,
            userId: data.userId,
            postId: data.postId
        });
        t = await t.save();
        return t ? t : false;
    },
    // list all comments
    list: async () => await Comment.find({}),
    // get all comments for a specific post
    getByPost: async id => await Comment.find({postId: id}).populate('userId').sort({ date: -1 }),
    // get all comments for a specific user
    getByUser: async id => await Comment.find({userId: id}).populate('postId').sort({ date: -1 }),
    // delete a comment
    delete: async id => {
        let t = await Comment.findByIdAndDelete(id);
        return t ? t : false;
    },
    // delete all comments on a post
    deleteByPost: async id => {
        let t = await Comment.deleteMany({postId: id});
        return t ? t : false;
    },
    // delete all comments on a specific post by a specific user
    deleteByPostAndUser: async data => {
        let t = await Comment.deleteMany({postId: data.postId, userId: data.userId});
        return t ? t : false;
    }
}