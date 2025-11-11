import express from "express";
import { getAllAuthors } from "../controllers/authorController.js";

const router = express.Router();

// Lấy danh sách authors (không cần admin)
router.get("/", getAllAuthors);

export default router;

