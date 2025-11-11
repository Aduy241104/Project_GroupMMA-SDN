import express from "express";
import chapterController from "../controllers/chapterController.js";
import { verifyTokenMiddleware, verifyAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/:id", chapterController.getChaptersByStoryId);

router.get("/chapter-detail/:id", chapterController.getChapterContent);


// Admin routes - chỉ admin mới CRUD
router.post("/create", verifyTokenMiddleware, verifyAdmin, chapterController.createChapter);
router.put("/update/:id", verifyTokenMiddleware, verifyAdmin, chapterController.updateChapter);
router.delete("/delete/:id", verifyTokenMiddleware, verifyAdmin, chapterController.deleteChapter);

export default router;