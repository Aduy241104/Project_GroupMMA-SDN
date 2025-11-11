import BookMark from "../models/bookmark.js"
import Story from "../models/story.js";
import jwt from "jsonwebtoken";

// 🟢 Thêm truyện vào danh sách yêu thích
export const addBookmark = async (req, res) => {
  try {
    const { storyId } = req.body;

    // Lấy token từ header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    // Decode token để lấy userId
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // đảm bảo JWT_SECRET trùng với lúc tạo token
    const userId = decoded.id; // hoặc decoded.userId tùy payload token của bạn

    // Kiểm tra trùng
    const existing = await BookMark.findOne({ userId, storyId });
    if (existing) {
      return res.status(400).json({ message: "Truyện này đã được thêm vào bộ sưu tập." });
    }

    const bookmark = await BookMark.create({ userId, storyId });
    res.status(201).json({ message: "Đã thêm vào danh sách yêu thích", bookmark });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi thêm bookmark", error: error.message });
  }
};

// Kiểm tra bookmark
export const checkBookmark = async (req, res) => {
  try {
    const userId = req.user.id;          // lấy từ token
    const { storyId } = req.query;
    console.log("Remove Bookmark - userId:", userId, "storyId:", storyId);

    if (!storyId) {
      return res.status(400).json({ message: "storyId là bắt buộc" });
    }

    const bookmark = await BookMark.findOne({ userId, storyId });
    res.json({ bookmarked: !!bookmark });
  } catch (error) {
    console.error("Check bookmark error:", error);
    res.status(500).json({ message: "Lỗi khi kiểm tra bookmark", error: error.message });
  }
};



// removeBookmark.js
export const removeBookmark = async (req, res) => {
  try {
    const userId = req.user.id; // lấy từ token
    const { storyId } = req.body;

    console.log("Remove Bookmark - userId:", userId, "storyId:", storyId);
    if (!storyId) {
      return res.status(400).json({ message: "storyId là bắt buộc" });
    }

    const result = await BookMark.findOneAndDelete({ userId, storyId });
    if (!result) {
      return res.status(404).json({ message: "Không tìm thấy truyện trong bộ sưu tập." });
    }

    res.status(200).json({ message: "Đã xóa khỏi bộ sưu tập." });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa bookmark", error: error.message });
  }
};



export const getBookmarksByUser = async (req, res) => {
  try {
    const userId = req.user.id; // Lấy từ token, chắc chắn trùng với middleware

    if (!userId) {
      return res.status(401).json({ message: "User không hợp lệ" });
    }

    // Lấy danh sách bookmark theo user, sắp xếp theo ngày tạo (mới nhất trước)
    const bookmarks = await BookMark.find({ userId })
      .populate({
        path: "storyId",
        select: "title coverImage totalLikes status",
      })
      .sort({ createdAt: -1 });

    if (!bookmarks.length) {
      return res.status(200).json({ message: "Bạn chưa có truyện nào trong bộ sưu tập." });
    }

    res.status(200).json({
      count: bookmarks.length,
      data: bookmarks.map((b) => ({
        storyId: b.storyId._id,
        title: b.storyId.title,
        coverImage: b.storyId.coverImage,
        totalLikes: b.storyId.totalLikes,
        status: b.storyId.status,
        bookmarkedAt: b.createdAt,
      })),
    });
  } catch (error) {
    console.error("Get bookmarks error:", error);
    res.status(500).json({ message: "Lỗi khi lấy bộ sưu tập", error: error.message });
  }
};



