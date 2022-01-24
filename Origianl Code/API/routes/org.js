const router = require('express').Router();
const orgManager = require('../managers/org');
const moment = require("moment");
const s3Manager = require('../managers/s3');
const utils = require('../utils/utils');
const auth = require('../middlewares/auth');
const supervisor = require('../middlewares/supervisor');

router.post('/', supervisor, async (req, res) => {
    try {
        let emailExists = await orgManager.getByEmail(req.body.email);
        if(emailExists.length > 0)
            return res.status(400).send(`Organization already exists witht this email.`);

        if (!req.files || !req.files.file)
            return res.status(400).send(`File not provided.`);

        const file = req.files.file;
        if (!file.mimetype.startsWith('image/'))
            return res.status(400).send(`Only image files are accepted.`);

        s3Manager.uploadFile(file, async s3Result => {
            let obj = {
                ...s3Result,
                ...req.body
            };
            const org = await orgManager.create(obj);
            return res.status(200).send(org);
        });
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

router.post(`/all`, auth, async (req, res) => {
    try {
        const orgs = await orgManager.getAll();
        return res.status(200).send(orgs);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

router.delete('/:orgId', supervisor, async (req, res) => {
    try {
        const org = await orgManager.delete(req.params.orgId);
        return res.status(200).send(org);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

module.exports = router;