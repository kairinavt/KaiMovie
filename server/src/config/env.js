require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/kaimovie',
  jwtSecret: process.env.JWT_SECRET || 'default_secret_key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  vsmovBaseUrl: process.env.VSMOV_BASE_URL || 'https://vsmov.com/api',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
  facebookAccessToken: process.env.FACEBOOK_ACCESS_TOKEN || '',
};
