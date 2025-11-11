import express from "express";
import authenticationController from "../controllers/authenticationController.js";
import { verifyTokenMiddleware } from "../middlewares/authMiddleware.js";


const router = express.Router();

router.post("/login", authenticationController.login);
router.post('/logout', verifyTokenMiddleware, authenticationController.logout)


export default router;