const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const { authenticate } = require('../../middlewares/auth.middleware');

router.post('/register', (req, res, next) => authController.register(req, res, next));
router.post('/login', (req, res, next) => authController.login(req, res, next));
router.post('/google', (req, res, next) => authController.googleAuth(req, res, next));
router.post('/facebook', (req, res, next) => authController.facebookAuth(req, res, next));
router.post('/social-login', (req, res, next) => authController.socialLogin(req, res, next));
router.get('/me', authenticate, (req, res, next) => authController.getMe(req, res, next));

module.exports = router;
