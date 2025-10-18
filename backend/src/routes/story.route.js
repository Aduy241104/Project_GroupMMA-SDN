import express from "express";
import storyController from "../controllers/storyController.js";

const router = express.Router();

router.get("/", storyController.getAllStory);

router.get("/home", storyController.getHomeData);

export default router;