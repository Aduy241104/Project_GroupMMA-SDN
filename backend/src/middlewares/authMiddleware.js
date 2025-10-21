import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET;


export const verifyTokenMiddleware = (req, res, next) => {
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