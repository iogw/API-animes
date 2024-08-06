const Joi = require('joi');

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

// Validate
const validate = (schema, property) => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property]);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message,
      });
    }
    next();
  };
};

const id = validate(idSchema, 'params');
const idAndImmutable = validate(idAndImmutableSchema, 'params');
const data = validate(dataSchema, 'body');

module.exports = {
  id,
  data,
  idAndImmutable,
};
