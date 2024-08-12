const { jsonRes } = require('../utils/apiResponse');

const validate = (schema, property) => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property]);
    if (error) {
      return jsonRes(res, 'badRequest', { error: error.details[0].message });
    }
    next();
  };
};

module.exports = { validate };
