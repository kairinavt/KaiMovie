const mongoose = require('mongoose');

const watchHistorySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    movieSlug: { type: String, required: true, index: true },
    movieName: { type: String, default: '' },
    posterUrl: { type: String, default: '' },
    episodeSlug: { type: String, default: '' },
    episodeName: { type: String, default: '' },
    currentTime: { type: Number, default: 0 },
    duration: { type: Number, default: 0 },
  },
  { timestamps: true }
);

watchHistorySchema.index({ userId: 1, movieSlug: 1 }, { unique: true });

module.exports = mongoose.model('WatchHistory', watchHistorySchema);
