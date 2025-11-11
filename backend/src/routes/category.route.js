import express from "express";
import {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory
} from "../controllers/categoryController.js";
import { verifyTokenMiddleware, verifyAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Lấy danh sách category (không cần admin)
router.get("/", getAllCategories);

// Admin thao tác
router.post("/", verifyTokenMiddleware, verifyAdmin, createCategory);
router.put("/:id", verifyTokenMiddleware, verifyAdmin, updateCategory);
router.delete("/:id", verifyTokenMiddleware, verifyAdmin, deleteCategory);

export default router;
