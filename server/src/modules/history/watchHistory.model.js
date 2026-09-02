const mongoose = require('mongoose');

const watchHistorySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    movieSlug: { type: String, required: true, index: true },
    episodeName: { type: String, default: '' },
    progressSeconds: { type: Number, default: 0 },
  },
  { timestamps: true }
);

watchHistorySchema.index({ userId: 1, movieSlug: 1 }, { unique: true });

module.exports = mongoose.model('WatchHistory', watchHistorySchema);
