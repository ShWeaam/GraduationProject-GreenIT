const router = require('express').Router();
const userManager = require('../managers/user');
const userValidations = require('../validations/user');
const emailManager = require('../managers/email');
const crypto = require('../utils/crypto');
const config = require('../config.json');
const moment = require("moment");
const s3Manager = require('../managers/s3');
const getErrorDetails = require('../utils/error-details');
const tokens = require('../utils/tokens');
const utils = require('../utils/utils');
const replaceall = require('replaceall');
const auth = require('../middlewares/auth');
const supervisor = require('../middlewares/supervisor');

router.post('/add-supervisor', supervisor, async (req, res) => {
    try {
        const error = userValidations.addSupervisor(req.body).error;
        if (error)
            return res.status(400).send(getErrorDetails(error));

        let user = await userManager.getByEmail(req.body.email);
        if (user)
            return res.status(400).send(`User already exists with this email.`);

        user = await userManager.getByUsername(req.body.username);
        if (user)
            return res.status(400).send(`User already exists with this username.`);

        const obj = {
            ...req.body,
            password: await crypto.hash(req.body.password, config.saltRounds)
        };

        user = await userManager.create(obj);

        return res.status(200).send(user);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});
router.post('/signup-requests', supervisor, async (req, res) => {
    try {
        const users = await userManager.getInactiveSchools();
        return res.status(200).send(users);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

router.post('/signup', async (req, res) => {
    try {
        const error = userValidations.addSupervisor(req.body).error;
        if (error)
            return res.status(400).send(getErrorDetails(error));

        let user = await userManager.getByEmail(req.body.email);
        if (user)
            return res.status(400).send(`User already exists with this email.`);

        user = await userManager.getByUsername(req.body.username);
        if (user)
            return res.status(400).send(`User already exists with this username.`);

        const obj = {
            ...req.body,
            password: await crypto.hash(req.body.password, config.saltRounds)
        };

        user = await userManager.create(obj);

        return res.status(200).send(user);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

router.post('/activate', supervisor, async (req, res) => {
    try {
        const error = userValidations.userId(req.body).error;
        if (error)
            return res.status(400).send(getErrorDetails(error));

        user = await userManager.activate(req.body.userId);

        let html = await utils.readTemplate(`welcome`);
        html = replaceall(`{{name}}`, user.name, html);
        html = replaceall(`{{appName}}`, config.appName, html);
        emailManager.sendEmail({
            to: user.email,
            subject: `Welcome to ${config.appName}`,
            html: html
        });

        return res.status(200).json(true);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

router.delete('/delete/:userId', supervisor, async (req, res) => {
    try {
        const error = userValidations.userId(req.params).error;
        if (error)
            return res.status(400).send(getErrorDetails(error));

        let result = await userManager.delete(req.params.userId);

        return res.status(200).json(result);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

router.post('/login', async (req, res) => {
    try {
        const error = userValidations.login(req.body).error;
        if (error)
            return res.status(400).send(getErrorDetails(error));

        const user = await userManager.getByEmail(req.body.email);
        if (!user)
            return res.status(400).send(`Email not assiciated with any user.`);

        const passwordMatches = await crypto.compare(req.body.password, user.password);
        if (!passwordMatches)
            return res.status(400).send(`Password Incorrect.`);

        if (user.active === false)
            return res.status(400).send(`User is not active. Please wait until a supervisor activates your account.`);

        const token = await tokens.getJwt(user._id);

        const result = {
            token: token,
            cookie: config.cookieName,
            age: config.cookieAgeInSeconds,
            user: user
        };
        return res.status(200).send(result);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

router.post('/forgot-password', async (req, res) => {
    try {
        const error = userValidations.forgotPassword(req.body).error;
        if (error)
            return res.status(400).send(getErrorDetails(error));

        const user = await userManager.getByEmail(req.body.email);
        if (!user)
            return res.status(400).send(`Email not assiciated with any user.`);

        const temp = await userManager.setTempPassword(req.body.email);
        const link = `${config.resetPasswordUrl}?token=${temp}`;
        let html = await utils.readTemplate(`forgot-password`);
        html = replaceall(`{{appName}}`, config.appName, html);
        html = replaceall(`{{link}}`, link, html);
        await emailManager.sendEmail({
            to: req.body.email,
            subject: 'Reset your password',
            html: html
        });

        return res.status(200).send(true);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

router.post('/reset-password', async (req, res) => {
    try {
        const error = userValidations.resetPassword(req.body).error;
        if (error)
            return res.status(400).send(getErrorDetails(error));

        if (!utils.isValidUUID4(req.body.token))
            return res.status(400).send(`Invalid password reset token provided.`);

        let user = await userManager.getByTempPassword(req.body.token);
        if (!user)
            return res.status(400).send(`Invalid password reset token provided.`);

        const obj = {password: await crypto.hash(req.body.password, config.saltRounds)};

        user = await userManager.updatePassword(user._id, obj);

        let html = await utils.readTemplate(`reset-password`);
        html = replaceall(`{{name}}`, user.name, html);
        html = replaceall(`{{appName}}`, config.appName, html);
        emailManager.sendEmail({
            to: user.email,
            subject: 'Password reset',
            html: html
        });

        return res.status(200).send(true);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

router.post('/update', auth, async (req, res) => {
    try {
        const error = userValidations.update(req.body).error;
        if (error)
            return res.status(400).send(getErrorDetails(error));

        const user = await userManager.update(req.tokenData.userId, req.body);
        return res.status(200).send(user);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

router.post('/update-picture', auth, async (req, res) => {
    try {
        if (!req.files || !req.files.file)
            return res.status(400).send(`File not provided.`);

        const file = req.files.file;
        if (!file.mimetype.startsWith('image/'))
            return res.status(400).send(`Only image files are accepted.`);

        s3Manager.uploadFile(file, async s3Result => {
            const user = await userManager.updatePicture(req.tokenData.userId, s3Result);
            return res.status(200).send(user);
        });
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

router.post('/update-password', auth, async (req, res) => {
    try {
        const error = userValidations.updatePassword(req.body).error;
        if (error)
            return res.status(400).send(getErrorDetails(error));

        let user = await userManager.getById(req.tokenData.userId);
        const passwordMatches = await crypto.compare(req.body.currentPassword, user.password);
        if (!passwordMatches)
            return res.status(400).send(`Wrong current password.`);

        const encryptedPassword = await crypto.hash(req.body.newPassword);
        user = await userManager.updatePassword(req.tokenData.userId, {password: encryptedPassword});
        return res.status(200).send(true);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

router.get(`/:userId`, async (req, res) => {
    try {
        const error = userValidations.userId(req.params).error;
        if (error)
            return res.status(400).send(getErrorDetails(error));

        const userId = req.params.userId;
        const user = await userManager.getById(userId);
        return res.status(200).send(user);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

router.post(`/all`, supervisor, async (req, res) => {
    try {
        const users = await userManager.getAllSupervisors();
        return res.status(200).send(users);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});
router.post(`/all-users`, supervisor, async (req, res) => {
    try {
        const users = await userManager.getAll();
        return res.status(200).send(users);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

router.get(`/details/:userId`, supervisor, async (req, res) => {
    try {
        const error = userValidations.userId(req.params).error;
        if (error)
            return res.status(400).send(getErrorDetails(error));

        const userId = req.params.userId;
        const user = await userManager.getById(userId);
        const ads = await adManager.getByUserId(userId);
        const reportsByUser = await userReportManager.getByUserId(userId);
        const reportsAgainstUser = await userReportManager.getByAgainstUserId(userId);
        const result = {
            user,
            ads,
            reportsByUser,
            reportsAgainstUser
        };
        return res.status(200).send(result);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

router.post('/update-active-status', supervisor, async (req, res) => {
    try {
        const error = userValidations.updateStatus(req.body).error;
        if (error)
            return res.status(400).send(getErrorDetails(error));

        const user = await userManager.updateActiveStatus(req.body.userId, req.body.status);
        return res.status(200).send(user);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

router.post('/change-password', supervisor, async (req, res) => {
    try {
        const error = userValidations.changePassword(req.body).error;
        if (error)
            return res.status(400).send(getErrorDetails(error));

        const encryptedPassword = await crypto.hash(req.body.newPassword);
        let user = await userManager.updatePassword(req.body.userId, encryptedPassword);
        return res.status(200).send(user);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

router.post('/delete-user-and-ads', supervisor, async (req, res) => {
    try {
        const error = userValidations.userId(req.body).error;
        if (error)
            return res.status(400).send(getErrorDetails(error));

        const userId = req.body.userId;
        await adManager.deleteByUserId(userId);
        const isDeleted = await userManager.delete(userId);
        return res.status(200).send({isDeleted: isDeleted});
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

module.exports = router;