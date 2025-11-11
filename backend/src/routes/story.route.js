import express from "express";
import storyController from "../controllers/storyController.js";

const router = express.Router();

router.get("/", storyController.getAllStory);

router.get("/home", storyController.getHomeData);

router.get("/most-view", storyController.getMostViewedData);

router.get("/search", storyController.findStory);

router.patch("/update-view/:id", storyController.updateStoryView);


export default router;