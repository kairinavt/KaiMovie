const axios = require('axios');
const env = require('../config/env');

const vsmovClient = axios.create({
  baseURL: env.vsmovBaseUrl,
  timeout: 10000,
  headers: {
    'Accept': 'application/json',
    'User-Agent': 'KaiMovie-Gateway/1.0',
  },
});

module.exports = vsmovClient;
