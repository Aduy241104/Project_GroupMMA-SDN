import Like from '../models/like.js';
import { StatusCodes } from 'http-status-codes';
import { increaseStoryLike } from '../services/storiesServices.js';


const likeStory = async (req, res, next) => {
    const { storyId } = req.params;
    const user = req.user;
    try {

        console.log("USER: ", user);
        const data = {
            userId: user.id,
            storyId: storyId
        }
        await increaseStoryLike(storyId);

        const result = await Like.create(data);
        res.status(StatusCodes.CREATED).json(result);
    } catch (error) {
        next(error);
    }
}

const unlikeStory = async (req, res, next) => {
    const { storyId } = req.params;
    const user = req.user;
    try {

        console.log("USER: ", user);
        const data = {
            userId: user.id,
            storyId: storyId
        }
        await increaseStoryLike(storyId);

        const result = await Like.create(data);
        res.status(StatusCodes.CREATED).json(result);
    } catch (error) {
        next(error);
    }
}

export default {
    likeStory
}