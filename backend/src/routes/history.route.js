import express from "express";
import readingHistoryController from "../controllers/readingHistoryController.js";
import { verifyTokenMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", verifyTokenMiddleware, readingHistoryController.getUserHistory);

router.post("/update-history/:storyId", verifyTokenMiddleware, readingHistoryController.addOrUpdateHistory);


export default router;