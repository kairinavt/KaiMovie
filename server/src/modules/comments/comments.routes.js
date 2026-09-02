const express = require('express');
const router = express.Router();
const commentsController = require('./comments.controller');
const { authenticate } = require('../../middlewares/auth.middleware');

router.get('/:movieSlug', commentsController.getComments);
router.post('/:movieSlug', authenticate, commentsController.addComment);

module.exports = router;
