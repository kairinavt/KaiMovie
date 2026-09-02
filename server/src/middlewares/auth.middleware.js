const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { errorResponse } = require('../utils/response');

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return errorResponse(res, 'Vui lòng đăng nhập để thực hiện chức năng này', 401);
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, env.jwtSecret || 'kaimovie_secret_key_123456');
    req.user = decoded;
    next();
  } catch (err) {
    return errorResponse(res, 'Phiên đăng nhập hết hạn hoặc không hợp lệ', 401);
  }
};

module.exports = { authenticate };
