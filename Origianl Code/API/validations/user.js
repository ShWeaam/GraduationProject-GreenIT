const Joi = require("joi");
Joi.objectId = require('joi-objectid')(Joi);

module.exports = {
    signup: data =>
        Joi.object({
            name: Joi.string().min(1).max(50).required(),
            email: Joi.string().max(255).required().email(),
            password: Joi.string().min(3).max(255).required(),
            ip: Joi.string().required(),
        }).validate(data),

    addSupervisor: data =>
        Joi.object({
            name: Joi.string().min(1).max(50).required(),
            email: Joi.string().max(255).required().email(),
            username: Joi.string().max(255).required(),
            password: Joi.string().min(3).max(255).required(),
            phone: Joi.string().max(13).required(),
            website: Joi.string().allow(''),
            street: Joi.string().allow(''),
            city: Joi.string().allow(''),
            type: Joi.number(),
            active: Joi.boolean(),
            joined: Joi.date()
        }).validate(data),

    activate: data =>
        Joi.object({
            userId: Joi.objectId().required()
        }).validate(data),

    login: data =>
        Joi.object({
            email: Joi.string().min(1).max(255).required().email(),
            password: Joi.string().min(3).max(255).required()
        }).validate(data),

    forgotPassword: data =>
        Joi.object({
            email: Joi.string().min(1).max(255).required().email()
        }).validate(data),

    resetPassword: data =>
        Joi.object({
            token: Joi.string().min(36).max(36).required(),
            password: Joi.string().min(3).max(255).required()
        }).validate(data),

    update: data =>
        Joi.object({
            name: Joi.string().min(1).max(50).required(),
            phone: Joi.string().max(13).required(),
            website: Joi.string().allow(''),
            street: Joi.string().allow(''),
            city: Joi.string().allow(''),
        }).validate(data),

    updateLocation: data =>
        Joi.object({
            coordinates: Joi.array().items(Joi.number().required()).min(2).max(2).required()
        }).validate(data),

    updatePassword: data =>
        Joi.object({
            currentPassword: Joi.string().min(3).max(255).required(),
            newPassword: Joi.string().min(3).max(255).required()
        }).validate(data),

    changePassword: data =>
        Joi.object({
            newPassword: Joi.string().min(3).max(255).required(),
            userId: Joi.objectId().required()
        }).validate(data),

    updateStatus: data =>
        Joi.object({
            status: Joi.boolean().required(),
            userId: Joi.objectId().required()
        }).validate(data),

    userId: data =>
        Joi.object({
            userId: Joi.objectId().required()
        }).validate(data),
}