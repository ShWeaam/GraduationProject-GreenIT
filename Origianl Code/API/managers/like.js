const Like = require('../models/like');

module.exports = {
    create: async data => {
        let t = new Like({
            date: data.date,
            userId: data.userId,
            postId: data.postId
        });
        t = await t.save();
        return t ? t : false;
    },
    // list all likes
    list: async () => await Like.find({}),

    // get all Likes for a specific post
    getByPost: async id => await Like.find({postId: id}).populate('userId').sort({ date: -1 }),
    
    // get all Likes for a specific user    
    getByUser: async id => await Like.find({userId: id}).populate('postId').sort({ date: -1 }),
    
    // check likes for specific post for specific user   
    check: async data => await Like.find({ $and: [{userId: data.userId}, {postId: data.postId}]}),
    
    //delete like from post
    delete: async id => {
        let t = await Like.findByIdAndDelete(id);
        return t ? t : false;
    },
    
    // delete all Likes on a post        
    deleteByPost: async id => {
        let t = await Like.deleteMany({postId: id});
        return t ? t : false;
    },
    
    // delete all Likes on a specific post by a specific user    
    deleteByPostAndUser: async data => {
        let t = await Like.deleteMany({postId: data.postId, userId: data.userId});
        return t ? t : false;
    }
}