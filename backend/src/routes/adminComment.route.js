import express from "express";
import adminCommentController from "../controllers/adminCommentController.js";
import {
  verifyTokenMiddleware,
  verifyAdmin,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(verifyTokenMiddleware, verifyAdmin);
router.get("/", adminCommentController.getAllComments);
router.put("/:id", adminCommentController.adminUpdateComment);
router.delete("/:id", adminCommentController.adminDeleteComment);

export default router;
