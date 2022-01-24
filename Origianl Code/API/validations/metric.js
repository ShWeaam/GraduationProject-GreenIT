const Joi = require("joi");
Joi.objectId = require('joi-objectid')(Joi);

// validations for all routes are separate from other code
// just for clean and scaleable code
module.exports = {
    // validations for creating a metric
    create: data =>
        Joi.object({
            water: Joi.number().required(),
            electricity: Joi.number().required(),
            gas: Joi.number().required(),
            paper: Joi.number().required(),
            disposables: Joi.number().required(),
            date: Joi.date()
        }).validate(data),

    // validations for updateing a metric
    update: data =>
        Joi.object({
            water: Joi.number().required(),
            electricity: Joi.number().required(),
            gas: Joi.number().required(),
            paper: Joi.number().required(),
            disposables: Joi.number().required(),
        }).validate(data),

    // validating metricID as valid mongo ID
    metricId: data =>
    Joi.object({
        metricId: Joi.objectId().required()
    }).validate(data),

}