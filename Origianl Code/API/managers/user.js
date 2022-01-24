const User = require('../models/user');
const Metric = require("../models/metric");
const uuid = require('uuid').v4;

const Manager = {
    // get all active users
    getAll: async () => {
        const users = await User.find({active: true});
        return users;
    },
    // get all users along with metrics
    getAllWithMetrics: async () => {
        let metrics = await User.aggregate([
            {
                $lookup: {
                    from: `metrics`,
                    localField: `_id`,
                    foreignField: `userId`,
                    as: `metrics`
                }
            }
        ]);
        return metrics;
    },
    // get all supervisors
    getAllSupervisors: async () => {
        const users = await User.find({type: 1});
        return users;
    },
    // get all inactive schools (not activated)
    getInactiveSchools: async () => {
        const users = await User.find({type: 2, active: false});
        return users;
    },
    // get user by ID
    getById: async id => {
        const t = await User.findById(id);
        return t ? t : false;
    },
    // get user by email
    getByEmail: async email => {
        const t = await User.findOne({email: email});
        return t ? t : false;
    },
    // get user by username
    getByUsername: async username => {
        const t = await User.findOne({username: username});
        return t ? t : false;
    },
    // create new user
    create: async t => {
        let user = new User({...t});
        user = await user.save();
        return user ? user : false;
    },
    // activate a user by ID
    activate: async id => {
        let t = await User.findByIdAndUpdate(id, {
            active: true
        }, {
            new: true
        });
        return t ? t : false;
    },
    // update user password
    updatePassword: async (id, obj) => {
        let t = await User.findByIdAndUpdate(id, {
            password: obj.password
        }, {
            new: true
        });
        return t ? t : false;
    },
    // upadate user profile info
    update: async (id, data) => {
        let t = await User.findByIdAndUpdate(id, {
            name: data.name,
            phone: data.phone,
            street: data.street,
            city: data.city,
            website: data.website
        }, {
            new: true
        });

        return t ? t : false;
    },
    // update user profile photo
    updatePicture: async (id, data) => {
        let t = await User.findByIdAndUpdate(id, {
            fileUrl: data.fileUrl,
            fileName: data.fileName,
            fileSize: data.fileSize,
            fileKey: data.fileKey,
        }, {
            new: true
        });

        return t ? t : false;
    },
    // update the active/inactive status
    updateActiveStatus: async (id, status) => {
        let t = await User.findByIdAndUpdate(id, {
            active: status,
        }, {
            new: true
        });

        return t ? t : false;
    },
    // set temp password for user
    setTempPassword: async email => {
        const tempPassword = uuid();
        await User.findOneAndUpdate({email: email}, {
            tempPassword: tempPassword
        }, {
            new: true
        });

        return tempPassword;
    },

    getByTempPassword: async token => {
        return await User.findOne({tempPassword: token});
    },
    // delete user
    delete: async id => {
        let t = await User.findByIdAndDelete(id);
        return t ? true : false;
    },
    // delete all users
    deleteAll: async () => {
        let t = await User.deleteMany({});
        return t ? true : false;
    }
};

module.exports = Manager;