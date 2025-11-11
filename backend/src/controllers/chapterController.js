import Chapter from '../models/chapter.js';
import { StatusCodes } from 'http-status-codes';
import Story from '../models/story.js';



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
};

// 🔹 Admin - thêm chapter
const createChapter = async (req, res, next) => {
    try {
        const { storyId, chapterNumber, title, content, images } = req.body;

        const story = await Story.findById(storyId);
        if (!story) return res.status(StatusCodes.NOT_FOUND).json({ message: "Story not found" });
        if (story.type !== "novel") return res.status(StatusCodes.BAD_REQUEST).json({ message: "Only 'novel' stories can add chapters" });

        const newChapter = new Chapter({ storyId, chapterNumber, title, content, images });
        await newChapter.save();

        res.status(StatusCodes.CREATED).json({
            success: true,
            message: "Chapter created successfully",
            data: newChapter
        });
    } catch (error) {
        next(error);
    }
};
// 🔹 Admin - sửa chapter
const updateChapter = async (req, res, next) => {
    try {
        const { id } = req.params;
        const chapter = await Chapter.findById(id);
        if (!chapter) return res.status(StatusCodes.NOT_FOUND).json({ message: "Chapter not found" });

        const story = await Story.findById(chapter.storyId);
        if (!story) return res.status(StatusCodes.NOT_FOUND).json({ message: "Story not found" });
        if (story.type !== "novel") return res.status(StatusCodes.BAD_REQUEST).json({ message: "Only 'novel' stories can update chapters" });

        const updated = await Chapter.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        res.status(StatusCodes.OK).json({
            success: true,
            message: "Chapter updated successfully",
            data: updated
        });
    } catch (error) {
        next(error);
    }
};

// 🔹 Admin - xóa chapter
const deleteChapter = async (req, res, next) => {
    try {
        const { id } = req.params;
        const chapter = await Chapter.findById(id);
        if (!chapter) return res.status(StatusCodes.NOT_FOUND).json({ message: "Chapter not found" });

        const story = await Story.findById(chapter.storyId);
        if (!story) return res.status(StatusCodes.NOT_FOUND).json({ message: "Story not found" });
        if (story.type !== "novel") return res.status(StatusCodes.BAD_REQUEST).json({ message: "Only 'novel' stories can delete chapters" });

        await Chapter.findByIdAndDelete(id);

        res.status(StatusCodes.OK).json({
            success: true,
            message: "Chapter deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

export default {
    getChaptersByStoryId,
    getChapterContent,
    createChapter,
    updateChapter,
    deleteChapter
}