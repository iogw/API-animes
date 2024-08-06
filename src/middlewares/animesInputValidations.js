const Joi = require('joi');
const {validate} = require('./validate');

// Schemas
const idSchema = Joi.object({
  id: Joi.number().integer().required(),
});

const immutableIds = [1, 2, 3];
const idAndImmutableSchema = idSchema.concat(
  Joi.object({
    id: Joi.invalid(...immutableIds).messages({
      'any.invalid': 'This id cannot be modified.',
    }),
  })
);

const maxYear = new Date().getFullYear() + 2;
const dataSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().integer().min(1900).max(maxYear).required(),
  chapters: Joi.number().integer().required(),
});

const id = validate(idSchema, 'params');
const idAndImmutable = validate(idAndImmutableSchema, 'params');
const data = validate(dataSchema, 'body');

module.exports = {
  id,
  data,
  idAndImmutable,
};
