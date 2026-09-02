const express = require('express');
const router = express.Router();
const historyController = require('./history.controller');
const { authenticate } = require('../../middlewares/auth.middleware');

router.use(authenticate);

router.post('/progress', historyController.saveProgress);
router.get('/', historyController.getHistory);
router.delete('/', historyController.clearHistory);

module.exports = router;
