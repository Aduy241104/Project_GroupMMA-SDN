import Chapter from '../models/chapter.js';
import { StatusCodes } from 'http-status-codes';


const getChaptersByStoryId = async (req, res, next) => {
    const { id } = req.params;

    try {

        const data = await Chapter.find({ storyId: id })
            .sort({ chapterNumber: -1 })
            .select("-__v -createdAt -updatedAt -images -content");

        const responseData = {
            success: true,
            statusCode: StatusCodes.OK,
            message: "Find chapters successfully",
            data: {
                chapters: data
            }
        }
        res.status(StatusCodes.OK).json(responseData);
    } catch (error) {
        next(error);
    }
}


const getChapterContent = async (req, res, next) => {
    const { id } = req.params;
    try {

        const data = await Chapter.findById(id).select("-__v -createdAt -updatedAt");
        console.log("TEST DATA: ", data);

        if (!data) {
            const err = new Error("Chapter not found");
            err.statusCode = StatusCodes.NOT_FOUND;
            return next(err);
        }

        const responseData = {
            success: true,
            statusCode: StatusCodes.OK,
            message: "Find chapters successfully",
            data: {
                chapterDetail: data
            }
        }
        res.status(StatusCodes.OK).json(responseData);
    } catch (error) {
        next(error);
    }
}

export default {
    getChaptersByStoryId,
    getChapterContent
}