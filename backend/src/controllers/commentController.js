import Comment from '../models/comment.js';


// Thêm comment
export const addComment = async (req, res) => {
    try {
        const { storyId, content } = req.body;

        // Lấy userId từ req.user (token phải đã được giải mã trước đó)
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: userId not found" });
        }

        const comment = await Comment.create({ storyId, content, userId });
        res.status(201).json(comment);
    } catch (error) {
        console.error("Add comment error:", error);
        res.status(500).json({ message: error.message });
    }
};



// Sửa comment
export const updateComment = async (req, res) => {
    try {
        const { commentId, content } = req.body;
        const userId = req.user.id;

        const comment = await Comment.findOneAndUpdate(
            { _id: commentId, userId },  // chỉ owner mới sửa được
            { content, updatedAt: new Date() },
            { new: true }
        );

        if (!comment) return res.status(404).json({ message: "Comment không tồn tại hoặc bạn không có quyền." });

        res.json(comment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Xóa comment
export const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const userId = req.user.id;

        const comment = await Comment.findOneAndDelete({ _id: commentId, userId });

        if (!comment) return res.status(404).json({ message: "Comment không tồn tại hoặc bạn không có quyền." });

        res.json({ message: "Đã xóa comment." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy tất cả comment của 1 truyện
export const getCommentsByStory = async (req, res) => {
    try {
        const { storyId } = req.params; // lấy storyId từ URL params
        if (!storyId) {
            return res.status(400).json({ message: "storyId is required" });
        }

        const comments = await Comment.find({ storyId })
            .sort({ createdAt: -1 }) // comment mới nhất lên trước
            .populate('userId', 'username avatar'); // lấy thông tin user nếu cần

        res.json(comments);
    } catch (error) {
        console.error("Get comments by story error:", error);
        res.status(500).json({ message: error.message });
    }
};
