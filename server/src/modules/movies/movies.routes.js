const express = require('express');
const router = express.Router();
const moviesController = require('./movies.controller');

router.get('/danh-sach/phim-moi-cap-nhat', (req, res, next) => moviesController.getLatest(req, res, next));
router.get('/danh-sach/:slug', (req, res, next) => moviesController.getList(req, res, next));
router.get('/tim-kiem', (req, res, next) => moviesController.search(req, res, next));
router.get('/the-loai', (req, res, next) => moviesController.getCategories(req, res, next));
router.get('/the-loai/:slug', (req, res, next) => moviesController.getByCategory(req, res, next));
router.get('/quoc-gia', (req, res, next) => moviesController.getCountries(req, res, next));
router.get('/quoc-gia/:slug', (req, res, next) => moviesController.getByCountry(req, res, next));
router.get('/nam-phat-hanh', (req, res, next) => moviesController.getYears(req, res, next));
router.get('/nam-phat-hanh/:year', (req, res, next) => moviesController.getByYear(req, res, next));
router.get('/phim/:slug', (req, res, next) => moviesController.getDetail(req, res, next));

module.exports = router;
