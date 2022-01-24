const router = require('express').Router();
const commentManager = require('../managers/comment');
const auth = require('../middlewares/auth');
const supervisor = require('../middlewares/supervisor');

// route to get all comments of a post
router.get('/post/:id', auth, async (req, res) => {
    try {
        // get post ID from request parameters and call manager method to fetch comments
        const t = await commentManager.getByPost(req.params.id);
        // return the found comments to response
        return res.status(200).send(t);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

router.get('/user/:id', auth, async (req, res) => {
    try {
        const t = await commentManager.getByUser(req.params.id);
        return res.status(200).send(t);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

router.post('/', auth, async (req, res) => {
    try {
        const obj = {
          ...req.body,
          userId: req.tokenData.userId
        };
        const t = await commentManager.create(obj);
        return res.status(200).send(t);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

router.post('/remove', auth, async (req, res) => {
    try {
        const obj = {
            ...req.body,
            userId: req.tokenData.userId
        };
        const t = await commentManager.deleteByPostAndUser(obj);
        return res.status(200).send(t);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const id = req.params.id;
        const r = await commentManager.delete(id);
        return res.status(200).send(r);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

module.exports = router;