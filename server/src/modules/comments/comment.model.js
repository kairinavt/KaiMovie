const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, default: 'Thành Viên' },
    userAvatar: { type: String, default: '' },
    movieSlug: { type: String, required: true, index: true },
    content: { type: String, required: true, trim: true },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comment', commentSchema);
