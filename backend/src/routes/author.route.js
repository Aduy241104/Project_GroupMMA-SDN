import express from 'express';
import authorController from '../controllers/authorController.js';
import { verifyAdmin, verifyTokenMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// public
router.get('/', authorController.getAllAuthors);
router.get('/:id', authorController.getAuthorById);

// admin only
router.post('/', verifyTokenMiddleware, verifyAdmin, authorController.createAuthor);
router.put('/:id', verifyTokenMiddleware, verifyAdmin, authorController.updateAuthor);
router.delete('/:id', verifyTokenMiddleware, verifyAdmin, authorController.deleteAuthor);

export default router;
