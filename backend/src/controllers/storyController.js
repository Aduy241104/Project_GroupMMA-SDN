import Story from "../models/story.js";
import { getAddRecently, getMostViewedStories, getUpdateRecently } from "../services/storiesServices.js";
import { StatusCodes } from "http-status-codes";
import Author from "../models/author.js";


const getAllStory = async (req, res) => {

    try {
        const result = await Story.find();
        res.status(200).json(result);
    } catch (error) {
        console.log("💥ERROR: ", error);
        res.status(500)
    }
}


const getHomeData = async (req, res) => {

    try {
        const mostViewedStories = await getMostViewedStories();
        const updatedRecentlyStories = await getUpdateRecently();
        const addedRecentlyStories = await getAddRecently();

        const responseData = {
            success: true,
            statusCode: StatusCodes.OK,
            message: "Get main data successfully",
            data: {
                mostViewedStories: mostViewedStories,
                updatedRecentlyStories: updatedRecentlyStories,
                addedRecentlyStories: addedRecentlyStories
            }
        }

        res.status(StatusCodes.OK).json(responseData);
    } catch (error) {
        console.log("💥ERROR: ", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
    }
}


const getMostViewedData = async (req, res, next) => {
    try {

        const mostViewedStories = await getMostViewedStories(20);
        res.status(200).json({
            success: true,
            statusCode: StatusCodes.OK,
            message: "Get most viewed data successfully",
            data: {
                mostViewedStory: mostViewedStories
            }
        })

    } catch (error) {
        console.log("💥ERROR: ", error);
        next(error);
    }
}


const findStory = async (req, res, next) => {
    const { type, keyword } = req.query;

    try {

        const query = {};
        const normalizeKeyword = String(keyword).toLowerCase();

        if (type === "title") {
            query.title = { $regex: normalizeKeyword, $options: "i" };
        } else if (type === "author") {
            const authorObj = await Author.findOne({ name: { $regex: normalizeKeyword, $options: "i" } });

            if (!authorObj) {
                const err = new Error("Author not found");
                err.statusCode = StatusCodes.NOT_FOUND;
                return next(err)
            }
            query.authorId = authorObj._id;
        }

        const data = await Story.find(query)
            .populate(
                [
                    { path: "authorId", select: "name" },
                    { path: "categoryIds", select: "name" }
                ]
            )
            .select("-createdBy -__v -createdAt");

        const responseData = {
            success: true,
            statusCode: StatusCodes.OK,
            message: "Find story successfully",
            data: {
                stories: data
            }
        }
        res.status(StatusCodes.OK).json(responseData);
    } catch (error) {
        next(error);
    }
}

const updateStoryView = async (req, res, next) => {
    const { id } = req.params;
    try {

        const story = await Story.findByIdAndUpdate(
            id,
            { $inc: { views: 1 } },
            { new: true, runValidators: true }
        ).select("title views");


        if (!story) {
            const err = new Error("Story not found");
            err.statusCode = StatusCodes.NOT_FOUND;
            return next(err);
        }


        const responseData = {
            success: true,
            statusCode: StatusCodes.OK,
            message: "View updated successfully",
            data: {
                story: story
            }
        }

        res.status(StatusCodes.OK).json(responseData);
    } catch (error) {
        next(error);
    }
}

export default {
    getAllStory,
    getHomeData,
    findStory,
    updateStoryView,
    getMostViewedData
}