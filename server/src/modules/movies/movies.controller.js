const moviesService = require('./movies.service');
const { successResponse, errorResponse } = require('../../utils/response');

class MoviesController {
  async getLatest(req, res, next) {
    try {
      const page = req.query.page || 1;
      const result = await moviesService.getLatestMovies(page);
      return successResponse(res, result);
    } catch (error) {
      next(error);
    }
  }

  async getList(req, res, next) {
    try {
      const { slug } = req.params;
      const page = req.query.page || 1;
      const result = await moviesService.getMovieList(slug, page);
      return successResponse(res, result);
    } catch (error) {
      next(error);
    }
  }

  async search(req, res, next) {
    try {
      const { keyword, limit } = req.query;
      if (!keyword) {
        return errorResponse(res, 'Từ khóa tìm kiếm không được để trống', 400);
      }
      const result = await moviesService.searchMovies(keyword, limit);
      return successResponse(res, result);
    } catch (error) {
      next(error);
    }
  }

  async getCategories(req, res, next) {
    try {
      const result = await moviesService.getCategories();
      return successResponse(res, result);
    } catch (error) {
      next(error);
    }
  }

  async getByCategory(req, res, next) {
    try {
      const { slug } = req.params;
      const page = req.query.page || 1;
      const result = await moviesService.getMoviesByCategory(slug, page);
      return successResponse(res, result);
    } catch (error) {
      next(error);
    }
  }

  async getCountries(req, res, next) {
    try {
      const result = await moviesService.getCountries();
      return successResponse(res, result);
    } catch (error) {
      next(error);
    }
  }

  async getByCountry(req, res, next) {
    try {
      const { slug } = req.params;
      const page = req.query.page || 1;
      const result = await moviesService.getMoviesByCountry(slug, page);
      return successResponse(res, result);
    } catch (error) {
      next(error);
    }
  }

  async getYears(req, res, next) {
    try {
      const result = await moviesService.getReleaseYears();
      return successResponse(res, result);
    } catch (error) {
      next(error);
    }
  }

  async getByYear(req, res, next) {
    try {
      const { year } = req.params;
      const page = req.query.page || 1;
      const result = await moviesService.getMoviesByYear(year, page);
      return successResponse(res, result);
    } catch (error) {
      next(error);
    }
  }

  async getDetail(req, res, next) {
    try {
      const { slug } = req.params;
      const result = await moviesService.getMovieDetail(slug);
      return successResponse(res, result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MoviesController();
