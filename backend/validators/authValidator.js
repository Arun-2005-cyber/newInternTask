const Joi = require('joi');

exports.registerSchema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    contact: Joi.string().optional(),
    userType: Joi.string().valid('student', 'professional'),
    gender: Joi.string().valid('male', 'female', 'other')
});

exports.loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});
