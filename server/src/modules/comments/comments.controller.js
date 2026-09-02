const Comment = require('./comment.model');

exports.getComments = async (req, res, next) => {
  try {
    const { movieSlug } = req.params;
    const comments = await Comment.find({ movieSlug }).sort({ createdAt: -1 }).limit(50);
    
    // Calculate average rating
    let avgRating = 5;
    if (comments.length > 0) {
      const sum = comments.reduce((acc, curr) => acc + (curr.rating || 5), 0);
      avgRating = Number((sum / comments.length).toFixed(1));
    }

    res.status(200).json({
      success: true,
      data: {
        comments,
        totalComments: comments.length,
        avgRating,
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.addComment = async (req, res, next) => {
  try {
    const { movieSlug } = req.params;
    const { content, rating } = req.body;
    const userId = req.user.id;
    const userName = req.user.name || 'Thành Viên';

    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Nội dung bình luận không được trống' });
    }

    const newComment = await Comment.create({
      userId,
      userName,
      movieSlug,
      content: content.trim(),
      rating: Number(rating) || 5,
    });

    res.status(201).json({ success: true, data: newComment });
  } catch (error) {
    next(error);
  }
};
