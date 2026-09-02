const mongoose = require('mongoose');
const Favorite = require('./favorite.model');

// Memory fallback store for dev if MongoDB is disconnected
const memoryFavorites = [];

class FavoritesService {
  async getFavorites(userId) {
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const favorites = await Favorite.find({ userId }).sort({ createdAt: -1 });
      return favorites.map(f => ({
        movieSlug: f.movieSlug,
        movieSnapshot: f.movieSnapshot,
        createdAt: f.createdAt
      }));
    } else {
      const userFavs = memoryFavorites.filter(f => String(f.userId) === String(userId));
      return userFavs.map(f => ({
        movieSlug: f.movieSlug,
        movieSnapshot: f.movieSnapshot,
        createdAt: f.createdAt
      }));
    }
  }

  async toggleFavorite(userId, { movieSlug, movieSnapshot }) {
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const existing = await Favorite.findOne({ userId, movieSlug });
      if (existing) {
        await Favorite.deleteOne({ _id: existing._id });
        return { isFavorite: false, message: 'Đã xóa khỏi danh sách yêu thích' };
      } else {
        await Favorite.create({
          userId,
          movieSlug,
          movieSnapshot
        });
        return { isFavorite: true, message: 'Đã thêm vào danh sách yêu thích' };
      }
    } else {
      const idx = memoryFavorites.findIndex(
        f => String(f.userId) === String(userId) && f.movieSlug === movieSlug
      );
      if (idx >= 0) {
        memoryFavorites.splice(idx, 1);
        return { isFavorite: false, message: 'Đã xóa khỏi danh sách yêu thích' };
      } else {
        memoryFavorites.push({
          userId: String(userId),
          movieSlug,
          movieSnapshot,
          createdAt: new Date()
        });
        return { isFavorite: true, message: 'Đã thêm vào danh sách yêu thích' };
      }
    }
  }

  async checkIsFavorite(userId, movieSlug) {
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const existing = await Favorite.findOne({ userId, movieSlug });
      return { isFavorite: !!existing };
    } else {
      const existing = memoryFavorites.find(
        f => String(f.userId) === String(userId) && f.movieSlug === movieSlug
      );
      return { isFavorite: !!existing };
    }
  }
}

module.exports = new FavoritesService();
