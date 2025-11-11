
// routes/user.route.js
import express from "express";
import userController from "../controllers/userController.js";
// import các middleware kiểm tra auth (đảm bảo file authMiddleware export đúng tên)
import { verifyTokenMiddleware, verifyAdmin, verifyActiveUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * Local middleware: cho phép admin hoặc chính chủ (owner).
 * req.user được set bởi verifyTokenMiddleware (token payload chứa id/_id và role)
 */
const verifySelfOrAdmin = (req, res, next) => {
  const userPayload = req.user;
  if (!userPayload) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  // Admin thì ok
  if (userPayload.role === "admin") return next();

  // So sánh id của token với param id hoặc body.id
  const paramId = req.params.id || req.body.id;
  const tokenId = userPayload.id || userPayload._id;

  if (!paramId) {
    return res.status(400).json({ message: "Missing target user id" });
  }

  if (tokenId && tokenId.toString() === paramId.toString()) {
    return next();
  }

  return res.status(403).json({ message: "Access denied: only admin or owner" });
};

/* ---------------- Public routes ---------------- */
router.post("/register", userController.register);
router.post("/verify-otp", userController.verifyOTP);
router.post("/forgot-password", userController.forgotPassword);
router.post("/reset-password", userController.resetPassword);

/* ---------------- Protected routes ---------------- */
/* Lưu ý: verifyTokenMiddleware phải được gọi trước verifyActiveUser, verifyAdmin hoặc verifySelfOrAdmin */

// Thay đổi password (chỉ user đã auth)
router.post("/change-password", verifyTokenMiddleware, verifyActiveUser, userController.changePassword);

// Cập nhật profile & xem profile (user đã auth)
router.put("/update-profile", verifyTokenMiddleware, verifyActiveUser, userController.updateProfile);
router.get("/profile", verifyTokenMiddleware, verifyActiveUser, userController.viewProfile);

/* ---------------- Admin / Owner routes ---------------- */

// Danh sách tất cả users - chỉ admin
router.get("/users", verifyTokenMiddleware, verifyActiveUser, verifyAdmin, userController.getAll);

// Admin tạo user
router.post("/users", verifyTokenMiddleware, verifyActiveUser, verifyAdmin, userController.createUserByAdmin);

// Lấy 1 user (admin hoặc chính chủ)
router.get("/users/:id", verifyTokenMiddleware, verifyActiveUser, verifySelfOrAdmin, userController.getUserById);

// Cập nhật user (admin hoặc chính chủ)
router.put("/users/:id", verifyTokenMiddleware, verifyActiveUser, verifySelfOrAdmin, userController.updateUser);

// Xóa user (admin)
router.delete("/users/:id", verifyTokenMiddleware, verifyActiveUser, verifyAdmin, userController.deleteUser);

// Block / Unblock (admin)
router.patch("/users/:id/block", verifyTokenMiddleware, verifyActiveUser, verifyAdmin, userController.blockUser);
router.patch("/users/:id/unblock", verifyTokenMiddleware, verifyActiveUser, verifyAdmin, userController.unblockUser);

export default router;