// importing all require modules
// calling the function to connect to database
require('./db/connection')();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const config = require('./config.json');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const users = require('./routes/user');
const metrics = require('./routes/metric');
const posts = require('./routes/post');
const likes = require('./routes/like');
const comments = require('./routes/comment');
const orgs = require('./routes/org');
const cron = require('node-cron');
const metricManager = require('./managers/metric');
const userManager = require('./managers/user')
const emailManager = require('./managers/email');
const moment = require('moment');
const utils = require("./utils/utils");
const replaceall = require('replaceall');

// setting up middlewares
app.use(cors());
app.use(compression());
app.use(helmet());
app.use(fileUpload({
    limits: { fileSize: parseInt(config.fileSizeLimitMBs) * 1024 * 1024 }
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// setting up routes
app.get('/', (req, res) => res.status(200).send("API is working..."));
app.use('/users', users);
app.use('/metrics', metrics);
app.use('/posts', posts);
app.use('/likes', likes);
app.use('/comments', comments);
app.use('/orgs', orgs);

// setting up cron jobs for notifications
// this will run every day at 12:00 AM
cron.schedule('0 0 0 * * *', async () => {
    runCron();
});

// main function that will handle cron tasks
const runCron = async () => {
    // fetching all schools
    // we are calling manager method to handle all DB operations there
    const schools = await userManager.getAllWithMetrics();
    // fetching all supervisors
    const supervisors = await userManager.getAllSupervisors();
    const now = moment();
    // reading HTML templates for delay and exessive use notifications
    let delayNotificationHtml = await utils.readTemplate(`delay-notification`);
    let exessiveUseNotificationHtml = await utils.readTemplate(`exessive-use-notification`);

    // loop through all schools
    for(let i = 0; i < schools.length; i++) {
        let current = schools[i];
        // getting metrics of current school in the loop
        let currentUserMetrics = current.metrics || [];
        // sort metrics by date
        currentUserMetrics = currentUserMetrics.sort((a,b) => new Date(b.date) - new Date(a.date));
        // get the most recent metric
        let recent = currentUserMetrics[0] || false;
        // if recent metric exists
        if(recent) {
            // calculate its difference in days to see if its more then 40 days
            let difference = now.diff(recent.date, 'days');
            // if its greater then 40 days
            // which means the schools has not filled the metrics in last 40 days
            // we need to notify all supervisors about this
            if(difference > 40) {
                // loop through all supervisors
                for(let k=0; k < supervisors.length; k++) {
                    // update the email HTML specific to this supervisor
                    // fillup the variables in the tempalte ~/templates/delay-notification.html
                    delayNotificationHtml = replaceall(`{{supervisor}}`, supervisors[k].name, delayNotificationHtml);
                    delayNotificationHtml = replaceall(`{{name}}`, current.name, delayNotificationHtml);
                    delayNotificationHtml = replaceall(`{{compareLink}}`, process.env.COMPARE_PAGE_LINK, delayNotificationHtml);
                    delayNotificationHtml = replaceall(`{{profileLink}}`, `${process.env.USER_PROFILE_LINK}${current._id}`, delayNotificationHtml);
                    delayNotificationHtml = replaceall(`{{appName}}`, config.appName, delayNotificationHtml);

                    // send email to current supervisor in the loop
                    emailManager.sendEmail({
                        to: supervisors[k].email,
                        subject: `Metrics delayed`,
                        html: delayNotificationHtml
                    });
                }
            }
        }

        // check if school has added entries for more than 3 months
        let secondCheck = currentUserMetrics.length >= 3;
        // if yes
        if(secondCheck) {
            // get second month's metrics data
            let second = currentUserMetrics[1];
            // get third month's metrics data
            let third = currentUserMetrics[2];
            // empty array to keep track of the metrics which exeeded in 2 consective months
            let metricsToNotify = [];
            // check for all metrics one by one and add them in arry
            if(recent.water > second.water && second.water > third.water)
                metricsToNotify.push('water');
            if(recent.electricity > second.electricity && second.electricity > third.electricity)
                metricsToNotify.push('electricity');
            if(recent.gas > second.gas && second.gas > third.gas)
                metricsToNotify.push('gas');
            if(recent.paper > second.paper && second.paper > third.paper)
                metricsToNotify.push('paper');
            if(recent.disposables > second.disposables && second.disposables > third.disposables)
                metricsToNotify.push('disposables');

            // if we got something in this array, which means, the school is exeeding it
            // we need to send email to supervisors in this case
            if(metricsToNotify.length > 0) {
                // join all metrics to make a CSV string
                let metricsToNotifyNames = metricsToNotify.join(', ');
                // loop through all supervisors to send them email
                for(let k=0; k < supervisors.length; k++) {
                    // update the tempate for this user
                    // replace the data variables in ~/templates/exessive-use-notification.html page
                    exessiveUseNotificationHtml = replaceall(`{{supervisor}}`, supervisors[k].name, exessiveUseNotificationHtml);
                    exessiveUseNotificationHtml = replaceall(`{{name}}`, current.name, exessiveUseNotificationHtml);
                    exessiveUseNotificationHtml = replaceall(`{{compareLink}}`, process.env.COMPARE_PAGE_LINK, exessiveUseNotificationHtml);
                    exessiveUseNotificationHtml = replaceall(`{{profileLink}}`, `${process.env.USER_PROFILE_LINK}${current._id}`, exessiveUseNotificationHtml);
                    exessiveUseNotificationHtml = replaceall(`{{appName}}`, config.appName, exessiveUseNotificationHtml);
                    exessiveUseNotificationHtml = replaceall(`{{metricNames}}`, metricsToNotifyNames, exessiveUseNotificationHtml);

                    // send email to current supervisor in the loop
                    emailManager.sendEmail({
                        to: supervisors[k].email,
                        subject: `Exessive use of resources`,
                        html: exessiveUseNotificationHtml
                    });
                }
            }
        }
    }
}


// decide a port for application
const port = process.env.PORT || config.port;
// start application
app.listen(port, () => console.log(`Server listening on port ${port}`));