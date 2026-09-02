const express = require('express');
const router = express.Router();
const commentsController = require('./comments.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

router.get('/:movieSlug', commentsController.getComments);
router.post('/:movieSlug', authMiddleware, commentsController.addComment);

module.exports = router;
