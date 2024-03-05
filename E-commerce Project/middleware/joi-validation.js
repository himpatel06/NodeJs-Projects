const Joi = require('joi');

const validator = (schema) => (payload) =>{
    schema.validate(payload);
}

const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
})

exports.validateSignup = validator(schema);