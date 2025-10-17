import User from "../models/user.js";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt"
import jwtUtil from "../utils/JwtService.js"


const login = async (req, res, next) => {

    const { email, password } = req.body;
    try {

        const user = await User.findOne({ email: email })
            .select("-isActive -__v -updatedAt -createdAt").lean();

        console.log("USER: ", user);


        if (!user) {
            const err = new Error("Invalid Email!");
            err.statusCode = StatusCodes.NOT_FOUND;
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

        const token = jwtUtil.generateToken({ id: user.id, email: user.email, role: user.role });
        delete user.password;

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

export default {
    login,
}
