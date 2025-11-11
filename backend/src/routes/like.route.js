import express from "express";
import likeController from "../controllers/likeController.js";
import { verifyTokenMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/user-like/:storyId", verifyTokenMiddleware, likeController.likeStory);

router.delete("/user-unlike/:storyId", verifyTokenMiddleware, likeController.unlikeStory);

router.get("/check-liked/:storyId", verifyTokenMiddleware, likeController.checkLiked);

export default router;