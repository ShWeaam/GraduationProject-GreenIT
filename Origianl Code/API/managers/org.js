const Organization = require('../models/org');
const mongoose = require('mongoose');
const uuid = require('uuid').v4;

const Manager = {
    // get all green organizations
    getAll: async () => {
        return await Organization.find({});
    },
    // get specific orgnization
    getByEmail: async email => {
        return await Organization.find({email: email});
    },
    // add new orginzation
    create: async t => {
        let org = new Organization({...t});
        org = await org.save();
        return org ? org : false;
    },
    // delete orgnization
    delete: async id => {
        let t = await Organization.findByIdAndDelete(id);
        return t ? true : false;
    },
    // delete all orgnizations
    deleteAll: async () => {
        let t = await Organization.deleteMany({});
        return t ? true : false;
    }
};

module.exports = Manager;