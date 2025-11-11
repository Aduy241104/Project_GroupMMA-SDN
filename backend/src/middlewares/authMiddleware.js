import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const verifyTokenMiddleware = (req, res, next) => {
    const SECRET_KEY = process.env.JWT_SECRET;
    const authHeader = req.headers["authorization"];

    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Access token is missing" });
    }

    // Xác thực token
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid or expired token" });
        }
        req.user = user; // Lưu user info vào req
        next();
    });
}

// Middleware kiểm tra tài khoản có bị block không
export const verifyActiveUser = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const userId = req.user.id || req.user._id;
        const user = await User.findById(userId).select("isActive");
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.isActive === false) {
            return res.status(403).json({ 
                message: "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên." 
            });
        }

        next();
    } catch (error) {
        console.error("ERROR verifyActiveUser:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
}


// Middleware kiểm tra quyền admin
export const verifyAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied: Admins only" });
    }

    next();
};

// Cho phép admin hoặc chính chủ (owner)
export const verifySelfOrAdmin = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "User not authenticated" });

  const reqUserId = req.params.id || req.body.id; // tham khảo
  if (req.user.role === "admin") return next();
  if (req.user.id === reqUserId || req.user._id === reqUserId) return next();

  return res.status(403).json({ message: "Access denied" });
};