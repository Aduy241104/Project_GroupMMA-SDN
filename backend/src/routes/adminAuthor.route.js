import express from "express";
import {
  getAllAuthorsForAdmin,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
} from "../controllers/authorController.js";

const router = express.Router();

// Routes
router.get("/", getAllAuthorsForAdmin);          // Lấy tất cả tác giả
router.get("/:id", getAuthorById);       // Lấy tác giả theo ID
router.post("/", createAuthor);          // Tạo tác giả mới
router.put("/:id", updateAuthor);        // Cập nhật tác giả
router.delete("/:id", deleteAuthor);     // Xóa tác giả

export default router;
