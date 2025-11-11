import Author from "../models/author.js";
import { StatusCodes } from "http-status-codes";

// Lấy tất cả authors
export const getAllAuthors = async (req, res) => {
    try {
        const authors = await Author.find().sort({ createdAt: -1 });
        res.status(StatusCodes.OK).json({
            success: true,
            data: authors
        });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
            success: false,
            message: "Lỗi server" 
        });
    }
};

export default {
    getAllAuthors
};

