const WatchHistory = require('./watchHistory.model');

exports.saveProgress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { movieSlug, movieName, posterUrl, episodeSlug, episodeName, currentTime, duration } = req.body;

    if (!movieSlug) {
      return res.status(400).json({ success: false, message: 'movieSlug là bắt buộc' });
    }

    const historyItem = await WatchHistory.findOneAndUpdate(
      { userId, movieSlug },
      {
        movieName: movieName || '',
        posterUrl: posterUrl || '',
        episodeSlug: episodeSlug || '',
        episodeName: episodeName || '',
        currentTime: Number(currentTime) || 0,
        duration: Number(duration) || 0,
        updatedAt: new Date(),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({ success: true, data: historyItem });
  } catch (error) {
    next(error);
  }
};

exports.getHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const items = await WatchHistory.find({ userId }).sort({ updatedAt: -1 }).limit(20);
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
};

exports.clearHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    await WatchHistory.deleteMany({ userId });
    res.status(200).json({ success: true, message: 'Đã xóa lịch sử xem' });
  } catch (error) {
    next(error);
  }
};
