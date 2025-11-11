import User from "../models/user.js";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt"
import jwtUtil from "../utils/JwtService.js"


const login = async (req, res, next) => {

    const { email, password } = req.body;
    try {

        const user = await User.findOne({ email: email })
            .select("-__v -updatedAt -createdAt").lean();

        console.log("USER: ", user);


        if (!user) {
            const err = new Error("Invalid Email!");
            err.statusCode = StatusCodes.NOT_FOUND;
            return next(err); 
        }

        // Kiểm tra tài khoản có bị block không
        if (user.isActive === false) {
            const err = new Error("Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.");
            err.statusCode = StatusCodes.FORBIDDEN;
            return next(err); 
        }

        //tam thoi do chua ma hoa
        // const isMatch = await bcrypt.compare(password, user.password);

        const isMatch = user.password === password;

        if (!isMatch) {
            const err = new Error("Invalid password");
            err.statusCode = StatusCodes.UNAUTHORIZED;
            return next(err); 
        }

        const token = jwtUtil.generateToken({ id: user._id, email: user.email, role: user.role });
        delete user.password;
        // Không trả về isActive trong response
        delete user.isActive;

        const responseData = {
            success: true,
            statusCode: StatusCodes.OK,
            message: "Login successful",
            data: {
                ...user,
                token: token
            }
        }

        res.status(StatusCodes.OK).json(responseData);
    } catch (error) {
        next(error);
    }
}

// POST /logout 
const logout = async (req, res, next) => {
    try {
        // Lấy token từ header (Bearer token) để confirm auth
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            const err = new Error("No token provided!");
            err.statusCode = StatusCodes.UNAUTHORIZED;
            return next(err);
        }

        const token = authHeader.split(' ')[1];

        jwtUtil.verifyToken(token);  

        const responseData = {
            success: true,
            statusCode: StatusCodes.OK,
            message: "Logout successful! Tạm biệt, hẹn gặp lại với những câu chuyện truyện tranh hay hơn."
        };

        res.status(StatusCodes.OK).json(responseData);
    } catch (error) {
        next(error);
    }
};

export default {
    login, logout
}
