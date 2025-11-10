import Like from '../models/like.js';
import { StatusCodes } from 'http-status-codes';
import { decreseStoryLike, increaseStoryLike } from '../services/storiesServices.js';


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

        const data = {
            userId: user.id,
            storyId: storyId
        }
        await decreseStoryLike(storyId);

        const result = await Like.deleteOne(data);
        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        next(error);
    }
}

const checkLiked = async (req, res) => {
    const user = req.user;
    const { storyId } = req.params;
    try {

        const isLiked = await Like.exists({ storyId: storyId, userId: user.id });

        if (isLiked) {
            return res.status(200).json({ isLiked: true })
        }
        res.status(200).json({ isLiked: false })

    } catch (error) {
        next(error);
    }
}

export default {
    likeStory,
    unlikeStory,
    checkLiked
}