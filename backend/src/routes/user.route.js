import express from 'express';
import userController from '../controllers/userController.js';

const router = express.Router();

router.post('/register',userController.register);

export default router; 