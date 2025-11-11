import express from "express";
import storyController from "../controllers/storyController.js";
import { verifyTokenMiddleware, verifyAdmin } from "../middlewares/authMiddleware.js";


const router = express.Router();

router.get("/", storyController.getAllStory);

router.get("/home", storyController.getHomeData);

router.get("/most-view", storyController.getMostViewedData);

router.get("/search", storyController.findStory);

router.patch("/update-view/:id", storyController.updateStoryView);


router.get("/home", storyController.getHomeData);
// route mới: lấy chi tiết story
router.get("/:id", storyController.getStoryById);

// admin - thêm truyện (chỉ 'novel')
router.post("/create", verifyTokenMiddleware, verifyAdmin, storyController.createStory);

// admin - sửa truyện (chỉ 'novel')
router.put("/update/:id", verifyTokenMiddleware, verifyAdmin, storyController.updateStory);

// admin - xóa truyện (chỉ 'novel')
router.delete("/delete/:id", verifyTokenMiddleware, verifyAdmin, storyController.deleteStory);



export default router;