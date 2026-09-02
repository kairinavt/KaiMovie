const favoritesService = require('./favorites.service');
const { successResponse, errorResponse } = require('../../utils/response');

class FavoritesController {
  async getFavorites(req, res, next) {
    try {
      const data = await favoritesService.getFavorites(req.user.id);
      return successResponse(res, data);
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  async toggleFavorite(req, res, next) {
    try {
      const { movieSlug, movieSnapshot } = req.body;
      if (!movieSlug || !movieSnapshot) {
        return errorResponse(res, 'Thiếu thông tin phim để thực hiện thao tác', 400);
      }
      const data = await favoritesService.toggleFavorite(req.user.id, { movieSlug, movieSnapshot });
      return successResponse(res, data, data.message);
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  async checkIsFavorite(req, res, next) {
    try {
      const { movieSlug } = req.params;
      const data = await favoritesService.checkIsFavorite(req.user.id, movieSlug);
      return successResponse(res, data);
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }
}

module.exports = new FavoritesController();
