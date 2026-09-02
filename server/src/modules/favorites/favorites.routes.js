const express = require('express');
const router = express.Router();
const favoritesController = require('./favorites.controller');
const { authenticate } = require('../../middlewares/auth.middleware');

router.get('/', authenticate, (req, res, next) => favoritesController.getFavorites(req, res, next));
router.post('/toggle', authenticate, (req, res, next) => favoritesController.toggleFavorite(req, res, next));
router.get('/check/:movieSlug', authenticate, (req, res, next) => favoritesController.checkIsFavorite(req, res, next));

module.exports = router;
