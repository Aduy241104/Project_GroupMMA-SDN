import express from "express";
import likeController from "../controllers/likeController.js";
import { verifyTokenMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/user-like/:storyId", verifyTokenMiddleware, likeController.likeStory);

router.delete("/user-unlike/:storyId", verifyTokenMiddleware, likeController.unlikeStory);

export default router;