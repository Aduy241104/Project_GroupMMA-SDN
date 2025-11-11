import ReadingHistory from "../models/readingHistory.js";


/**
 * Thêm hoặc cập nhật lịch sử đọc
 * POST /api/reading-history
 * body: { userId, storyId }
 */
const addOrUpdateHistory = async (req, res) => {
    const user = req.user;
    try {
        const { storyId } = req.params;
        const { id } = user;
        if (!id || !storyId) {
            return res.status(400).json({ message: "Thiếu userId hoặc storyId" });
        }

        const history = await ReadingHistory.findOneAndUpdate(
            { userId: id, storyId },
            { lastReadAt: new Date() },
            { new: true, upsert: true } // nếu chưa có thì tạo mới
        );

        res.status(200).json({
            message: "Cập nhật lịch sử đọc thành công",
            data: history
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

/**
 * Xóa lịch sử đọc của 1 truyện
 * DELETE /api/reading-history/:id
 * params: id = id của document trong ReadingHistory
 */
const deleteHistory = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await ReadingHistory.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ message: "Không tìm thấy lịch sử đọc" });
        }

        res.status(200).json({ message: "Đã xóa lịch sử đọc" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

/**
 * Lấy danh sách lịch sử đọc của 1 user
 * GET /api/reading-history/:userId
 */
const getUserHistory = async (req, res) => {
    const user = req.user;
    try {
        const { id } = user;
        console.log("IDSS: ", id);

        const historyList = await ReadingHistory.find({ userId: id })
            .populate({
                path: "storyId",
                populate: [
                    { path: "categoryIds", select: "name" },
                    { path: "authorId", select: "name" }
                ],
                select: "-createdBy -createdAt -updatedAt -__v"
            })
            .sort({ lastReadAt: -1 }).select("-__v");

        res.status(200).json(historyList);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};


export default {
    getUserHistory,
    addOrUpdateHistory,
    deleteHistory

}