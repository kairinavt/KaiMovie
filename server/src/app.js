const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const env = require('./config/env');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/error.middleware');
const apiLimiter = require('./middlewares/rateLimit.middleware');

// Routes imports
const moviesRoutes = require('./modules/movies/movies.routes');
const authRoutes = require('./modules/auth/auth.routes');
const favoritesRoutes = require('./modules/favorites/favorites.routes');
const historyRoutes = require('./modules/history/history.routes');
const commentsRoutes = require('./modules/comments/comments.routes');

const app = express();

// Middlewares
app.use(helmet());
app.use(cors({ origin: env.corsOrigin }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static APK downloads
app.use('/downloads', express.static(path.join(__dirname, '../public/downloads')));

// Rate limit cho public routes
app.use('/api/v1/movies', apiLimiter);

// Health check endpoint
app.get('/api/v1/healthz', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'KaiMovie Backend API', timestamp: new Date().toISOString() });
});

// App version endpoint cho APK download & in-app update (Android Mobile & Android TV)
app.get('/api/v1/app/version', (req, res) => {
  res.status(200).json({
    latestVersionCode: 1,
    latestVersionName: '1.0.0',
    apkUrl: 'http://192.168.100.115:5000/downloads/kaimovie-app.apk',
    tvApkUrl: 'http://192.168.100.115:5000/downloads/kaimovie-tv-app.apk',
    changelog: 'Bổ sung tính năng Lịch sử xem, Bình luận đánh giá & Bộ lọc phim nâng cao',
    forceUpdate: false,
  });
});

// Mounting routes
app.use('/api/v1/movies', moviesRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/favorites', favoritesRoutes);
app.use('/api/v1/history', historyRoutes);
app.use('/api/v1/comments', commentsRoutes);

// Error Handler
app.use(errorHandler);

// Start server
if (require.main === module) {
  connectDB().then(() => {
    app.listen(env.port, () => {
      console.log(`🚀 KaiMovie Server running on port ${env.port} in [${env.nodeEnv}] mode`);
    });
  });
}

module.exports = app;
