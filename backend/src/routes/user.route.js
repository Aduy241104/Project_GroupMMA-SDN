import express from 'express';
import userController from '../controllers/userController.js';
import { verifyTokenMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/register',userController.register);
router.post('/verify-otp', userController.verifyOTP);
router.post('/change-password', verifyTokenMiddleware, userController.changePassword)
router.post ('/forgot-password', userController.forgotPassword)
router.post ('/reset-password', userController.resetPassword)
router.put('/update-profile', verifyTokenMiddleware, userController.updateProfile)

export default router; 