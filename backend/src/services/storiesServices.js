import Story from "../models/story.js";
import Category from "../models/category.js";
import Author from "../models/author.js";
import Chapter from "../models/chapter.js"

export const getMostViewedStories = async (limit = 5) => {
    return await Story.find()
        .sort({ views: -1 })
        .limit(limit)
        .populate([
            { path: "categoryIds", select: "name" },
            { path: "authorId", select: "name" }
        ]);
}


export const getUpdateRecently = async (limit = 2) => {
    const data = await Chapter.find()
        .sort({ updatedAt: -1 })
        .limit(limit)
        .populate(
            {
                path: "storyId",
                populate: { path: "authorId", select: "name" },
                select: "-slug -createAt -updatedAt"
            }
        )
        .select("content images");
    return data;
}

export const getAddRecently = async (limit = 5) => {
    const data = await Story.find()
        .sort({ createAt: -1 })
        .limit(limit)
        .populate([
            { path: "authorId", select: "name" },
            { path: "categoryIds", select: "name" }
        ]);

    return data;
}

export const increaseStoryLike = async (storyId) => {
    const data = await Story.findByIdAndUpdate(
        storyId,
        { $inc: { totalLikes: 1 } },
        { new: true, runValidators: true }
    ).select("title totalLikes");

    return data;
}

