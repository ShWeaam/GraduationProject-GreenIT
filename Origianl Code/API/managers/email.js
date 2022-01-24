require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_FROM_PASSWORD
    }
});

module.exports = {
    sendEmail: obj => {
        return new Promise((resolve, reject) => {
            const options = {
                from: process.env.EMAIL_FROM,
                to: obj.to,
                subject: obj.subject,
                html: obj.html
            };
            transporter.sendMail(options, function(error, info) {
                if (error) {
                    reject(error);
                } else {
                    resolve(info.response);
                }
            });
        });
    }
}