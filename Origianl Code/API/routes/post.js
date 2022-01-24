const router = require('express').Router();
const postManager = require('../managers/post');
const postValidations = require('../validations/post');
const moment = require("moment");
const s3Manager = require('../managers/s3');
const getErrorDetails = require('../utils/error-details');
const utils = require('../utils/utils');
const auth = require('../middlewares/auth');
const supervisor = require('../middlewares/supervisor');

router.post("/", auth, async (req, res) => {
  try {
    const error = postValidations.create(req.body).error;
    if (error) return res.status(400).send(getErrorDetails(error));

    const file = req.files && req.files.file || null;

    if (file) {
      s3Manager.uploadFile(file, async (s3Result) => {
        let obj = {
          ...s3Result,
          userId: req.tokenData.userId,
          ...req.body,
        };
        const post = await postManager.create(obj);
        return res.status(200).send(post);
      });
    } else {
      let obj = {
        userId: req.tokenData.userId,
        ...req.body,
      };
      const post = await postManager.create(obj);
      return res.status(200).send(post);
    }
  } catch (ex) {
    return res.status(500).send(ex.message);
  }
});

router.post('/update/:postId', auth, async (req, res) => {
    try {
        const error = postValidations.update(req.body).error;
        if (error)
            return res.status(400).send(getErrorDetails(error));

        if (!req.files || !req.files.file) {
            let p = await postManager.getById(req.params.postId);
            let obj = {
                ...req.body,
                fileUrl: p.fileUrl,
                fileName: p.fileName,
                fileSize: p.fileSize,
                fileKey: p.fileKey,
            };
            const post = await postManager.update(req.params.postId, obj);
            return res.status(200).send(post);
        }
        else {
            const file = req.files.file;
            s3Manager.uploadFile(file, async s3Result => {
                let obj = {
                    ...s3Result,
                    ...req.body
                };
                const post = await postManager.update(req.params.postId, obj);
                return res.status(200).send(post);
            });
        }
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

router.post(`/get-mine`, auth, async (req, res) => {
    try {
        const userId = req.tokenData.userId;
        const post = await postManager.getByUserId(userId);
        return res.status(200).send(post);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

router.post(`/user/:userId`, auth, async (req, res) => {
    try {
        const userId = req.params.userId;
        const post = await postManager.getByUserId(userId);
        return res.status(200).send(post);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

router.post(`/all`, auth, async (req, res) => {
    try {
        const posts = await postManager.getAll();
        return res.status(200).send(posts);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

router.get('/:postId', auth, async (req, res) => {
    try {
        const error = postValidations.postId(req.params).error;
        if (error)
            return res.status(400).send(getErrorDetails(error));

        const post = await postManager.getById(req.params.postId);
        return res.status(200).send(post);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

router.delete('/:postId', auth, async (req, res) => {
    try {
        const error = postValidations.postId(req.params).error;
        if (error)
            return res.status(400).send(getErrorDetails(error));

        const post = await postManager.delete(req.params.postId);
        return res.status(200).send(post);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

router.post('/share/:postId', auth, async (req, res) => {
    try {
        const error = postValidations.postId(req.params).error;
        if (error)
            return res.status(400).send(getErrorDetails(error));

        const originalPost = await postManager.getById(req.params.postId);
        const date = req.body.date;
        const post = await postManager.share(originalPost[0], req.tokenData.userId, date);
        return res.status(200).send(post);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

module.exports = router;