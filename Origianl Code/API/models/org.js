const mongoose = require("mongoose");
const {isEmail} = require('validator');

const schema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        maxlength: 50
    },
    brief: {
        type: String,
        require: true,
    },
    details: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
        unique: true,
        lowercase: true,
        validate: isEmail
    },
    phone: {
        type: String,
        require: false,
        maxlength: 13
    },
    city: {
        type: String,
        require: false
    },
    street: {
        type: String,
        require: false
    },
    number: {
        type: String,
        require: true
    },
    lat: {
        type: String,
        require: false
    },
    lng: {
        type: String,
        require: false
    },
    website: {
        type: String,
        require: false
    },
    fileUrl: {
        type: String,
        require: false,
        default: `data:image/octet-stream;base64,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`
    },
    fileName: {type: String, require: false, default: null},
    fileSize: {type: String, require: false, default: null},
    fileKey: {type: String, require: false, default: null},
    joined: {type: Date, require: true, default: Date.now()}
});

const Organization = mongoose.model("Organization", schema);

module.exports = Organization;
