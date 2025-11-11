import express from 'express';
import commentController from '../controllers/commentController.js';
import { verifyTokenMiddleware, verifyAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// --- User routes (phải login) ---
router.post('/', verifyTokenMiddleware, commentController.createComment);
router.put('/:id', verifyTokenMiddleware, commentController.updateComment);
router.delete('/:id', verifyTokenMiddleware, commentController.deleteComment);

// --- Lấy comment ---
router.get('/story/:storyId', commentController.getCommentsByStory);
router.get('/getAllComments', verifyTokenMiddleware, commentController.getAllComments);

// --- Admin routes ---
router.delete('/admin/comments/:id', verifyTokenMiddleware, verifyAdmin, commentController.adminDeleteComment);
router.put('/admin/comments/:id', verifyTokenMiddleware, verifyAdmin, commentController.adminUpdateComment);

export default router;
