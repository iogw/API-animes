
// TODO: comprobar, limpiar e integrar con animesRoutes

const Joi = require('joi');

// Schemas
// Validación del ID en las rutas GET, PUT y DELETE
const idSchema = Joi.number().integer().required();

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
const validateId = validate(idSchema,params.id)


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
const validateAnime = validate(animeSchema,body)

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
const validateImmutableId = validate(animeIdSchema,params.id)


module.exports = {
  validateId,
  validateAnime,
  validateImmutableId,
};

//
//
//
//
// router.get('/:id', async (req, res) => {
// const ID = req.params.id;

if (isNaN(parseInt(ID))) {
  return res.status(400).json({
    success: false,
    error: 'id must be a number',
  });
}

// router.post('/', tokenUtils.authenticate, async (req, res) => {
// const { title, year, chapters } = req.body;
if (!title || !year || !chapters) {
  return res.status(400).json({
    success: false,
    error: 'title, year and chapters are required fields',
  });
}
if (typeof title !== 'string') {
  return res.status(400).json({
    success: false,
    error: 'title must be text',
  });
}
if (isNaN(parseInt(year)) || isNaN(parseInt(chapters))) {
  return res.status(400).json({
    success: false,
    error: 'year and chapters must be numbers',
  });
}
if (!(1900 < parseInt(year) && parseInt(year) < maxYear)) {
  return res.status(400).json({
    success: false,
    error: `year must be after 1900 and before ${maxYear}`,
  });
}

//   router.put('/:animeId', tokenUtils.authenticate, async (req, res) => {
// const paramsId = req.params.animeId;
// const { title, year, chapters } = req.body;

if (isNaN(parseInt(paramsId))) {
  return res.status(400).json({
    success: false,
    error: 'id must be a number',
  });
}

// 1, 2, 3 cannot be modified
if ([1, 2, 3].includes(paramsId)) {
  return res.status(400).json({
    success: false,
    error: 'id 1, 2 or 3 cannot be modified',
  });
}

if (!title || !year || !chapters) {
  return res.status(400).json({
    success: false,
    error: 'title, year and chapters are required fields',
  });
}
if (typeof title !== 'string') {
  return res.status(400).json({
    success: false,
    error: 'title must be text',
  });
}
if (isNaN(parseInt(year)) || isNaN(parseInt(chapters))) {
  return res.status(400).json({
    success: false,
    error: 'year and chapters must be numbers',
  });
}
if (!(1900 < parseInt(year) && parseInt(year) < maxYear)) {
  return res.status(400).json({
    success: false,
    error: `year must be after 1900 and before ${maxYear}`,
  });
}

//   router.delete('/:animeId', tokenUtils.authenticate, async (req, res) => {
// console.log('Querying database');
// const paramsId = req.params.animeId;

if (isNaN(parseInt(paramsId))) {
  return res.status(400).json({
    success: false,
    error: 'id must be a number',
  });
}

// 1, 2, 3 cannot be modified
if ([1, 2, 3].includes(paramsId)) {
  return res.status(400).json({
    success: false,
    error: 'id 1, 2 or 3 cannot be modified',
  });
}
