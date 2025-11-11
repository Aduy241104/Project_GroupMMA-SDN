import express from "express";
import { addComment, updateComment, deleteComment, getCommentsByStory } from "../controllers/commentController.js";
import { verifyTokenMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Thêm comment (phải login)
router.post("/", verifyTokenMiddleware, addComment);

// Sửa comment (phải login)
router.put("/", verifyTokenMiddleware, updateComment);

// Xóa comment (phải login)
router.delete("/:commentId", verifyTokenMiddleware, deleteComment);

router.get("/story/:storyId", getCommentsByStory);



export default router;
