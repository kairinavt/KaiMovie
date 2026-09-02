const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    movieSlug: { type: String, required: true, index: true },
    movieSnapshot: {
      name: { type: String, required: true },
      poster_url: { type: String, default: '' },
      year: { type: Number },
    },
  },
  { timestamps: true }
);

favoriteSchema.index({ userId: 1, movieSlug: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
