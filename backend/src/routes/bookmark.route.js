import express from "express";
import {
  addBookmark,
  removeBookmark,
  getBookmarksByUser,
  checkBookmark
} from "../controllers/bookmarkController.js";
import { verifyTokenMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Chỉ cho phép người dùng đã đăng nhập
router.post("/add", verifyTokenMiddleware, addBookmark);
router.delete("/remove", verifyTokenMiddleware, removeBookmark);
router.get("/list", verifyTokenMiddleware, getBookmarksByUser);
router.get("/check", verifyTokenMiddleware, checkBookmark); 


export default router;
