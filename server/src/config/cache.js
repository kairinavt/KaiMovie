const NodeCache = require('node-cache');

// Mặc định stdTTL 600 giây (10 phút), checkperiod 120 giây
const cache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

module.exports = cache;
