import Story from "../models/story.js";
import { getAddRecently, getMostViewedStories, getUpdateRecently } from "../services/storiesServices.js";
import { StatusCodes } from "http-status-codes";


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


export default {
    getAllStory,
    getHomeData
}