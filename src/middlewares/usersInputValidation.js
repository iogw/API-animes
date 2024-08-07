const Joi = require('joi');
const { validate } = require('./validate');

const baseUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

const signupSchema = baseUserSchema.keys({
  username: Joi.string().min(3).max(30).required(),
});

const loginSchema = baseUserSchema;

const signup = validate(signupSchema, 'body');
const login = validate(loginSchema, 'body');

module.exports = { signup, login };
