const vsmovClient = require('../../utils/vsmovClient');
const cache = require('../../config/cache');

class MoviesService {
  async fetchWithCache(endpoint, ttlSeconds = 600) {
    const cachedData = cache.get(endpoint);
    if (cachedData) {
      return { ...cachedData, _fromCache: true };
    }

    try {
      const response = await vsmovClient.get(endpoint);
      const data = response.data;
      if (data && (data.status === true || data.status === 'success')) {
        cache.set(endpoint, data, ttlSeconds);
      }
      return data;
    } catch (error) {
      console.error(`Error fetching VSMOV endpoint [${endpoint}]:`, error.message);
      if (cachedData) {
        return { ...cachedData, _stale: true };
      }
      throw error;
    }
  }

  async getLatestMovies(page = 1) {
    return this.fetchWithCache(`/danh-sach/phim-moi-cap-nhat?page=${page}`, 900);
  }

  async getMovieList(slug, page = 1) {
    if (slug === 'hoat-hinh') {
      return this.fetchWithCache(`/the-loai/hoat-hinh?page=${page}`, 1800);
    }
    if (slug === 'tv-shows') {
      return this.fetchWithCache(`/the-loai/truyen-hinh-thuc-te?page=${page}`, 1800);
    }
    return this.fetchWithCache(`/danh-sach/${slug}?page=${page}`, 1800);
  }

  async searchMovies(keyword, limit = 10) {
    return this.fetchWithCache(`/tim-kiem?keyword=${encodeURIComponent(keyword)}&limit=${limit}`, 300);
  }

  async getCategories() {
    return this.fetchWithCache('/the-loai', 86400);
  }

  async getMoviesByCategory(slug, page = 1) {
    if (slug === 'phim-bo' || slug === 'phim-le') {
      return this.getMovieList(slug, page);
    }
    if (slug === 'tv-shows') {
      return this.fetchWithCache(`/the-loai/truyen-hinh-thuc-te?page=${page}`, 1800);
    }
    return this.fetchWithCache(`/the-loai/${slug}?page=${page}`, 1800);
  }

  async getCountries() {
    return this.fetchWithCache('/quoc-gia', 86400);
  }

  async getMoviesByCountry(slug, page = 1) {
    return this.fetchWithCache(`/quoc-gia/${slug}?page=${page}`, 1800);
  }

  async getReleaseYears() {
    return this.fetchWithCache('/nam-phat-hanh', 86400);
  }

  async getMoviesByYear(year, page = 1) {
    return this.fetchWithCache(`/nam-phat-hanh/${year}?page=${page}`, 1800);
  }

  async getMovieDetail(slug) {
    return this.fetchWithCache(`/phim/${slug}`, 3600);
  }
}

module.exports = new MoviesService();
