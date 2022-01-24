const Joi = require("joi");
Joi.objectId = require('joi-objectid')(Joi);

module.exports = {
    create: data =>
        Joi.object({
            text: Joi.string().required(),
            hashtags: Joi.string().required(),
            date: Joi.date(),
            file: Joi.any().allow('').optional()
        }).validate(data),

    update: data =>
        Joi.object({
            text: Joi.string().required(),
            hashtags: Joi.string().required(),
            file: Joi.any().allow('').optional()
        }).validate(data),

    postId: data =>
        Joi.object({
            postId: Joi.objectId().required()
        }).validate(data)
}