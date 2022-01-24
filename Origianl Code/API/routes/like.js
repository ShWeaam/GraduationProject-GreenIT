const router = require('express').Router();
const likeManager = require('../managers/like');
const auth = require('../middlewares/auth');
const supervisor = require('../middlewares/supervisor');

// route to get all likes of a post
router.get('/post/:id', auth, async (req, res) => {
    try {
        // get post ID from request parameters and call manager method to fetch likes
        const t = await likeManager.getByPost(req.params.id);
        // return the found likes to response
        return res.status(200).send(t);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

router.get('/user/:id', auth, async (req, res) => {
    try {
        const t = await likeManager.getByUser(req.params.id);
        return res.status(200).send(t);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

router.post('/check', auth, async (req, res) => {
    try {
        let obj = {
            ...req.body,
            userId: req.tokenData.userId
        };
        const p = await likeManager.check(obj);
        return res.status(200).send(p);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

router.post('/', auth, async (req, res) => {
    try {
        let obj = {
            ...req.body,
            userId: req.tokenData.userId
        };
        const p = await likeManager.check(obj);
        if(p.length > 0)
            return res.status(400).send(`Already liked.`);

        const t = await likeManager.create(obj);
        return res.status(200).send(t);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

router.post('/remove', auth, async (req, res) => {
    try {
        let obj = {
            ...req.body,
            userId: req.tokenData.userId
        };
        const t = await likeManager.deleteByPostAndUser(obj);
        return res.status(200).send(t);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const id = req.params.id;
        const r = await likeManager.delete(id);
        return res.status(200).send(r);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

module.exports = router;