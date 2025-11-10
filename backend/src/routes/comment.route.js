import express from 'express';
import commentController from '../controllers/commentController.js';
import { verifyTokenMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', verifyTokenMiddleware, commentController.createComment);

router.get('/story/:storyId', commentController.getCommentsByStory);

router.put('/:id', verifyTokenMiddleware, commentController.updateComment);
router.delete('/:id', verifyTokenMiddleware, commentController.deleteComment);

router.get('/', verifyTokenMiddleware, commentController.getAllComments);

export default router;
