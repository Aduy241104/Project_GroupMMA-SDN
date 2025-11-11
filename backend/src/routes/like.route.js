import express from "express";
import likeController from "../controllers/likeController.js";
import { verifyTokenMiddleware, verifyActiveUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/user-like/:storyId", verifyTokenMiddleware, verifyActiveUser, likeController.likeStory);

router.delete("/user-unlike/:storyId", verifyTokenMiddleware, verifyActiveUser, likeController.unlikeStory);

router.get("/check-liked/:storyId", verifyTokenMiddleware, verifyActiveUser, likeController.checkLiked);

export default router;