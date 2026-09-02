const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    movieSlug: { type: String, required: true, index: true },
    score: { type: Number, required: true, min: 1, max: 10 },
  },
  { timestamps: true }
);

ratingSchema.index({ userId: 1, movieSlug: 1 }, { unique: true });

module.exports = mongoose.model('Rating', ratingSchema);
