import express from "express";
import chapterController from "../controllers/chapterController.js";

const router = express.Router();

router.get("/:id", chapterController.getChaptersByStoryId);

router.get("/chapter-detail/:id", chapterController.getChapterContent);

export default router;