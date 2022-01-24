const router = require('express').Router();
const userManager = require('../managers/user');
const metricManager = require('../managers/metric');
const metricValidations = require('../validations/metric');
const config = require('../config.json');
const moment = require("moment");
const getErrorDetails = require('../utils/error-details');
const utils = require('../utils/utils');
const auth = require('../middlewares/auth');
const supervisor = require('../middlewares/supervisor');

router.post('/check', auth, async (req, res) => {
    try {
        const userId = req.tokenData.userId;
        const date = req.body.date;
        let metrics = await metricManager.check(userId, date);
        return res.status(200).send(metrics);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

router.post('/compare', supervisor, async (req, res) => {
    try {
        const metric = req.body.metric;
        const userIds = req.body.userIds;
        const date = req.body.date;
        let metrics = await metricManager.getAllForCompare(metric, userIds, date);
        return res.status(200).send(metrics);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

router.post('/user/average', auth, async (req, res) => {
    try {
        const userId = req.tokenData.userId;
        let metrics = await metricManager.getAverage(userId);
        return res.status(200).send(metrics);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

router.post('/all', auth, async (req, res) => {
    try {
        const userId = req.tokenData.userId;
        const date = req.body.date;
        const user = await userManager.getById(userId);
        let metrics = await metricManager.getByCity(user.city || ``, date);
        return res.status(200).send(metrics);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

router.post('/user/all', auth, async (req, res) => {
    try {
        const userId = req.tokenData.userId;
        let metrics = await metricManager.getByUserId(userId);
        return res.status(200).send(metrics);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

router.post('/user/history', auth, async (req, res) => {
    try {
        const userId = req.body.userId;
        let metrics = await metricManager.getByUserId(userId);
        return res.status(200).send(metrics);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

router.post('/user-metics/:userId', auth, async (req, res) => {
    try {
        const userId = req.params.userId;
        let metrics = await metricManager.getByUserId(userId);
        metrics = metrics.sort((a,b) => new Date(b.date) - new Date(a.date));
        return res.status(200).send(metrics[0] || false);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

router.post('/user-metics-by-month', auth, async (req, res) => {
    try {
        const userId = req.body.userId;
        const date = req.body.date;
        let metrics = await metricManager.getByUserIdWithMonth(userId, date);
        return res.status(200).send(metrics || false);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

router.post('/', auth, async (req, res) => {
    try {
        const error = metricValidations.create(req.body).error;
        if (error)
            return res.status(400).send(getErrorDetails(error));

        const obj = {
            ...req.body,
            userId: req.tokenData.userId
        };
        let metric = await metricManager.create(obj);
        return res.status(200).send(metric);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

router.post('/:metricId', auth, async (req, res) => {
    try {
        const error = metricValidations.update(req.body).error;
        if (error)
            return res.status(400).send(getErrorDetails(error));

        const metricId = req.params.metricId;
        const metric = await metricManager.update(metricId, req.body);
        return res.status(200).send(metric);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

router.get(`/:metricId`, auth, async (req, res) => {
    try {
        const error = metricValidations.metricId(req.params).error;
        if (error)
            return res.status(400).send(getErrorDetails(error));

        const metricId = req.params.metricId;
        const metric = await metricManager.getById(metricId);
        return res.status(200).send(metric);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

router.delete(`/:metricId`, auth, async (req, res) => {
    try {
        const error = metricValidations.metricId(req.params).error;
        if (error)
            return res.status(400).send(getErrorDetails(error));

        const metricId = req.params.metricId;
        const metric = await metricManager.delete(metricId);
        return res.status(200).send(metric);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

module.exports = router;