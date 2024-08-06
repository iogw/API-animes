// TODO: comprobar, limpiar e integrar con animesRoutes

const Joi = require('joi');

// Schemas
// Validación del ID en las rutas GET, PUT y DELETE
const idSchema = Joi.object({
  id: Joi.number().integer().required(),
});

// Validación de los datos en la ruta POST y PUT
const maxYear = new Date().getFullYear() + 2;
const animeSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().integer().min(1900).max(maxYear).required(),
  chapters: Joi.number().integer().required(),
});

// Validación adicional para PUT y DELETE (IDs inmodificables)
const immutableIds = [1, 2, 3];
const checkImmutableId = (id) => {
  if (immutableIds.includes(id)) {
    throw new Error('id 1, 2 or 3 cannot be modified');
  }
  return id;
};

const animeIdSchema = idSchema.custom(
  checkImmutableId,
  'Check if id is immutable'
);

// MIDDLEWARE

// validate.js

const validate = (schema, property) => {
  return (req, res, next) => {
    console.log(req['params']['id']);

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

// const validateId = (req, res, next) => {
//   const { error } = idSchema.validate(req.params.id);
//   if (error) {
//     return res.status(400).json({
//       success: false,
//       error: error.details[0].message,
//     });
//   }
//   next();
// };
const validateId = validate(idSchema, 'params');

// const validateAnime = (req, res, next) => {
//   const { error } = animeSchema.validate(req.body);
//   if (error) {
//     return res.status(400).json({
//       success: false,
//       error: error.details[0].message,
//     });
//   }
//   next();
// };
const validateAnime = validate(animeSchema, 'body');

// const validateImmutableId = (req, res, next) => {
//   const { error } = animeIdSchema.validate(req.params.id);
//   if (error) {
//     return res.status(400).json({
//       success: false,
//       error: error.details[0].message,
//     });
//   }
//   next();
// };
const validateImmutableId = validate(animeIdSchema, 'params.id');

module.exports = {
  validateId,
  validateAnime,
  validateImmutableId,
};
