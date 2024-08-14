const { verify } = require('../utils/tokenUtils');
const { jsonRes, MSG } = require('../utils/apiResponse');

const authenticate = (req, res, next) => {
  const token = req.headers['authorization'];
  const decoded = verify(token);

  if (!token)
    return jsonRes(res, 'forbidden', { error: MSG.TOKEN_NOT_PROVIDED });
  if (!decoded) return jsonRes(res, 'forbidden', { error: MSG.INVALID_TOKEN });
  req.user = decoded;
  next();
};

module.exports = { authenticate };
