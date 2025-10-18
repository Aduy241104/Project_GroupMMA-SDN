import Story from "../models/story.js";
import { getMostViewedStories } from "../services/storiesServices.js";


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

        const result = await getMostViewedStories();

        res.status(200).json(result);

    } catch (error) {
        console.log("💥ERROR: ", error);
        res.status(500)
    }
}


export default {
    getAllStory,
    getHomeData
}