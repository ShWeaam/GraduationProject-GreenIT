const Post = require('../models/post');
const mongoose = require('mongoose');
const uuid = require('uuid').v4;

const Manager = {
    // get all posts from the DB
    getAll: async () => {
        return await Post.aggregate([
            {
                $lookup:
                    {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "userId"
                    }
            },
            {
                $lookup:
                    {
                        from: "likes",
                        localField: "_id",
                        foreignField: "postId",
                        as: "likes"
                    }
            },
            {
                $lookup:
                    {
                        from: "comments",
                        localField: "_id",
                        foreignField: "postId",
                        as: "comments"
                    }
            },
            {
                $lookup:
                    {
                        from: "posts",
                        localField: "originalPostId",
                        foreignField: "_id",
                        as: "originalPostId"
                    }
            },
            {
                $lookup:
                    {
                        from: "users",
                        localField: "originalPostId.userId",
                        foreignField: "_id",
                        as: "originalUserId"
                    }
            }
        ])
            .unwind('userId')
            .sort({ date: -1 });
    },

    // get posts for certian user
    getByUserId: async userId => {
        return await Post.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) }},
            {
                $lookup:
                    {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "userId"
                    }
            },
            {
                $lookup:
                    {
                        from: "likes",
                        localField: "_id",
                        foreignField: "postId",
                        as: "likes"
                    }
            },
            {
                $lookup:
                    {
                        from: "comments",
                        localField: "_id",
                        foreignField: "postId",
                        as: "comments"
                    }
            },
            {
                $lookup:
                    {
                        from: "posts",
                        localField: "originalPostId",
                        foreignField: "_id",
                        as: "originalPostId"
                    }
            }
        ]).unwind('userId').sort({ date: -1 });
    },

    // get specific post
    getById: async id => {
        return await Post.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(id) }},
            {
                $lookup:
                    {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "userId"
                    }
            },
            {
                $lookup:
                    {
                        from: "likes",
                        localField: "_id",
                        foreignField: "postId",
                        as: "likes"
                    }
            },
            {
                $lookup:
                    {
                        from: "comments",
                        localField: "_id",
                        foreignField: "postId",
                        as: "comments"
                    }
            },
            {
                $lookup:
                    {
                        from: "posts",
                        localField: "originalPostId",
                        foreignField: "_id",
                        as: "originalPostId"
                    }
            }
        ]).unwind('userId').sort({ date: -1 });
    },
    
    // create post
    create: async t => {
        let post = new Post({...t});
        post = await post.save();
        return post ? post : false;
    },

    // update post
    update: async (id, data) => {
        let t = await Post.findByIdAndUpdate(id, {
            text: data.text,
            hashtags: data.hashtags,
            fileUrl: data.fileUrl,
            fileName: data.fileName,
            fileSize: data.fileSize,
            fileKey: data.fileKey,
        }, {
            new: true
        });

        return t ? t : false;
    },
    // delete post
    delete: async id => {
        let t = await Post.findByIdAndDelete(id);
        return t ? true : false;
    },
    // delete all posts
    deleteAll: async () => {
        let t = await Post.deleteMany({});
        return t ? true : false;
    },
    // share post, creates a new post with same information from post we want to share 
    share: async (originalPost, userId, date) => {
        let post = new Post({
            userId: userId,
            originalPostId: originalPost._id,
            text: originalPost.text,
            hashtags: originalPost.hashtags,
            fileUrl: originalPost.fileUrl,
            fileName: originalPost.fileName,
            fileSize: originalPost.fileSize,
            fileKey: originalPost.fileKey,
            date: date
        });
        post = await post.save();
        return post ? post : false;
    },
};

module.exports = Manager;