const AWS = require('aws-sdk');
const uuid = require('uuid').v4;
const path = require('path');
require('dotenv').config();


// this file manages the connection with the S3 bucket on AWS

// get the connection credentials from the env file
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS,
    region: process.env.AWS_REGION
});

const Manager = {
    // upload file to S3
    uploadFile: (file, callback) => {
        const ext = path.extname(file.name);
        const key = `${uuid()}${ext}`;
        const params = {
            Bucket: process.env.AWS_BUCKET,
            Key: key,
            Body: file.data,
            ACL: process.env.AWS_PERMISSIONS
        };

        s3.upload(params, (err, data) => {
            if (err) throw err;
            const obj = {
                fileUrl: data.Location,
                fileName: file.name,
                fileSize: file.size,
                fileKey: key
            };
            callback(obj);
        });
    },
    // delete file from S3
    deleteFile: (key, callback) => {
        const params = {
            Bucket: process.env.AWS_BUCKET,
            Key: key
        };

        s3.deleteObject(params, (err, data) => {
            if (err)
                callback(false);
            else
                callback(true);
        });
    }
};

module.exports = Manager;